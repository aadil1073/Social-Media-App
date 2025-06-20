import express from "express";
import { registerController, findPeopleController, loginController, currentUserController, forgotPasswordController, profileUpdateController } from "../controller/authCtrl.js";
import { requireSignIn } from "../middlewares/index.js";

// router object
const router = express.Router();

// register
router.post("/register", registerController);

// login
router.post("/login", loginController);

// Current User
router.get("/currentuser", requireSignIn, currentUserController);

// forgot password
router.post("/forgot-password", forgotPasswordController);

//profile Update
router.put("/profile-update", requireSignIn, profileUpdateController);

// people suggestion
router.get("/find-people", requireSignIn, findPeopleController)

export default router;