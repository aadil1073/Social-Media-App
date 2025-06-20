import userModel from "../models/userModel.js";

// Send follow request
export const sendFollowRequest = async (req, res) => {
  try {
    const currentUserId = req.auth._id;
    const targetUserId = req.params.id;

    if (currentUserId === targetUserId) {
      return res.status(400).send("You cannot follow yourself");
    }

    const sender = await userModel.findById(currentUserId);
    const recipient = await userModel.findById(targetUserId);

    if (!recipient) return res.status(404).send("User not found");

    const alreadyRequested = recipient.pendingRequests.includes(currentUserId);
    const alreadyFollowing = recipient.followers.includes(currentUserId);

    if (alreadyRequested || alreadyFollowing) {
      return res.status(400).send("Already requested or following");
    }

    recipient.pendingRequests.push(currentUserId);
    recipient.notifications.push({
      type: "follow-request",
      from: currentUserId,
      createdAt: new Date(),
    });

    await recipient.save();
    res.status(200).send({ success: true, message: "Request sent" });
  } catch (err) {
    console.error("sendFollowRequest:", err);
    res.status(500).send("Server error");
  }
};

// Accept follow request
export const acceptFollowRequest = async (req, res) => {
  try {
    const recipientId = req.auth._id;
    const senderId = req.params.id;

    await userModel.findByIdAndUpdate(recipientId, {
      $addToSet: { followers: senderId },
      $pull: {
        pendingRequests: senderId,
        notifications: { type: "follow-request", from: senderId },
      },
    });

    await userModel.findByIdAndUpdate(senderId, {
      $addToSet: { following: recipientId },
    });

    const updatedUser = await userModel
      .findById(recipientId)
      .select("-password")
      .populate("notifications.from", "name username image");

    res.json(updatedUser);
  } catch (err) {
    console.error("acceptFollowRequest:", err);
    res.status(500).send("Error accepting follow");
  }
};

// Reject follow request
export const rejectFollowRequest = async (req, res) => {
  try {
    const recipientId = req.auth._id;
    const senderId = req.params.id;

    // 🔐 Check if sender exists to prevent 500 error
    const senderExists = await userModel.findById(senderId);
    if (!senderExists) {
      return res.status(404).json({ error: "User no longer exists" });
    }

    const updatedUser = await userModel
      .findByIdAndUpdate(
        recipientId,
        {
          $pull: {
            pendingRequests: senderId,
            notifications: { type: "follow-request", from: senderId },
          },
        },
        { new: true }
      )
      .select("-password")
      .populate("notifications.from", "name username image");

    res.json(updatedUser);
  } catch (err) {
    console.error("rejectFollowRequest:", err);
    res.status(500).send("Error rejecting follow request");
  }
};


// Fetch notifications
export const getNotifications = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user._id)
      .populate("notifications.from", "name username image");

    res.json(user.notifications);
  } catch (err) {
    console.error("getNotifications:", err);
    res.status(500).json({ error: "Could not fetch notifications" });
  }
};



