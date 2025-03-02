import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { HeartIcon, TrashIcon, MessageSquareIcon, ArrowLeftIcon, SendIcon, UserIcon } from "lucide-react";

export function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPost();
    fetchComments();
    fetchUser();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${id}`);
      const data = await response.json();
      setPost(data);
      
      // Check if current user has liked the post
      const currentUserId = JSON.parse(localStorage.getItem("authUser"))?._id;
      if (currentUserId && data.likes.includes(currentUserId)) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
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

  const handleToggleLike = async () => {
    const token = localStorage.getItem("authToken");
    const endpoint = isLiked ? 
      `http://localhost:5000/api/posts/${id}/unlike` : 
      `http://localhost:5000/api/posts/${id}/like`;
    const method = isLiked ? "PUT" : "POST";
    
    try {
      await fetch(endpoint, {
        method: method,
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPost(); // Refresh post data to update likes count
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        navigate("/");
      } else {
        const errorData = await response.json();
        alert(`Failed to delete post: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("An error occurred while trying to delete the post");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    const token = localStorage.getItem("authToken");
    
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newComment }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setNewComment("");
        await fetchComments();
      } else {
        alert(`Failed to add comment: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("An error occurred while trying to add a comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(`http://localhost:5000/api/posts/${id}/comments/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        await fetchComments();
      } else {
        const errorData = await response.json();
        alert(`Failed to delete comment: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("An error occurred while trying to delete the comment");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Dark theme colors from the image
  const colors = {
    darkNavy: "#0f172a", // Dark background
    navy: "#1e293b",     // Slightly lighter navy
    purple: "#4f46e5",   // Purple highlight color
    lightPurple: "#7c69f0" // Lighter purple for gradients
  };

  if (!post) return (
    <div className="flex justify-center items-center h-screen" style={{ backgroundColor: colors.darkNavy }}>
      <div className="animate-spin rounded-full h-12 w-12 border-2 border-purple-600 border-t-transparent"></div>
    </div>
  );

  return (
    <div style={{ backgroundColor: colors.darkNavy }} className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")} 
          className="mb-6 flex items-center gap-2 text-white hover:bg-opacity-20 hover:bg-white"
          style={{ color: "#fff" }}
        >
          <ArrowLeftIcon size={16} />
          Back to Home
        </Button>
        
        <Card className="mb-8 overflow-hidden shadow-2xl border-0" style={{ backgroundColor: colors.navy, borderRadius: "12px" }}>
          <div className="px-6 py-4" style={{ background: `linear-gradient(to right, ${colors.purple}, ${colors.lightPurple})` }}>
            <h2 className="text-2xl font-bold text-white">{post.title}</h2>
            <p className="text-white text-opacity-80 text-sm mt-1">
              {post.user?.username ? `Posted by ${post.user.username}` : "Unknown author"} • 
              {post.createdAt && ` ${formatDate(post.createdAt)}`}
            </p>
          </div>
          
          <CardContent className="p-6" style={{ color: "#fff" }}>
            {post.image && (
              <div className="mb-6 rounded-lg overflow-hidden">
                <img 
                  src={post.image} 
                  alt="Post" 
                  className="w-full object-cover max-h-96" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/api/placeholder/800/400';
                  }}
                />
              </div>
            )}
            <div className="prose max-w-none" style={{ color: "#fff" }}>
              <p className="whitespace-pre-line text-lg leading-relaxed">{post.content}</p>
            </div>
          </CardContent>
          
          <div className="px-6 pb-4 pt-2 flex justify-between items-center" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <Button 
              onClick={handleToggleLike} 
              className="flex items-center gap-2"
              style={{ 
                backgroundColor: isLiked ? colors.lightPurple : "transparent",
                color: "#fff",
                border: isLiked ? "none" : "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <HeartIcon size={18} className={isLiked ? "fill-white" : ""} />
              {isLiked ? "Liked" : "Like"} ({post.likes?.length || 0})
            </Button>
            
            {user && post.user === user._id && (
              <Button 
                onClick={handleDelete} 
                variant="destructive" 
                size="sm" 
                className="flex items-center gap-1"
                style={{ backgroundColor: "rgba(239, 68, 68, 0.9)" }}
              >
                <TrashIcon size={16} />
                Delete Post
              </Button>
            )}
          </div>
        </Card>

        {/* Comment Section */}
        <Card className="shadow-2xl border-0 overflow-hidden" style={{ backgroundColor: colors.navy, borderRadius: "12px" }}>
          <div className="px-6 py-3 flex justify-between items-center" style={{ background: `linear-gradient(to right, ${colors.purple}, ${colors.lightPurple})` }}>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <MessageSquareIcon size={18} />
              Comments ({comments.length})
            </h3>
          </div>
          
          <CardContent className="p-6" style={{ color: "#fff" }}>
            <form onSubmit={handleAddComment} className="mb-6">
              <Label htmlFor="comment" className="text-sm font-medium text-white mb-2 block">
                Join the conversation
              </Label>
              <div className="flex gap-2">
                <Textarea
                  id="comment"
                  placeholder="Share your thoughts..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="resize-none flex-1 text-white"
                  style={{ 
                    backgroundColor: "rgba(255,255,255,0.05)", 
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px"
                  }}
                  rows={3}
                />
                <Button 
                  type="submit" 
                  className="self-end"
                  disabled={isSubmitting || !newComment.trim()}
                  style={{ 
                    backgroundColor: colors.purple,
                    color: "#fff"
                  }}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                      <span>Posting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <SendIcon size={16} />
                      <span>Post</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
            
            <Separator className="my-6" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
            
            {comments.length === 0 ? (
              <div className="text-center py-12 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
                <MessageSquareIcon size={32} className="mx-auto mb-3" style={{ color: colors.lightPurple }} />
                <p className="text-white font-medium">No comments yet.</p>
                <p className="text-white text-opacity-60 mt-1">Be the first to share your thoughts!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div 
                    key={comment._id} 
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: "rgba(255,255,255,0.03)", borderLeft: `3px solid ${colors.lightPurple}` }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full flex items-center justify-center" 
                               style={{ background: `linear-gradient(to bottom right, ${colors.purple}, ${colors.lightPurple})` }}>
                            <UserIcon size={14} className="text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-white">
                              {comment?.user?.username || "Unknown User"}
                            </p>
                            {comment.createdAt && (
                              <span className="text-xs text-white text-opacity-60">
                                {formatDate(comment.createdAt)}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="mt-2 text-white text-opacity-80 whitespace-pre-line pl-10">{comment.text}</p>
                      </div>
                      
                      {user && comment.user && user._id === comment.user._id && (
                        <Button 
                          onClick={() => handleDeleteComment(comment._id)} 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 hover:bg-red-500 hover:bg-opacity-20"
                          style={{ color: "rgba(255,255,255,0.6)" }}
                        >
                          <TrashIcon size={16} />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}