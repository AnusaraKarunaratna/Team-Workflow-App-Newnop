import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTaskById, updateTask } from "../../services/tasks.service";
import { getUsers } from "../../services/users.service";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import Sidebar from "../../components/layout/Sidebar";

export default function EditTask() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [form, setForm] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    // 1. Fetch Users for the dropdown
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await getUsers();
                setUsers(res.data);
            } catch (error) {
                toast.error("Failed to load users for assignment");
            }
        };
        fetchUsers();
    }, []);

    // 2. Fetch Task details
    useEffect(() => {
        const load = async () => {
            try {
                const res = await getTaskById(id!);
                const task = res.data;
                const formattedDate = task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "";
                
                // Handle assigned user ID vs Object
                const assignedId = task.assignedTo?._id || task.assignedTo || "";
                const assignedName = task.assignedTo?.name || "";
                
                setForm({ ...task, dueDate: formattedDate, assignedTo: assignedId });
                
                // Set initial search term to the user's name if populated by the API
                if (assignedName) {
                    setSearchTerm(assignedName);
                }
            } catch {
                toast.error("Failed to load task");
                navigate("/tasks");
            }
        };
        load();
    }, [id, navigate]);

    // 3. Fallback: If task.assignedTo was just an ID, map it to a name once users load
    useEffect(() => {
        if (form?.assignedTo && users.length > 0 && !searchTerm) {
            const matchedUser = users.find(u => u._id === form.assignedTo);
            if (matchedUser) {
                setSearchTerm(matchedUser.name);
            }
        }
    }, [form?.assignedTo, users, searchTerm]);

    if (!form) {
        return (
            <div className="flex bg-gray-50 overflow-hidden font-sans w-full h-[calc(100vh-72px)]">
                <Sidebar />
                <main className="flex-1 flex justify-center items-center">
                    <p className="text-gray-400 animate-pulse text-sm font-medium">Loading task...</p>
                </main>
            </div>
        );
    }

    // Check permissions
    const creatorId = form.createdBy?._id || form.createdBy;
    const currentUserId = user?._id || user?.id;
    const isCreatorOrAdmin = creatorId === currentUserId || user?.role === "ADMIN";
    const canEditFull = isCreatorOrAdmin;

    // Dropdown Handlers
    const filteredUsers = users.filter((u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectUser = (selectedUser: any) => {
        setForm({ ...form, assignedTo: selectedUser._id });
        setSearchTerm(selectedUser.name);
        setShowDropdown(false);
    };

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

    const inputClasses = "w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition text-sm text-gray-800 bg-white shadow-sm disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed";
    const labelClasses = "block text-sm font-semibold text-gray-700 mb-1.5";

    return (
        <div className="flex bg-gray-50 overflow-hidden font-sans w-full h-[calc(100vh-72px)]">
            
            <Sidebar />

            <main className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col p-8 md:p-10 mb-8">
                    
                    {/* Header Section */}
                    <div className="mb-8 border-b border-gray-100 pb-6">
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                            <button onClick={() => navigate('/tasks')} className="hover:text-indigo-600 transition flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                Back to Tasks
                            </button>
                            <span className="text-gray-300">/</span>
                            <span>Edit</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Task</h1>
                        <p className="text-gray-500 text-sm">Update task details, assignments, and statuses below.</p>
                    </div>

                    {!canEditFull && (
                        <div className="mb-6 bg-orange-50 border border-orange-100 p-4 rounded-xl flex items-start gap-3">
                            <div className="p-1.5 bg-orange-100 rounded-lg text-orange-600 shrink-0">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-orange-900">Limited Permissions</h3>
                                <p className="text-xs text-orange-700 mt-0.5">As an assignee, you only have permission to update the task's progress status.</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className={labelClasses}>Task Title</label>
                            <input
                                disabled={!canEditFull}
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                className={inputClasses}
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className={labelClasses}>Description</label>
                            <textarea
                                disabled={!canEditFull}
                                rows={4}
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className={`${inputClasses} resize-none`}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Due Date */}
                            <div>
                                <label className={labelClasses}>Due Date</label>
                                <input
                                    disabled={!canEditFull}
                                    type="date"
                                    value={form.dueDate}
                                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                                    className={inputClasses}
                                />
                            </div>

                            {/* CUSTOM SEARCHABLE DROPDOWN */}
                            <div className="relative">
                                <label className={labelClasses}>Assign To</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        disabled={!canEditFull}
                                        placeholder="Select team member..."
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setShowDropdown(true);
                                            if (e.target.value === "") {
                                                setForm({ ...form, assignedTo: "" });
                                            }
                                        }}
                                        onFocus={() => {
                                            if (canEditFull) setShowDropdown(true);
                                        }}
                                        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                                        className={inputClasses}
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>

                                {showDropdown && canEditFull && (
                                    <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                        <li
                                            className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-500 border-b border-gray-100"
                                            onClick={() => {
                                                setForm({ ...form, assignedTo: "" });
                                                setSearchTerm("");
                                                setShowDropdown(false);
                                            }}
                                        >
                                            Clear selection...
                                        </li>
                                        {filteredUsers.length > 0 ? (
                                            filteredUsers.map((u) => (
                                                <li
                                                    key={u._id}
                                                    className="px-4 py-2.5 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer text-sm text-gray-700 font-medium flex flex-col transition"
                                                    onClick={() => handleSelectUser(u)}
                                                >
                                                    <span>{u.name}</span>
                                                </li>
                                            ))
                                        ) : (
                                            <li className="px-4 py-3 text-sm text-gray-400 italic text-center">
                                                No users found
                                            </li>
                                        )}
                                    </ul>
                                )}
                            </div>

                            {/* Status (Always enabled) */}
                            <div className="relative">
                                <label className={`${labelClasses} ${!canEditFull ? "text-indigo-600" : ""}`}>
                                    Status {!canEditFull && "(Editable)"}
                                </label>
                                <select
                                    value={form.status}
                                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                                    className={`${inputClasses} appearance-none cursor-pointer ${!canEditFull ? "border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500 bg-indigo-50" : ""}`}
                                >
                                    <option value="OPEN">Open</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="TESTING">Testing</option>
                                    <option value="DONE">Done</option>
                                </select>
                                <div className="absolute inset-y-0 top-6.5 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>

                            {/* Priority */}
                            <div className="relative">
                                <label className={labelClasses}>Priority</label>
                                <select
                                    disabled={!canEditFull}
                                    value={form.priority}
                                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                                    className={`${inputClasses} appearance-none ${canEditFull ? 'cursor-pointer' : ''}`}
                                >
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                </select>
                                <div className="absolute inset-y-0 top-6.5 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-6 flex justify-end gap-3 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => navigate("/tasks")}
                                className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 px-6 py-2.5 rounded-lg text-sm font-medium transition shadow-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-lg text-sm font-medium transition shadow-sm flex items-center gap-2"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}