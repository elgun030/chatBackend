import express from "express";
import { sendMessage, getMessage } from "../controllers/chat.controllers.js";

const router = express.Router();

router.post("/get/:chatPartnerId", getMessage);
router.post("/post/:chatPartnerId", sendMessage);

export default router;