import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreateTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"pending" | "completed">("pending");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, status }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to create task");
      
      toast.success("Task created successfully!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Create Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded mt-1" 
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded mt-1" 
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "pending" | "completed")}
            className="w-full border p-2 rounded mt-1"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full cursor-pointer bg-blue-600 text-white p-2 rounded-md disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Create Task"}
        </button>
      </form>
    </div>
  );
};

export default CreateTask;
