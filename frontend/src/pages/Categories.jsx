import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    const token = localStorage.getItem("authToken");

    const response = await fetch("http://localhost:5000/api/categories", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newCategory }),
    });

    if (response.ok) {
      setNewCategory("");
      fetchCategories();
    } else {
      alert("Failed to add category");
    }
  };

  const handleDeleteCategory = async (id) => {
    const token = localStorage.getItem("authToken");

    const response = await fetch(`http://localhost:5000/api/categories/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      fetchCategories();
    } else {
      alert("Failed to delete category");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-2xl font-bold">Categories</h2>

      {/* Add Category Form */}
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="New Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <Button onClick={handleAddCategory}>Add</Button>
      </div>

      {/* List of Categories */}
      <div className="w-full max-w-lg mt-4">
        <h3 className="text-lg font-semibold">Available Categories</h3>
        {categories.length === 0 ? (
          <p>No categories found.</p>
        ) : (
          categories.map((category) => (
            <div key={category._id} className="border p-2 rounded my-2 flex justify-between">
              <p>{category.name}</p>
              <Button onClick={() => handleDeleteCategory(category._id)} className="bg-red-500">
                Delete
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
