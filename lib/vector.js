import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate 3072-dimension vector embedding for input text
 */
export async function generateEmbedding(text) {
  if (!text || typeof text !== "string") {
    throw new Error("Text is required for embedding generation");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
  const result = await model.embedContent(text.slice(0, 8000));
  return result.embedding.values;
}

/**
 * Split text into semantic overlapping chunks
 */
export function chunkText(text, maxChars = 1000, overlap = 200) {
  if (!text) return [];

  // Normalize whitespace
  const normalized = text.replace(/\r\n/g, "\n").trim();
  const paragraphs = normalized.split(/\n{2,}/);
  const chunks = [];
  let currentChunk = "";

  for (const para of paragraphs) {
    const trimmedPara = para.trim();
    if (!trimmedPara) continue;

    if (currentChunk.length + trimmedPara.length + 2 <= maxChars) {
      currentChunk = currentChunk
        ? `${currentChunk}\n\n${trimmedPara}`
        : trimmedPara;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk);
      }
      // If single paragraph is larger than maxChars, slice with overlap
      if (trimmedPara.length > maxChars) {
        let start = 0;
        while (start < trimmedPara.length) {
          const end = Math.min(start + maxChars, trimmedPara.length);
          chunks.push(trimmedPara.slice(start, end));
          if (end === trimmedPara.length) break;
          start += maxChars - overlap;
        }
        currentChunk = "";
      } else {
        currentChunk = trimmedPara;
      }
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

/**
 * Insert multiple chunks with vector embeddings in batches
 */
export async function insertDocumentChunks(chunks, documentId, userId) {
  for (let i = 0; i < chunks.length; i++) {
    const content = chunks[i];
    const embedding = await generateEmbedding(content);
    const chunkId = `chunk_${Date.now()}_${i}`;
    const vectorStr = `[${embedding.join(",")}]`;

    await db.$executeRawUnsafe(
      `INSERT INTO "document_chunks" ("id", "documentId", "userId", "content", "metadata", "embedding", "createdAt")
       VALUES ($1, $2, $3, $4, $5::jsonb, $6::vector, NOW())`,
      chunkId,
      documentId,
      userId,
      content,
      JSON.stringify({ chunkIndex: i, totalChunks: chunks.length }),
      vectorStr,
    );
  }
}

/**
 * Semantic cosine similarity search over user's document chunks
 */
export async function searchSimilarChunks({
  userId,
  queryText,
  limit = 5,
  minSimilarity = 0.35,
}) {
  try {
    const embedding = await generateEmbedding(queryText);
    const queryVectorStr = `[${embedding.join(",")}]`;

    const results = await db.$queryRawUnsafe(
      `SELECT 
         c.id, 
         c."documentId", 
         c.content, 
         c.metadata, 
         d.filename, 
         d.category,
         1 - (c.embedding <=> $1::vector) as similarity
       FROM "document_chunks" c
       JOIN "documents" d ON c."documentId" = d.id
       WHERE c."userId" = $2
       ORDER BY c.embedding <=> $1::vector
       LIMIT $3`,
      queryVectorStr,
      userId,
      limit,
    );

    return results.filter((r) => r.similarity >= minSimilarity);
  } catch (error) {
    console.error("Error searching vector chunks:", error);
    return [];
  }
}
