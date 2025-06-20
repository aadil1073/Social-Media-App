import postModel from "../models/postModel.js";
import cloudinary from "cloudinary"

// configure
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API,
    api_secret: process.env.CLOUDINARY_SECRET
})

export const createPostController = async (req, res) => {
    const { content, image } = req.body;
    // console.log(req.body);

    // validation
    if (!content.length) {
        return res.status(400).send("Content is Required");
    }
    try {
        const post = new postModel({ content, image, postedBy: req.auth._id, });
        await post.save();
        res.status(201).send(post);

    } catch (error) {
        console.log(error);
        return res.status(400).send("Error, Please Try Again!")
    }
};


export const imageUploadController = async (req, res) => {
    // console.log("Image Details", req.files);
    try {
        const result = await cloudinary.uploader.upload(req.files.image.path)
        console.log("Upload Image", result);
        res.json({
            url: result.secure_url,
            public_id: result.public_id
        })
    } catch (error) {
        console.log(error);
    }
};

export const userPostController = async (req, res) => {
    try {
        const posts = await postModel
            // .find({postedBy:req.auth._id})
            .find({})
            .populate("postedBy", "_id name image")
            .populate("comment.postedBy", "_id name image")
            .sort({ createdAt: -1 })
            .limit(10)
        res.status(200).json(posts)
    } catch (error) {
        console.log(error);
    }
};

export const userPostEditController = async (req, res) => {
    try {
        const post = await postModel.findById(req.params._id);
        res.json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


export const updatePostController = async (req, res) => {
    // console.log("updated data", req.body);
    try {
        const post = await postModel.findByIdAndUpdate(req.params._id, req.body, {
            new: true
        })
        res.status(201).json(post);
    } catch (error) {
        console.log(error);  
    }
}

export const deletePostController = async (req, res) => {
    try {
        const post = await postModel.findByIdAndDelete(req.params._id);
        if(post.image && post.image.public_id) {
            const image = await cloudinary.uploader.destroy(post.image.public_id)
        }
        res.status(200).send({
            ok: true
        });
        
    } catch (error) {
        console.log(error);
    }
}


export const likeUnlikePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.auth._id;

    // Toggle logic
    const post = await postModel.findById(postId);
    const hasLiked = post.likes.includes(userId);

    const updatedPost = await postModel.findByIdAndUpdate(
      postId,
      hasLiked
        ? { $pull: { likes: userId } }
        : { $addToSet: { likes: userId } },
      { new: true }
    )
    .populate("postedBy", "_id name image")
    .populate("comment.postedBy", "_id name image");

    res.json(updatedPost);
  } catch (err) {
    console.error("Like error", err);
    res.status(400).send("Like/unlike failed");
  }
};


// Add comment
export const addCommentController = async (req, res) => {
  try {
    const { postId, comment } = req.body;

    const post = await postModel.findById(postId);
    post.comment.push({
      text: comment,
      postedBy: req.auth._id,
    });

    await post.save();

    const updatedPost = await postModel
      .findById(postId)
      .populate("postedBy", "_id name image")
      .populate("comment.postedBy", "_id name image");

    res.json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(400).send("Failed to add comment");
  }
};

export const removeCommentController = async (req, res) => {
  try {
    const { postId, comment } = req.body;

    const post = await postModel.findById(postId);
    post.comment = post.comment.filter(
      (c) => c._id.toString() !== comment._id.toString()
    );
    await post.save();

    const updatedPost = await postModel
      .findById(postId)
      .populate("postedBy", "_id name image")
      .populate("comment.postedBy", "_id name image");

    res.json(updatedPost);
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(400).send("Could not delete comment");
  }
};


export const editCommentController = async (req, res) => {
  try {
    const { postId, commentId, newText } = req.body;

    const post = await postModel.findOneAndUpdate(
      { _id: postId, "comment._id": commentId },
      {
        $set: {
          "comment.$.text": newText,
        },
      },
      { new: true }
    )
    .populate("postedBy", "_id name image")
    .populate("comment.postedBy", "_id name image");

    res.json(post);
  } catch (error) {
    console.error("Edit Comment Error:", error);
    res.status(400).send("Comment edit failed");
  }
};







