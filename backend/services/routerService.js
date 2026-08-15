import { classifyQuery, generateWithFlash } from "./geminiService.js";
import {
  classifyQueryWithGroq,
  generateWithGroq,
  generateGeneralWithGroq,
} from "./groqService.js";
import { generateWithOpenRouter } from "./openrouterService.js";

const SHORT_QUERY_THRESHOLD = 20;

/**
 * Classifies the query using Groq first (fast, generous free quota),
 * falling back to Gemini's classifier only if Groq fails.
 */
async function classify(query) {
  try {
    return await classifyQueryWithGroq(query);
  } catch (error) {
    console.error(
      "[router] Groq classification failed, falling back to Gemini:",
      error.message
    );
    return classifyQuery(query);
  }
}

/**
 * Generates a GENERAL response using Groq first, falling back to
 * Gemini Flash if Groq fails.
 */
async function answerGeneral(query) {
  try {
    const response = await generateGeneralWithGroq(query);
    return { engine: "llama-3.1-8b-instant", response };
  } catch (error) {
    console.error(
      "[router] Groq GENERAL request failed, falling back to gemini-flash-latest:",
      error.message
    );
    const response = await generateWithFlash(query);
    return { engine: "gemini-flash-latest", response };
  }
}

/**
 * Routes a query to the correct engine and returns the category,
 * engine used, and the generated response text.
 *
 * This routing stack runs entirely on free tiers, with Groq as the
 * primary engine (fast + generous quota) and Gemini as a backup:
 * - query.length < 20  -> skip classification, answer directly (GENERAL)
 * - CODING             -> Groq (llama-3.3-70b-versatile), falls back to Gemini
 * - CREATIVE           -> OpenRouter (google/gemma-2-9b-it:free), falls back to Groq, then Gemini
 * - GENERAL            -> Groq (llama-3.1-8b-instant), falls back to Gemini
 */
export async function routeQuery(query) {
  if (query.trim().length < SHORT_QUERY_THRESHOLD) {
    const { engine, response } = await answerGeneral(query);
    return { category: "GENERAL", engine, response };
  }

  const category = await classify(query);

  switch (category) {
    case "CODING": {
      try {
        const response = await generateWithGroq(query);
        return { category, engine: "llama-3.3-70b-versatile", response };
      } catch (error) {
        console.error(
          "[router] Groq CODING request failed, falling back to gemini-flash-latest:",
          error.message
        );
        const response = await generateWithFlash(query);
        return { category, engine: "gemini-flash-latest", response };
      }
    }

    case "CREATIVE": {
      try {
        const response = await generateWithOpenRouter(query);
        return { category, engine: "gemma-2-9b-it", response };
      } catch (error) {
        console.error(
          "[router] OpenRouter request failed, falling back to Groq:",
          error.message
        );
        try {
          const response = await generateWithGroq(query);
          return { category, engine: "llama-3.3-70b-versatile", response };
        } catch (groqError) {
          console.error(
            "[router] Groq CREATIVE fallback failed, falling back to gemini-flash-latest:",
            groqError.message
          );
          const response = await generateWithFlash(query);
          return { category, engine: "gemini-flash-latest", response };
        }
      }
    }

    case "GENERAL":
    default: {
      const { engine, response } = await answerGeneral(query);
      return { category: "GENERAL", engine, response };
    }
  }
}