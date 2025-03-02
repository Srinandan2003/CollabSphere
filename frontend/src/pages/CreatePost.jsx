import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    
    if (!content.trim()) {
      setError("Content is required");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (file) formData.append("media", file);

      const token = localStorage.getItem("authToken");
      
      if (!token) {
        throw new Error("You must be logged in to create a post");
      }

      const response = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create post");
      }

      navigate("/");
    } catch (err) {
      setError(err.message || "An error occurred while creating your post");
      console.error("Create post error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100">
      <div className="container mx-auto py-12 px-4 max-w-2xl">
        <div className="mb-8">
          <Link to="/" className="flex items-center text-sm text-blue-300 hover:text-blue-200 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to posts
          </Link>
        </div>
        
        <Card className="bg-slate-800 border-slate-700 shadow-lg overflow-hidden">
          <CardHeader className="border-b border-slate-700 pb-4">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              Create New Post
            </CardTitle>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 pt-6">
              {error && (
                <Alert className="bg-slate-900 border-red-500 text-red-400">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="title" className="font-medium text-blue-300">
                  Title <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter a descriptive title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-slate-100 focus:border-blue-400 focus:ring-blue-400"
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content" className="font-medium text-blue-300">
                  Content <span className="text-red-400">*</span>
                </Label>
                <Textarea
                  id="content"
                  placeholder="Write your post content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-32 bg-slate-900 border-slate-700 text-slate-100 focus:border-blue-400 focus:ring-blue-400"
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="media" className="font-medium text-blue-300">
                  Media (Optional)
                </Label>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("media").click()}
                    className="flex items-center gap-2 border-slate-600 bg-slate-700 hover:bg-slate-600 text-slate-200"
                    disabled={loading}
                  >
                    <Upload className="h-4 w-4" />
                    Choose File
                  </Button>
                  
                  {fileName && (
                    <span className="text-sm text-blue-300 truncate max-w-xs">
                      {fileName}
                    </span>
                  )}
                  
                  <Input
                    id="media"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                    disabled={loading}
                  />
                </div>
                <p className="text-xs text-slate-400">
                  Supported formats: JPG, PNG, GIF (max 5MB)
                </p>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between border-t border-slate-700 p-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/")}
                disabled={loading}
                className="border-slate-600 hover:bg-slate-700 text-slate-300"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading} 
                className="min-w-32 bg-blue-500 hover:bg-blue-600 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  "Publish Post"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}