import messageModel from "../models/messageModel.js";
import userModel from "../models/userModel.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.auth._id;
    const { receiverId, content } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ error: "Receiver and content are required." });
    }

    const message = await new messageModel({
      sender: senderId,
      receiver: receiverId,
      content,
    }).save();

    // Update message notification in user model
    const receiver = await userModel.findById(receiverId);
    if (!receiver) return res.status(404).json({ error: "Receiver not found." });

    if (!Array.isArray(receiver.messageNotifications)) {
      receiver.messageNotifications = [];
    }

    const existingNotif = receiver.messageNotifications.find(
      (n) => n.from.toString() === senderId.toString()
    );

    if (existingNotif) {
      existingNotif.count += 1;
    } else {
      receiver.messageNotifications.push({ from: senderId, count: 1 });
    }

    await receiver.save();

    res.json(message);
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ error: "Server error while sending message." });
  }
};


export const getMessages = async (req, res) => {
  try {
    const currentUserId = req.auth._id;
    const targetUserId = req.params.userId;

    const messages = await messageModel.find({
      $or: [
        { sender: currentUserId, receiver: targetUserId },
        { sender: targetUserId, receiver: currentUserId },
      ],
    })
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).send("Error fetching messages");
  }
};

export const getChatUsers = async (req, res) => {
  try {
    const currentUserId = req.auth._id;

    const sent = await messageModel.find({ sender: currentUserId }).distinct('receiver');
    const received = await messageModel.find({ receiver: currentUserId }).distinct('sender');

    const uniqueUserIds = [...new Set([...sent, ...received])];

    const users = await userModel.find({ _id: { $in: uniqueUserIds } }).select('_id name username image');

    res.json(users);
  } catch (err) {
    console.error("Get chat users error", err);
    res.status(500).json({ error: "Failed to fetch chat users" });
  }
};
