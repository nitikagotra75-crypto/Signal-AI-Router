import OpenAI from "openai";
import { env }  from "../config/env.js";

const client = new OpenAI({
    apiKey:process.env.GROQ_API_KEY,
    baseURL:"https://api.groq.com/openai/v1",
});

const CODING_MODEL = "llama-3.3-70b-versatile";
const CLASSIFIER_MODEL = "llama-3.1-8b-instant";
const GENERAL_MODEL = "llama-3.1-8b-instant";

const VALID_CATEGORIES = ["CODING" , "CREATIVE" , "GENERAL"];

export async function classifyQueryWithGroq(query){
    const prompt = `You are a strict query classifier for an AI routing system.
    Classify the user query into exactly ONE of these Categories:
    -CODING : programmng , debugging , code review , technical/software engineering questions 
    -CREATIVE : Creative writing , storytelling , marketing copy . poems , sngs , brainstroming ideas
    -GENERAL : everything else(facts . explanations , conversation ,  general questions) 
    
    Respond with ONLY single category word and nothing else. No punctuation , no explanations.
    
    Examples:
    "Write a poem about the rain" -> CREATIVE
    "Fix this python function" -> CODING
    "What is capital of JAPAN " -> GENERAL
    "Write a short story about dragon " -> CREATIVE
    "Compose a song about heartbreak" -> CREATIVE

    Query: "${query}"`;

    const completion = await client.chat.completions.create({
        model:CLASSIFIER_MODEL,
        temperature: 0,
        max_tokens : 10,
        message: [{role: "user" , content : prompt}],
    });

    const text = (completion.choices?.[0]?.message?.content || "").trim().toUpperCase();
    const category = VALID_CATEGORIES.find((c) => text.includes(c));

    return category || "GENERAL";
}

export async function generateWithGroq(query){
    const completion = await client.chat.completions.create({
        model:CODING_MODEL,
        messages:[{role:"user" , content:query}],
    });

    const text = completion.choices?.[0].message?.content;

    if(!text){
        throw new Error("Groq returned an empty response");
    }
    return text;
}

export async function generateGeneralWithGroq(query){
    const completion = await client.chat.completions.create({
        model:GENERAL_MODEL,
        messages : [{ role:"user" , content:query}],
    });

    const text = completion.choices?.choices?.[0]?.message?.content;

    if(!text){
        throw new Error("Groq returned an empty response");
    }
    return text;
}

export const GROQ_MODELS = {
    CODING:CODING_MODEL,
    CLASSIFIER : CLASSIFIER_MODEL,
    GENERAL : GENERAL_MODEL,
};