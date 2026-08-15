// Single source of truth for the color coding used to represent
// categories and engines across the Chat and Dashboard views.

export const CATEGORY_STYLES = {
  CODING: { label: "Coding", color: "#2E5AAC" },
  CREATIVE: { label: "Creative", color: "#B8482E" },
  GENERAL: { label: "General", color: "#6B6F76" },
};

export const ENGINE_STYLES = {
  "llama-3.3-70b-versatile": { label: "Llama 3.3 70B (Groq)", color: "#2E5AAC" },
  "gemma-2-9b-it": { label: "Gemma 2 9B (OpenRouter)", color: "#B8482E" },
  "gemini-2.5-flash": { label: "Gemini 2.5 Flash", color: "#6B6F76" },
};

export function getCategoryStyle(category) {
  return CATEGORY_STYLES[category] || { label: category, color: "#6B6F76" };
}

export function getEngineStyle(engine) {
  return ENGINE_STYLES[engine] || { label: engine, color: "#6B6F76" };
}
