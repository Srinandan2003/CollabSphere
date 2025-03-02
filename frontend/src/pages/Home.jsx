import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
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
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          <Link to="/create">
            <Button className="flex items-center gap-2">
              <span className="hidden sm:inline">Create New Post</span>
              <span className="sm:hidden">New</span>
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Search Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input 
                  type="text" 
                  placeholder="Search by title..." 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button type="submit" disabled={loading || !search.trim()}>
                Search
              </Button>
              {search && (
                <Button type="button" variant="outline" onClick={resetSearch}>
                  Reset
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-md border border-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid gap-4">
            {posts.map((post) => (
              <Card key={post._id} className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                    {post.category && (
                      <Badge variant="outline" className="ml-2">
                        {post.category}
                      </Badge>
                    )}
                  </div>
                  {post.createdAt && (
                    <p className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-gray-600">
                    {post.content?.substring(0, 150)}
                    {post.content?.length > 150 ? "..." : ""}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Link to={`/post/${post._id}`}>
                    <Button variant="link" className="p-0 h-auto">
                      Read More
                    </Button>
                  </Link>
                  {post.author && (
                    <span className="text-sm text-gray-500">By {post.author}</span>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No posts found. Try a different search term or create a new post.</p>
          </Card>
        )}
      </div>
    </div>
  );
}