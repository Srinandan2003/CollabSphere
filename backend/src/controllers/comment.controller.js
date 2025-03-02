import mongoose from "mongoose";
import Post from "../models/Post.model.js";
import Comment from "../models/Comment.model.js";

/**
 * @desc Add a comment to a post
 * @route POST /api/posts/:id/comments
 */

export const addComment = async (req, res) => {
    try {
        console.log("Received comment request:", req.body, req.params);
        
        const { text } = req.body;
        const { id: postId } = req.params;

        if (!text) {
            console.log("Error: Comment text missing");
            return res.status(400).json({ message: "Comment text is required" });
        }

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            console.log("Error: Invalid post ID", postId);
            return res.status(400).json({ message: "Invalid post ID format" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            console.log("Error: Post not found");
            return res.status(404).json({ message: "Post not found" });
        }

        if (!req.user) {
            console.log("Error: User not authenticated");
            return res.status(401).json({ message: "User not authenticated" });
        }

        console.log("Creating comment...");
        const comment = new Comment({
            text,
            user: req.user.id,
            post: postId
        });

        await comment.save();
        post.comments.push(comment._id);
        await post.save();

        console.log("Comment added successfully:", comment);
        res.status(201).json({ message: "Comment added", comment });
    } catch (error) {
        console.log("Server Error:", error.message);
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
