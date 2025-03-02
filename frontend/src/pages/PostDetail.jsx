import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils" // Assuming you have shadcn/ui utils
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"


export function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPost();
    fetchComments();
    fetchUser();
  }, []);

  const fetchPost = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${id}`);
      const data = await response.json();
      setPost(data);
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${id}/comments`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const fetchUser = () => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  };

  const handleLike = async () => {
    const token = localStorage.getItem("authToken");
    await fetch(`http://localhost:5000/api/posts/${id}/like`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchPost();
  };

  const handleUnlike = async () => {
    const token = localStorage.getItem("authToken");
    await fetch(`http://localhost:5000/api/posts/${id}/unlike`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchPost();
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`http://localhost:5000/api/posts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      navigate("/");
    } else {
      alert("Failed to delete post");
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    const token = localStorage.getItem("authToken");

    const response = await fetch(`http://localhost:5000/api/posts/${id}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: newComment }),
    });

    if (response.ok) {
      setNewComment("");
      fetchComments();
    } else {
      alert("Failed to add comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    const token = localStorage.getItem("authToken");

    const response = await fetch(`http://localhost:5000/api/posts/${id}/comments/${commentId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      fetchComments();
    } else {
      alert("Failed to delete comment");
    }
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center min-h-screen py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <h2 className="text-2xl font-bold">{post.title}</h2>
        </CardHeader>
        <CardContent className="prose"> {/* Use prose class for better typography */}
          {post.image && <img src={post.image} alt="Post" className="w-full rounded-md mb-4" />} {/* Responsive image */}
          <p>{post.content}</p>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleLike}>👍 Like ({post.likes.length})</Button>
            <Button onClick={handleUnlike} variant="outline">👎 Unlike</Button>
            {user && post.user === user._id && (
              <Button onClick={handleDelete} variant="destructive">🗑 Delete Post</Button>
            )}
          </div>
        </CardContent>
      </Card>


      {/* Comment Section */}
      <Card className="w-full max-w-2xl mt-8">
        <CardHeader>
          <h3 className="text-lg font-semibold">Comments</h3>
        </CardHeader>
        <CardContent>
        <div className="mb-4">
            <Label htmlFor="comment">Add a comment</Label>
            <Input
              id="comment"
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mt-2"
            />
            <Button onClick={handleAddComment} className="mt-2">Add Comment</Button>
          </div>
          {comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="border p-4 rounded-md my-2">
                <div className="flex justify-between items-start"> {/* Align items to the top */}
                <div>
                  <p className="font-semibold">{comment?.user?.username || "Unknown User"}</p>
                  <p className="text-gray-700">{comment.text}</p>
                </div>
                  {user && comment.user && user._id === comment.user._id && (
                    <Button onClick={() => handleDeleteComment(comment._id)} variant="ghost" size="icon">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9.041-3.28 9.829M18 8.077l-3.28 9.829-3.282-9.829" />
</svg>

                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
      <Button onClick={() => navigate("/")} className="mt-8">Back to Home</Button>
    </div>
  );
}