import OpenAI from "openai";

import { env } from "../config/env.js";

const client = new OpenAI({
    apiKey:env.OPENROUTER_API_KEY,
    baseURL : "https://openrouter.ai/v1",
    defaultHeaders:{
        "HTTP-Referer" : "https://smart-ai-router.local",
        "X-Title" : "Smart AI Router",
    },
});

const CREATIVE_MODEL = "google/gemma-2-9b-it:free";

export async function generateWithOpenRouter(query){
    const completions = await client.chat.completions.create({
        model:CREATIVE_MODEL,
        message:[{ role:"user" , content:query}],
    });
const text = completions.choices?.[0].message?.content;

if(!text){
    throw new Error("OpenRouter returned an empty response");
}

return text;
}

export const OPENROUTER_MODELS = {
CREATIVE : CREATIVE_MODEL,
};