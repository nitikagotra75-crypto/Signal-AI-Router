import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import chatRoutes from "./routes/chatRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import { notFoundHandler , errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(
    cors({
        origin : env.CLIENT_ORIGIN,
    })
);

app.use(express.json({ limit : "1mb"}));

app.get("/api/health" , (req , res) => {
    res.status(200).json({ status:"ok"});
});

app.use("/api/chat" , chatRoutes);
app.use("/api/analytics" , analyticsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;