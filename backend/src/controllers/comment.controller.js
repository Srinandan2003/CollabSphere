import mongoose from "mongoose";
import Post from "../models/Post.model.js";
import Comment from "../models/Comment.model.js";

/**
 * @desc Add a comment to a post
 * @route POST /api/posts/:id/comments
 */

export const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const { postId } = req.params;

        // ✅ Validate `postId` format
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: "Invalid post ID format" });
        }

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        // ✅ Create a new Comment document
        const comment = new Comment({
            text,
            user: req.user.id,
            post: postId
        });

        await comment.save();

        // ✅ Push only the comment ID into `post.comments`
        post.comments.push(comment._id);
        await post.save();

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

/**
 * @desc Delete a comment
 * @route DELETE /api/posts/:postId/comments/:commentId
 */

export const deleteComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;

        //  Validate ObjectId formats
        if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        //  Remove the comment from the Comment collection
        await Comment.findByIdAndDelete(commentId);

        //  Remove the comment ID from `post.comments`
        post.comments = post.comments.filter(id => id.toString() !== commentId);
        await post.save();

        res.json({ message: "Comment deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

/**
 * @desc Get all comments for a post
 * @route GET /api/posts/:id/comments
 */

export const getComments = async (req, res) => {
    try {
        const { postId } = req.params;

        // Validate `postId` format
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: "Invalid post ID format" });
        }

        //  Populate the comments from Comment collection
        const post = await Post.findById(postId).populate({
            path: "comments",
            populate: { path: "user", select: "username" } // Populate user details
        });

        if (!post) return res.status(404).json({ message: "Post not found" });

        res.json(post.comments);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


/**
 * @desc Get total count of comments for a specific post
 * @route GET /api/posts/:postId/comments/count
 */

export const getPostCommentsCount = async (req, res) => {
    try {
        const { postId } = req.params;

        // Validate `postId`
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: "Invalid post ID format" });
        }

        // Get the count of comments for the specific post
        const count = await Comment.countDocuments({ post: postId });

        res.json({ postId, totalComments: count });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
