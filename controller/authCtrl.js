import userModel from "../models/userModel.js";
import nanoId from "nano-id";
import jwt from "jsonwebtoken";
import { hashPassword, comparePassword } from "../utils/helper.js";


export const registerController = async (req, res) => {
    const { name, email, password, answer } = req.body;

    // validation
    if (!name) {
        return res.status(400).send('Name is Required')
    }
    if (!password) {
        return res.status(400).send('Password is Required')
    }
    if (!answer) {
        return res.status(400).send('Answer is Required')
    }

    const exist = await userModel.findOne({ email })
    if (exist) {
        return res.status(400).send('Email Already Taken')
    }

    // hash password
    const hashedPassword = await hashPassword(password)
    const user = new userModel({ name, email, password: hashedPassword, answer, username: nanoId(6) })

    try {
        await user.save();
        return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.log("Error while Registering", error);
        return res.status(400).send("Try Again!")
    }

};


export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        // check user in db
        const user = await userModel.findOne({ email })
        if (!user) return res.status(400).send("Invalid User");

        // check password
        const match = await comparePassword(password, user.password)
        if (!match) return res.status(400).send("Invalid Password");

        //jwt token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        })
        user.password = undefined
        user.answer = undefined
        res.status(200).json({
            token,
            user
        })

    } catch (error) {
        console.log(error)
        return res.status(400).send("Error, Try Again!")
    }
};

// Protected routes
export const currentUserController = async (req, res) => {
    try {
        const user = await userModel.findById(req.auth._id);
        return res.status(200).json({ ok: true });
    } catch (error) {
        console.error(error);
        return res.status(400).send("Error fetching current user");
    }
};

// forgot Password
export const forgotPasswordController = async (req, res) => {
    const { email, answer, newpassword } = req.body;
    //validation
    if (!email) {
        res.status(400).send("Email is required");
    }
    if (!newpassword) {
        res.status(400).send("New Password is required");
    }
    if (!answer) {
        res.status(400).send("Answer is Required");
    }

    const user = await userModel.findOne({ email, answer });
    if (!user) {
        res.status(400).send("Invalid Email or Answer, Please Try Again!");
    }

    try {
        const hashed = await hashPassword(newpassword);
        await userModel.findByIdAndUpdate(user._id, { password: hashed })
        return res.status(201).send("Password Reset Successfully");

    } catch (error) {
        console.log(error);
        return res.status(400).send("Something went wrong");
    }
};

// Update Profile
export const profileUpdateController = async (req, res) => {
    // console.log(req.body);
    try {
        const data = {};
        if (req.body.username) {
            data.username = req.body.username
        }
        if (req.body.image) {
            data.image = req.body.image
        }
        if (req.body.about) {
            data.about = req.body.about
        }
        if (req.body.password) {
            if (req.body.password.length < 6) {
                return res.status(502).json({
                    error: "Password length should be longer than 6 character"
                })
            }
            else {
                data.password = await hashPassword(req.body.password);
            }
        }
        if (req.body.answer) {
            data.answer = req.body.answer
        }

        let user = await userModel.findByIdAndUpdate(req.auth._id, data, {
            new: true
        })
        user.password = undefined;
        user.answer = undefined;
        res.status(200).send(user);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({
                error: "Duplicate UserName Error"
            })
        }
        console.log(err);
    }
};

export const findPeopleController = async (req, res) => {
    try {
        const user = await userModel.findById(req.auth._id).select("following");
        
        // Clone following and include the current user’s ID
        let following = user.following.map(id => id.toString());
        following.push(req.auth._id.toString());

        // Find users not followed and not self
        const people = await userModel
            .find({ _id: { $nin: following } })
            .limit(10)
            .select("-password -answer");

        res.json(people);
    } catch (error) {
        console.error("Find People Error:", error);
        res.status(500).json({ error: "Server error while finding people" });
    }
};
