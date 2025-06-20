import { expressjwt } from "express-jwt";
import postModel from "../models/postModel.js";
import userModel from "../models/userModel.js";

export const requireSignIn = expressjwt({
    secret : process.env.JWT_SECRET,
    algorithms: ["HS256"],
    requestProperty: "auth",
});

// edit update Delete
export const canEditDeletePost = async (req, res, next) => {
    try {
        const post = await postModel.findById(req.params._id)
        if(req.auth._id != post.postedBy.toString()) {
            return res.status(400).send("Unauthorized Access")
        } else {
            next();
        }
        
    } catch (error) {
        console.log(error);      
    }
}

export const attachUser = async (req, res, next) => {
  try {
    if (!req.auth || !req.auth._id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await userModel.findById(req.auth._id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
};