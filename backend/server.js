import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";

async function start(){
    await connectDB();

    app.listen(env.PORT,() => {
        console.log(`[server] Smart AI Router backend running on port ${env.PORT}`);
    });
}

start();