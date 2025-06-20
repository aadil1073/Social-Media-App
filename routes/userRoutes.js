import express from "express";
import userModel from "../models/userModel.js";
import mongoose from "mongoose";
import { requireSignIn, attachUser } from '../middlewares/index.js';
import {
  sendFollowRequest,
  acceptFollowRequest,
  rejectFollowRequest,
  getNotifications,
} from '../controller/userController.js';

const router = express.Router();


// follow-request
router.put('/follow-request/:id', requireSignIn, attachUser, sendFollowRequest);

//accept-request
router.put('/accept-follow/:id', requireSignIn, attachUser, acceptFollowRequest);

// reject-request
router.put('/reject-follow/:id', requireSignIn, attachUser, rejectFollowRequest);

//notification
router.get('/notifications', requireSignIn, attachUser, getNotifications);

// unfollow route
router.put('/unfollow/:id', requireSignIn, attachUser, async (req, res) => {
  try {
    const currentUserId = req.auth._id;
    const targetUserId = req.params.id;

    // Remove target from current user's following
    await userModel.findByIdAndUpdate(currentUserId, {
      $pull: { following: targetUserId }
    });

    // Remove current user from target's followers
    await userModel.findByIdAndUpdate(targetUserId, {
      $pull: { followers: currentUserId }
    });

  const updatedUser = await userModel
  .findById(currentUserId)
  .select("-password")
  .populate("followers", "username image")
  .populate("following", "username image");


    res.json(updatedUser);
  } catch (err) {
    console.error("Unfollow error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


router.get('/follow-list/:type', requireSignIn, attachUser, async (req, res) => {
  try {
    const type = req.params.type; 
    const userId = req.auth._id;

    const user = await userModel.findById(userId).select(type);
    if (!user) return res.status(404).json({ error: "User not found" });

    const ids = user[type]; 

    // Fetch existing users by ID
    const existingUsers = await userModel.find({
      _id: { $in: ids }
    }).select("username name image");

    const existingUserIds = existingUsers.map(u => u._id.toString());
    const allIds = ids.map(id => id.toString());

    // Find deleted IDs
    const deletedIds = allIds.filter(id => !existingUserIds.includes(id));

    if (deletedIds.length > 0) {
      await userModel.findByIdAndUpdate(userId, {
        $pull: {
          [type]: { $in: deletedIds.map(id => new mongoose.Types.ObjectId(id)) }
        }
      });
    }

    res.json(existingUsers);
  } catch (err) {
    console.error("Error fetching follow list:", err);
    res.status(500).json({ error: "Error fetching follow list" });
  }
});


export default router;



