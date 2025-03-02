import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Home() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/posts");
      
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      
      const data = await response.json();
      setPosts(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to load posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/posts/search?title=${encodeURIComponent(search)}`);
      
      if (!response.ok) {
        throw new Error("Search failed");
      }
      
      const data = await response.json();
      setPosts(data);
      setError(null);
    } catch (error) {
      console.error("Error searching posts:", error);
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setSearch("");
    fetchPosts();
  };

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100">
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">Blog Posts</h1>
            <Link to="/create">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white border-none flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Create New Post</span>
                <span className="sm:hidden">New</span>
              </Button>
            </Link>
          </div>

          <Card className="bg-slate-800 border-slate-700 shadow-lg">
            <CardHeader className="pb-3 border-b border-slate-700">
              <CardTitle className="text-lg text-blue-300">Search Posts</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input 
                    type="text" 
                    placeholder="Search by title..." 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 bg-slate-900 border-slate-700 text-slate-100 focus:border-blue-400 focus:ring-blue-400"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={loading || !search.trim()} 
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Search
                </Button>
                {search && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={resetSearch}
                    className="border-slate-600 hover:bg-slate-700 text-slate-300"
                  >
                    Reset
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>

          {error && (
            <div className="bg-slate-800 text-red-400 p-4 rounded-md border border-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          ) : posts.length > 0 ? (
            <div className="grid gap-6">
              {posts.map((post) => (
                <Card 
                  key={post._id} 
                  className="bg-slate-800 border-slate-700 overflow-hidden transition-all hover:shadow-md hover:shadow-blue-500/10 hover:border-blue-500/50"
                >
                  <CardHeader className="pb-2 border-b border-slate-700">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl text-blue-300">{post.title}</CardTitle>
                      {post.category && (
                        <Badge className="bg-slate-700 text-blue-300 hover:bg-slate-600">
                          {post.category}
                        </Badge>
                      )}
                    </div>
                    {post.createdAt && (
                      <p className="text-sm text-slate-400">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="py-4">
                    <p className="text-slate-300">
                      {post.content?.substring(0, 150)}
                      {post.content?.length > 150 ? "..." : ""}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2 border-t border-slate-700">
                    <Link to={`/post/${post._id}`}>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-blue-400 hover:text-blue-300"
                      >
                        Read More
                      </Button>
                    </Link>
                    {post.author && (
                      <span className="text-sm text-slate-400">By <span className="text-purple-300">{post.author}</span></span>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center bg-slate-800 border-slate-700">
              <p className="text-slate-400">No posts found. Try a different search term or create a new post.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}