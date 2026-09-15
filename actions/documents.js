"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  chunkText,
  insertDocumentChunks,
  searchSimilarChunks,
} from "@/lib/vector";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Upload and process a financial document for RAG semantic search
 */
export async function uploadDocument(formData) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId },
    });
    if (!user) throw new Error("User not found");

    const file = formData.get("file");
    const category = formData.get("category") || "FINANCIAL_DOC";

    if (!file || typeof file === "string") {
      throw new Error("No file uploaded");
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error("File size must be under 10MB");
    }

    const filename = file.name || "Untitled Document";
    const mimeType = file.type || "application/octet-stream";

    // Extract text from file
    let extractedText = "";

    if (mimeType.includes("pdf") || mimeType.startsWith("image/")) {
      // Use Gemini Vision / Multimodal OCR to extract complete text and tabular data
      const arrayBuffer = await file.arrayBuffer();
      const base64String = Buffer.from(arrayBuffer).toString("base64");

      const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
      const prompt = `Extract and transcribe the full contents, tables, and financial details of this document into clean, readable text. 
Preserve all amounts, dates, accounts, merchants, transaction lists, and financial terms accurately.`;

      const result = await model.generateContent([
        {
          inlineData: {
            data: base64String,
            mimeType: mimeType.includes("pdf") ? "application/pdf" : mimeType,
          },
        },
        prompt,
      ]);

      extractedText = result.response.text();
    } else {
      // Text or CSV
      extractedText = await file.text();
    }

    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error("Could not extract readable text from this document");
    }

    // 1. Create document record
    const document = await db.document.create({
      data: {
        userId: user.id,
        filename,
        category,
        fileSize: file.size,
        status: "INDEXING",
      },
    });

    // 2. Chunk text
    const chunks = chunkText(extractedText, 800, 150);

    if (chunks.length === 0) {
      chunks.push(extractedText.slice(0, 1500));
    }

    // 3. Generate embeddings & insert into Supabase pgvector
    await insertDocumentChunks(chunks, document.id, user.id);

    // 4. Mark status COMPLETED
    const completedDoc = await db.document.update({
      where: { id: document.id },
      data: { status: "COMPLETED" },
    });

    revalidatePath("/documents");
    revalidatePath("/dashboard");

    return {
      success: true,
      data: {
        id: completedDoc.id,
        filename: completedDoc.filename,
        category: completedDoc.category,
        chunkCount: chunks.length,
      },
    };
  } catch (error) {
    console.error("Document upload error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Fetch all documents uploaded by user
 */
export async function getUserDocuments() {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId },
    });
    if (!user) throw new Error("User not found");

    const documents = await db.document.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { chunks: true },
        },
      },
    });

    return {
      success: true,
      data: documents.map((d) => ({
        id: d.id,
        filename: d.filename,
        category: d.category,
        fileSize: d.fileSize,
        status: d.status,
        chunkCount: d._count.chunks,
        createdAt: d.createdAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error("Error fetching documents:", error);
    return { success: false, error: error.message, data: [] };
  }
}

/**
 * Delete a document and all associated vector chunks
 */
export async function deleteDocument(documentId) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId },
    });
    if (!user) throw new Error("User not found");

    // Delete chunks first
    await db.$executeRawUnsafe(
      `DELETE FROM "document_chunks" WHERE "documentId" = $1 AND "userId" = $2`,
      documentId,
      user.id,
    );

    // Delete document
    await db.document.delete({
      where: {
        id: documentId,
        userId: user.id,
      },
    });

    revalidatePath("/documents");
    return { success: true };
  } catch (error) {
    console.error("Error deleting document:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Search user's document knowledge base directly
 */
export async function searchDocumentsAction(queryText) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId },
    });
    if (!user) throw new Error("User not found");

    const results = await searchSimilarChunks({
      userId: user.id,
      queryText,
      limit: 6,
      minSimilarity: 0.3,
    });

    return { success: true, data: results };
  } catch (error) {
    console.error("Error in searchDocumentsAction:", error);
    return { success: false, error: error.message, data: [] };
  }
}
