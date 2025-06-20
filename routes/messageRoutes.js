import express from "express";
import {requireSignIn, attachUser} from "../middlewares/index.js"
import { sendMessage, getMessages, getChatUsers } from "../controller/messageCtrl.js";
import userModel from "../models/userModel.js";

const router = express.Router();

router.post('/send-message', requireSignIn, attachUser, sendMessage);
router.get('/messages/:userId', requireSignIn, attachUser, getMessages);
router.get('/chat-users', requireSignIn, attachUser, getChatUsers);

router.get("/find-people", requireSignIn, attachUser, async (req, res) => {
  const query = req.query.q?.toLowerCase();
  const users = await userModel.find({
    $or: [
      { name: new RegExp(query, "i") },
      { username: new RegExp(query, "i") }
    ],
    _id: { $ne: req.user._id },
  }).select("_id name username image");
  res.json(users);
});

router.put("/clear-message-notification/:userId", requireSignIn, attachUser, async (req, res) => {
  try {
    const user = await userModel.findById(req.auth._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Ensure the field exists to avoid runtime errors
    if (!Array.isArray(user.messageNotifications)) {
      user.messageNotifications = [];
    }

    user.messageNotifications = user.messageNotifications.filter(
      (notif) => notif.from.toString() !== req.params.userId
    );

    await user.save();

    res.json({ ok: true });
  } catch (err) {
    console.error("Clear notification error:", err);
    res.status(500).json({ error: "Failed to clear notifications" });
  }
});



export default router;
