import { Router } from "express";

import { handleChat } from "../controllers/chatController.js";

import { validateChatRequest } from "../middleware/validateRequest.js";

const router = Router();

router.post("/" , validateChatRequest , handleChat);

export default router;