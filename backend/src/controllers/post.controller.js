import Post from "../models/Post.model.js";
import Comment from '../models/Comment.model.js'
import cloudinary from "../config/cloudinary.js";

/**
 * @desc Create a new post
 * @route POST /api/posts
 */
// export const createPost = async (req, res) => {
//     try {
//         let mediaUrl = null;
//         if (req.file) {
//             const result = await cloudinary.uploader.upload(req.file.path, { resource_type: "auto" });
//             mediaUrl = result.secure_url;
//         }

//         const post = new Post({ ...req.body, user: req.user.id, image: mediaUrl });
//         await post.save();

//         res.status(201).json(post);
//     } catch (error) {
//         res.status(500).json({ message: "Server Error", error: error.message });
//     }
// };


export const createPost = async (req, res) => {
    try {
        let mediaUrl = null;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, { resource_type: "auto" });
            mediaUrl = result.secure_url;
        }

        const post = new Post({
            ...req.body,
            category: req.body.category.trim(), // Ensure it's a string
            user: req.user.id,
            image: mediaUrl,
        });

        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};



/**
 * @desc Get all posts
 * @route GET /api/posts
 */
export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate("user", "username").populate("category", "name");
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

/**
 * @desc Get post by ID
 * @route GET /api/posts/:id
 */
export const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId).populate("user", "username").populate("category", "name");
        if (!post) return res.status(404).json({ message: "Post not found" });

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

/**
 * @desc Update post
 * @route PUT /api/posts/:postId
 */
export const editPost = async (req, res) => {
    try {
        let updateData = { ...req.body };

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, { resource_type: "auto" });
            updateData.image = result.secure_url;
        }

        const post = await Post.findByIdAndUpdate(req.params.postId, updateData, { new: true });
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

/**
 * @desc Delete post
 * @route DELETE /api/posts/:postId
 */
export const deletePost = async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.postId);
        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

/**
 * @desc Like a post
 * @route POST /api/posts/:postId/like
 */
export const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post.likes.includes(req.user.id)) {
            post.likes.push(req.user.id);
        } else {
            post.likes = post.likes.filter(id => id.toString() !== req.user.id);
        }
        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
// unlike (means remove like)

export const unlikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        // Remove the user's like
        post.likes = post.likes.filter(id => id.toString() !== req.user.id);

        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// /**
//  * @desc Search posts by title or category
//  * @route GET /api/posts/search
//  */
// export const searchPosts = async (req, res) => {
//     try {
//         const { title, category } = req.query;

//         let query = {};

//         if (title) query.title = new RegExp(title, "i");
//         if (category) query.category = new RegExp(category, "i");

//         const posts = await Post.find(query).populate("user", "username").populate("category", "name");
//         res.json(posts);
//     } catch (error) {
//         res.status(500).json({ message: "Server Error", error: error.message });
//     }
// };

/**
 * @desc Search posts by title or category
 * @route GET /api/posts/search
 */
export const searchPosts = async (req, res) => {
    try {
        const { title, category } = req.query;

        let query = {};

        if (title) query.title = new RegExp(title, "i"); // Case-insensitive title search
        if (category) query.category = new RegExp(category, "i"); // Case-insensitive category search

        const posts = await Post.find(query).populate("user", "username"); // Removed .populate("category", "name")

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

