import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    const response = await fetch(`http://localhost:5000/api/posts/${id}`);
    const data = await response.json();
    setPost(data);
    setTitle(data.title);
    setContent(data.content);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (file) formData.append("media", file);

    const token = localStorage.getItem("authToken");

    const response = await fetch(`http://localhost:5000/api/posts/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (response.ok) {
      navigate(`/post/${id}`);
    } else {
      alert("Failed to edit post");
    }
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center gap-4">
      <h2>Edit Post</h2>
      <form onSubmit={handleEdit} className="flex flex-col gap-2">
        <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Input type="text" value={content} onChange={(e) => setContent(e.target.value)} />
        <Input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <Button type="submit">Save Changes</Button>
      </form>
    </div>
  );
}
