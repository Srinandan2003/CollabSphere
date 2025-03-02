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
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="mb-6">
        <Link to="/" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to posts
        </Link>
      </div>
      
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create New Post</CardTitle>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="title" className="font-medium">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter a descriptive title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full"
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content" className="font-medium">
                Content <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="content"
                placeholder="Write your post content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-32 w-full"
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="media" className="font-medium">
                Media (Optional)
              </Label>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("media").click()}
                  className="flex items-center gap-2"
                  disabled={loading}
                >
                  <Upload className="h-4 w-4" />
                  Choose File
                </Button>
                
                {fileName && (
                  <span className="text-sm text-gray-600 truncate max-w-xs">
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
              <p className="text-xs text-gray-500">
                Supported formats: JPG, PNG, GIF (max 5MB)
              </p>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t p-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/")}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading} 
              className="min-w-32"
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
  );
}