import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { searchSimilarChunks } from "@/lib/vector";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const user = await db.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Messages are required" }), {
        status: 400,
      });
    }

    const lastUserMessage = messages[messages.length - 1]?.content || "";

    // 1. Gather live financial database context
    const [accounts, budget, recentTransactions] = await Promise.all([
      db.account.findMany({
        where: { userId: user.id },
        select: {
          id: true,
          name: true,
          type: true,
          balance: true,
          isDefault: true,
        },
      }),
      db.budget.findUnique({
        where: { userId: user.id },
        select: { amount: true },
      }),
      db.transaction.findMany({
        where: { userId: user.id },
        take: 20,
        orderBy: { date: "desc" },
        include: { account: { select: { name: true } } },
      }),
    ]);

    // Calculate current month's spending
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthExpensesAgg = await db.transaction.aggregate({
      where: {
        userId: user.id,
        type: "EXPENSE",
        date: { gte: startOfMonth },
      },
      _sum: { amount: true },
    });
    const currentMonthExpenses = monthExpensesAgg._sum.amount
      ? monthExpensesAgg._sum.amount.toNumber()
      : 0;

    // Calculate spending breakdown by category over last 30 days
    const categoryTotals = {};
    let totalIncome30d = 0;
    let totalExpenses30d = 0;

    for (const tx of recentTransactions) {
      const amt = tx.amount.toNumber();
      if (tx.type === "EXPENSE") {
        totalExpenses30d += amt;
        categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + amt;
      } else if (tx.type === "INCOME") {
        totalIncome30d += amt;
      }
    }

    // 2. RAG Semantic Search over user's uploaded documents (pgvector)
    let relevantDocumentSnippets = [];
    try {
      relevantDocumentSnippets = await searchSimilarChunks({
        userId: user.id,
        queryText: lastUserMessage,
        limit: 4,
        minSimilarity: 0.35,
      });
    } catch (ragError) {
      console.warn("RAG search warning:", ragError.message);
    }

    // 3. Assemble Grounded Context
    const financialContext = {
      user: { name: user.name, email: user.email },
      accounts: accounts.map((a) => ({
        name: a.name,
        type: a.type,
        balance: a.balance.toNumber(),
        isDefault: a.isDefault,
      })),
      budget: budget
        ? {
            monthlyLimit: budget.amount.toNumber(),
            spentThisMonth: currentMonthExpenses,
            remaining: budget.amount.toNumber() - currentMonthExpenses,
            percentUsed:
              Math.round(
                (currentMonthExpenses / budget.amount.toNumber()) * 100,
              ) + "%",
          }
        : null,
      summary30Days: {
        totalIncome: totalIncome30d,
        totalExpenses: totalExpenses30d,
        netSavings: totalIncome30d - totalExpenses30d,
        spendingByCategory: categoryTotals,
      },
      recentTransactions: recentTransactions.slice(0, 10).map((t) => ({
        date: t.date.toISOString().split("T")[0],
        type: t.type,
        amount: t.amount.toNumber(),
        category: t.category,
        description: t.description || "N/A",
        account: t.account?.name || "Primary",
      })),
      matchedDocumentKnowledge: relevantDocumentSnippets.map((doc) => ({
        sourceDocument: doc.filename,
        category: doc.category,
        similarity: Math.round(doc.similarity * 100) + "%",
        excerpt: doc.content,
      })),
    };

    const systemInstruction = `You are WELTH AI, the expert AI Financial Copilot on the WELTH wealth platform.
You have direct access to the user's live financial data and knowledge base:

=== USER FINANCIAL DATA & CONTEXT ===
${JSON.stringify(financialContext, null, 2)}
====================================

Instructions for your responses:
1. Always base numbers, balances, budgets, and transactions strictly on the data provided above.
2. If the user asks about bank statements, receipts, contracts, or uploaded documents, reference the "matchedDocumentKnowledge" section and cite the document name.
3. If the user asks whether they can afford a purchase, assess their total liquid balance, remaining monthly budget, and recent burn rate to give an honest, actionable recommendation.
4. Format all currency amounts cleanly with "$" and use markdown bullet points, tables, and bold highlights for readability.
5. Keep answers proactive, concise, and helpful. If you notice a high expense category or budget strain, offer a friendly, practical tip.`;

    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      systemInstruction,
    });

    // Build chat history: Gemini requires history to begin with role 'user' and alternate
    const history = [];
    const conversationTurns = messages.slice(0, -1);
    const firstUserIdx = conversationTurns.findIndex((m) => m.role === "user");

    if (firstUserIdx !== -1) {
      const relevantTurns = conversationTurns.slice(firstUserIdx);
      for (const msg of relevantTurns) {
        if (!msg.content || typeof msg.content !== "string") continue;
        const role = msg.role === "user" ? "user" : "model";
        if (history.length === 0 || history[history.length - 1].role !== role) {
          history.push({ role, parts: [{ text: msg.content }] });
        }
      }
    }

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastUserMessage);
    const reply = result.response.text();

    return new Response(
      JSON.stringify({
        content: reply,
        sources: relevantDocumentSnippets.map((s) => ({
          filename: s.filename,
          similarity: Math.round(s.similarity * 100) + "%",
        })),
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("FinBot route error:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to generate AI financial response",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
