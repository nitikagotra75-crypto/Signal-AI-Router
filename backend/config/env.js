import dotenv from "dotenv";

dotenv.config();

const required = ["MONGODB_URI" , "GEMINI_API_KEY" , "GROQ_API_KEY" , "OPENROUTER_API_KEY"];

const missing = required.filter((key) => !process.env[key]);

if(missing.length > 0){
    console.error(`[env] Missing required enviornment variables: ${missing.join(",")}`);
    console.error("[env] Copy backend/.env.example to backend/.env and fill in the values.");
    process.exit(1);
}

export const env = {
    PORT:process.env.PORT || 5000,
    MONGODB_URI : process.env.MONGODB_URI,
    GEMINI_API_KEY : process.env.GEMINI_API_KEY,
    GROQ_API_KEY : process.env.GROQ_API_KEY,
    OPENROUTER_API_KEY : process.env.OPENROUTER_API_KEY,
    CLIENT_ORIGIN : process.env.CLIENT_ORIGIN || "http://localhost:5173",
};