"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createTransaction } from "./transaction";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Parses freeform natural language text into a structured transaction payload
 */
export async function parseQuickLog(input) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId },
      include: { accounts: true },
    });
    if (!user) throw new Error("User not found");

    const accountsList = user.accounts.map((a) => ({
      id: a.id,
      name: a.name,
      type: a.type,
      isDefault: a.isDefault,
    }));

    const defaultAccount =
      user.accounts.find((a) => a.isDefault) || user.accounts[0];

    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const currentDate = new Date().toISOString();

    const prompt = `You are a financial entity extraction engine.
Today's date and time is: ${currentDate}.
The user has the following accounts:
${JSON.stringify(accountsList, null, 2)}

Default account ID: "${defaultAccount ? defaultAccount.id : ""}"

Analyze the following user input describing a financial transaction:
"${input}"

Extract the transaction into this JSON structure:
{
  "type": "EXPENSE" or "INCOME",
  "amount": number (positive float, e.g. 24.50),
  "description": "clean short description of the item or merchant",
  "category": "one of: housing, transportation, groceries, food, utilities, entertainment, healthcare, shopping, education, personal_care, travel, insurance, gifts, bills, salary, freelance, investments, other",
  "date": "ISO 8601 date string based on relative terms like 'yesterday', 'today', 'last Friday', or specific dates",
  "accountId": "the matching account id from the user's accounts list if mentioned by name, otherwise use the default account ID"
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text);

    // Validate and fallback
    if (!parsed.amount || isNaN(parsed.amount)) {
      throw new Error(
        "Could not detect a valid transaction amount from the text",
      );
    }

    if (!parsed.accountId && defaultAccount) {
      parsed.accountId = defaultAccount.id;
    }

    const matchedAccount =
      user.accounts.find((a) => a.id === parsed.accountId) || defaultAccount;

    return {
      success: true,
      data: {
        type: parsed.type === "INCOME" ? "INCOME" : "EXPENSE",
        amount: Number(parsed.amount),
        description: parsed.description || "Quick log transaction",
        category: parsed.category || "other",
        date: parsed.date
          ? new Date(parsed.date).toISOString()
          : new Date().toISOString(),
        accountId: matchedAccount ? matchedAccount.id : null,
        accountName: matchedAccount ? matchedAccount.name : "Primary Account",
      },
    };
  } catch (error) {
    console.error("Quick log parsing error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Creates the parsed quick log transaction
 */
export async function confirmQuickLog(transactionData) {
  try {
    const { accountName, ...cleanData } = transactionData;
    const formattedData = {
      type: cleanData.type,
      amount: Number(cleanData.amount),
      description: cleanData.description,
      category: cleanData.category,
      date: new Date(cleanData.date),
      accountId: cleanData.accountId,
      isRecurring: false,
    };

    return await createTransaction(formattedData);
  } catch (error) {
    console.error("Confirm quick log error:", error);
    return { success: false, error: error.message };
  }
}
