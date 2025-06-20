import express from "express";
import { canEditDeletePost, requireSignIn } from "../middlewares/index.js";
import { createPostController, imageUploadController, userPostController, userPostEditController, updatePostController } from "../controller/postCtrl.js";
import {deletePostController} from "../controller/postCtrl.js"
import expressFormidable from "express-formidable";
import { likeUnlikePost, addCommentController, removeCommentController, editCommentController } from "../controller/postCtrl.js";

// router object
const router = express.Router();

// routes
router.post("/createpost", requireSignIn, createPostController);

// image upload route
router.post("/upload-image", requireSignIn, expressFormidable({maxFieldsSize: 5 * 1024 * 1024}), imageUploadController)

// userPost
router.get("/user-post", requireSignIn, userPostController)

// userPost Edit
router.get('/user-post/:_id', requireSignIn, userPostEditController);

// update routes
router.put('/update-post/:_id', requireSignIn, canEditDeletePost, updatePostController);

// delete Post
router.delete('/delete-post/:_id', requireSignIn, canEditDeletePost, deletePostController);

router.put("/like", requireSignIn, likeUnlikePost);

router.put("/comment", requireSignIn, addCommentController);

router.put("/uncomment", requireSignIn, removeCommentController);

router.put("/edit-comment", requireSignIn, editCommentController);



export default router;