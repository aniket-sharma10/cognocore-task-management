import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Pencil,
  Trash2,
  Save,
  X,
  ClipboardList,
  ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: "pending" | "completed";
}

const TaskDashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});
  const [isMobile, setIsMobile] = useState(false);
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  useEffect(() => {
    // Check if screen is mobile size
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/tasks");
        const data = await res.json();
        if (res.ok) {
          if (data.length > 0) setTasks(data);
          else toast.warning("No existing tasks");
        } else {
          toast.error("Failed to fetch tasks.");
        }
      } catch (error) {
        toast.error("Error fetching tasks.");
      }
    };
    fetchTasks();
  }, []);

  // delete task
  const handleDelete = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      if (res.ok) {
        setTasks(tasks.filter((task) => task._id !== taskId));
        toast.success("Task deleted successfully.");
      } else {
        toast.error("Failed to delete task.");
      }
    } catch (error) {
      toast.error("Error deleting task.");
    }
  };
  
  // handle edit button click
  const handleEditClick = (task: Task) => {
    setEditingTaskId(task._id);
    setEditedTask({ ...task });
  };

  // handling input change
  const handleInputChange = (field: keyof Task, value: string) => {
    setEditedTask((prev) => ({ ...prev, [field]: value }));
  };

  // handle edit save
  const handleSave = async () => {
    if (!editedTask.title || !editedTask.description) {
      toast.error("All fields are required.");
      return;
    }

    try {
      const res = await fetch(`/api/tasks/${editingTaskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editedTask.title,
          description: editedTask.description,
        }),
      });

      if (res.ok) {
        setTasks(
          tasks.map((task) =>
            task._id === editingTaskId ? { ...task, ...editedTask } : task
          )
        );
        setEditingTaskId(null);
        toast.success("Task updated successfully.");
      } else {
        toast.error("Failed to update task.");
      }
    } catch (error) {
      toast.error("Error updating task.");
    }
  };

  // handle status update
  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setTasks(
          tasks.map((task) =>
            task._id === taskId
              ? { ...task, status: newStatus as Task["status"] }
              : task
          )
        );
        toast.success("Task status updated.");
        setOpenPopoverId(null);
      } else {
        toast.error("Failed to update status.");
      }
    } catch (error) {
      toast.error("Error updating status.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-red-100";
      case "completed":
        return "bg-green-100";
      default:
        return "bg-gray-50";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-red-500 hover:bg-red-600";
      case "completed":
        return "bg-green-500 hover:bg-green-600";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "completed":
        return "Completed";
      default:
        return "Unknown";
    }
  };

  // Mobile card view for each task
  const renderMobileTaskCard = (task: Task) => {
    if (editingTaskId === task._id) {
      return (
        <Card key={task._id} className="mb-4">
          <CardContent className="pt-4 space-y-3">
            <Input
              value={editedTask.title || ""}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Title"
            />
            <Textarea
              value={editedTask.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Description"
              className="min-h-24"
            />
            <div className="flex justify-end space-x-2 pt-2">
              <Button size="sm" onClick={handleSave} className="cursor-pointer">
                <Save className="w-4 h-4 mr-1" /> Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditingTaskId(null)}
                className="cursor-pointer"
              >
                <X className="w-4 h-4 mr-1" /> Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card
        key={task._id}
        className={`mb-4 ${getStatusColor(task.status)} border-l-4 border-l-${
          task.status === "pending" ? "red" : "green"
        }-500`}
      >
        <CardContent className="pt-4">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-lg">{task.title}</h3>
            <div className="flex space-x-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEditClick(task)}
                className="h-8 w-8 p-0 cursor-pointer"
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(task._id)}
                className="h-8 w-8 p-0 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <p className="text-sm py-2 mb-2">{task.description}</p>

          <div className="flex justify-between items-center mt-3">
            <div className="flex justify-between items-center">
              <Popover
                open={openPopoverId === task._id}
                onOpenChange={(open) => setOpenPopoverId(open ? task._id : null)}
              >
                <PopoverTrigger asChild>
                  <Badge
                    className={`${getStatusBadgeColor(
                      task.status
                    )} cursor-pointer px-3 py-1 flex items-center gap-1`}
                  >
                    {getStatusLabel(task.status)}
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </Badge>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-0">
                  <div className="flex flex-col">
                    <Button
                      variant="ghost"
                      className={`text-left justify-start rounded-none h-9 ${
                        task.status === "pending" ? "bg-red-100" : ""
                      }`}
                      onClick={() => handleStatusChange(task._id, "pending")}
                    >
                      Pending
                    </Button>
                    <Button
                      variant="ghost"
                      className={`text-left justify-start rounded-none h-9 ${
                        task.status === "completed" ? "bg-green-100" : ""
                      }`}
                      onClick={() => handleStatusChange(task._id, "completed")}
                    >
                      Completed
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Desktop table view
  const renderDesktopTaskTable = () => {
    return (
      <div className="space-y-2">
        {/* Fixed table header */}
        <div className="grid grid-cols-12 gap-4 p-3 rounded-lg bg-gray-200 font-semibold text-gray-700">
          <div className="col-span-3">Title</div>
          <div className="col-span-5">Description</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {tasks.map((task) => (
          <div
            key={task._id}
            className={`grid grid-cols-12 gap-4 p-3 rounded-lg ${getStatusColor(
              task.status
            )} items-center`}
          >
            {editingTaskId === task._id ? (
              <div className="col-span-12 space-y-2 bg-white p-3 rounded shadow">
                <Input
                  value={editedTask.title || ""}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Title"
                />
                <Textarea
                  value={editedTask.description || ""}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Description"
                />

                <div className="flex justify-end space-x-2">
                  <Button
                    size="sm"
                    onClick={handleSave}
                    className="cursor-pointer"
                  >
                    <Save className="w-4 h-4 mr-1" /> Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingTaskId(null)}
                    className="cursor-pointer"
                  >
                    <X className="w-4 h-4 mr-1" /> Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="col-span-3 font-medium truncate">
                  {task.title}
                </div>
                <div className="col-span-5 text-sm truncate">
                  {task.description}
                </div>

                <div className="col-span-2">
                  <Popover
                    open={openPopoverId === task._id}
                    onOpenChange={(open) =>
                      setOpenPopoverId(open ? task._id : null)
                    }
                  >
                    <PopoverTrigger asChild>
                      <Badge
                        className={`${getStatusBadgeColor(
                          task.status
                        )} cursor-pointer px-3 py-2 w-full flex justify-between items-center`}
                      >
                        <span>{getStatusLabel(task.status)}</span>
                        <ChevronDown className="w-3 h-3" />
                      </Badge>
                    </PopoverTrigger>
                    <PopoverContent className="w-40 p-0">
                      <div className="flex flex-col">
                        <Button
                          variant="ghost"
                          className={`text-left justify-start rounded-none h-9 ${
                            task.status === "pending" ? "bg-red-100" : ""
                          }`}
                          onClick={() => handleStatusChange(task._id, "pending")}
                        >
                          Pending
                        </Button>
                        <Button
                          variant="ghost"
                          className={`text-left justify-start rounded-none h-9 ${
                            task.status === "completed" ? "bg-green-100" : ""
                          }`}
                          onClick={() =>
                            handleStatusChange(task._id, "completed")
                          }
                        >
                          Completed
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="col-span-2 flex space-x-1 justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditClick(task)}
                    className="cursor-pointer"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(task._id)}
                    className="cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-0 fixed left-0 md:px-6 mt-8 pb-16">
      <div className="bg-white rounded-lg pt-6 md:p-6">
        <div className="flex items-center justify-between mb-6 px-4 md:px-0">
          <h1 className="text-xl md:text-2xl font-bold">Task Dashboard</h1>
          {!isMobile && tasks.length > 0 && (
            <div className="text-sm text-gray-500">
              <ClipboardList className="inline mr-1 h-4 w-4" />
              {tasks.length} task{tasks.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardList className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <p className="text-gray-500">No tasks available.</p>
          </div>
        ) : (
          <div className={isMobile ? "space-y-1 px-4" : ""}>
            {isMobile
              ? tasks.map((task) => renderMobileTaskCard(task))
              : renderDesktopTaskTable()}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDashboard;
