import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env.js";

const ai = new GoogleGenAI({ apiKey : env.GEMINI_API_KEY});

const CLASSIFIER_MODEL = "gemini-flash-latest";
const FLASH_MODEL = "gemini-flash-latest";

const VALID_CATEGORIES = ["CODING" , "CREATIVE" , "GENERAL"];

export async function classifyQuery(query){
    const prompt = `You are a strict query classifier for an AI routing system.
    Classify the user query into exactly one of these categories:
    -CODING : programming , debugging , code review , technical/software engineering questions
    -CREATIVE: creative writing , storytelling , marketing , copy , poems , brainstroming ideas
    -GENERAL:everything else(facts , explanations , conversation , general questions) 
    
    Respond with ONLY the single category word and nothing else. No punctution , no explanation.
    
    Query:"${query}`;

    const result = await ai.models.generateContent({
        model:CLASSIFIER_MODEL,
        contents:prompt,
        config:{
            temperature:0,
            maxOutputTokens:10,
        },
    });

    const text = (result.text || "").trim().toUpperCase();
    const category = VALID_CATEGORIES.find((c) => 
        text.includes(c));
return category || "GENERAL";
}

export async function generateWithFlash(query){
    const result = await ai.models.generateContent({
        model:FLASH_MODEL,
        contents:query,
    });

    return result.text || "";
}

export const GEMINI_MODELS = {
FLASH:FLASH_MODEL,
};