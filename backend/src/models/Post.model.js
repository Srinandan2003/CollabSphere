import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: {type: String, required : true},
    image: { type: String },
    video: { type: String },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

},
    {
        timestamps: true
    }
);

const Post = mongoose.model("Post", PostSchema);

export default Post;