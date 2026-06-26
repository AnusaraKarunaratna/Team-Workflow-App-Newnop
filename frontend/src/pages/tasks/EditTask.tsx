import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTaskById, updateTask } from "../../services/tasks.service";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";

export default function EditTask() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [form, setForm] = useState<any>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getTaskById(id!);
                const task = res.data;
                const formattedDate = task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "";
                const assignedId = task.assignedTo?._id || task.assignedTo || "";
                
                setForm({ ...task, dueDate: formattedDate, assignedTo: assignedId });
            } catch {
                toast.error("Failed to load task");
                navigate("/tasks");
            }
        };
        load();
    }, [id, navigate]);

    if (!form) return <div className="flex justify-center mt-20"><p className="text-gray-500 animate-pulse text-lg">Loading task...</p></div>;

    // Check permissions
    const creatorId = form.createdBy?._id || form.createdBy;
    const currentUserId = user?._id || user?.id;
    const isCreatorOrAdmin = creatorId === currentUserId || user?.role === "ADMIN";
    // If not creator/admin, they must be the assignee to be here, so they can only edit status
    const canEditFull = isCreatorOrAdmin;

    const submit = async (e: any) => {
        e.preventDefault();
        try {
            await updateTask(id!, {
                title: form.title,
                description: form.description,
                status: form.status,
                priority: form.priority,
                dueDate: form.dueDate || undefined,
                assignedTo: form.assignedTo || undefined,
            });
            toast.success("Task updated");
            navigate("/tasks");
        } catch {
            toast.error("Failed to update task");
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-12 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Edit Task</h2>
            {!canEditFull && (
                <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded mb-6 border border-amber-200">
                    As an assignee, you can only update the task's status.
                </p>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                        disabled={!canEditFull}
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100 disabled:text-gray-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        disabled={!canEditFull}
                        rows={3}
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none resize-none disabled:bg-gray-100 disabled:text-gray-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                        <input
                            disabled={!canEditFull}
                            type="date"
                            value={form.dueDate}
                            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none bg-white transition disabled:bg-gray-100 disabled:text-gray-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assign To (User ID)</label>
                        <input
                            disabled={!canEditFull}
                            type="text"
                            value={form.assignedTo}
                            onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none bg-white transition disabled:bg-gray-100 disabled:text-gray-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-indigo-600">Status</label>
                        <select
                            value={form.status}
                            onChange={(e) => setForm({ ...form, status: e.target.value })}
                            className="w-full px-4 py-2 border border-indigo-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none bg-indigo-50"
                        >
                            <option value="OPEN">Open</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="TESTING">Testing</option>
                            <option value="DONE">Done</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <select
                            disabled={!canEditFull}
                            value={form.priority}
                            onChange={(e) => setForm({ ...form, priority: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none bg-white disabled:bg-gray-100 disabled:text-gray-500"
                        >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </select>
                    </div>
                </div>

                <div className="pt-4 flex gap-3">
                    <button type="button" onClick={() => navigate("/tasks")} className="flex-1 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-md hover:bg-gray-50 transition font-medium">
                        Cancel
                    </button>
                    <button type="submit" className="flex-1 bg-indigo-600 text-white py-2.5 rounded-md hover:bg-indigo-700 transition font-medium">
                        Update Task
                    </button>
                </div>
            </form>
        </div>
    );
}