import { useState, useEffect } from "react";
import { createTask } from "../../services/tasks.service";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../../services/users.service";
import toast from "react-hot-toast";
import Sidebar from "../../components/layout/Sidebar";

export default function CreateTask() {
    const nav = useNavigate();
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<any[]>([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    const [form, setForm] = useState({
        title: "",
        description: "",
        priority: "MEDIUM",
        status: "OPEN",
        dueDate: "",
        assignedTo: "",
    });

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

    const submit = async (e: any) => {
        e.preventDefault();
        try {
            setLoading(true);
            const payload = {
                ...form,
                dueDate: form.dueDate || undefined,
                assignedTo: form.assignedTo || undefined,
            };

            await createTask(payload);
            toast.success("Task created successfully");
            nav("/tasks");
        } catch {
            toast.error("Task creation failed");
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectUser = (user: any) => {
        setForm({ ...form, assignedTo: user._id });
        setSearchTerm(user.name);
        setShowDropdown(false);
    };

    const inputClasses = "w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition text-sm text-gray-800 bg-white shadow-sm";
    const labelClasses = "block text-sm font-semibold text-gray-700 mb-1.5";

    return (
        // Adjusted height classes to prevent overflow when a top navbar is present
        <div className="flex flex-1 h-full min-h-0 bg-gray-50 overflow-hidden font-sans w-full">
            
            <Sidebar />

            <main className="flex-1 overflow-y-auto p-6 md:p-8">
                {/* Centered card container (max-w-4xl mx-auto) to fix empty right-side space */}
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col p-8 md:p-10 mb-8">
                    
                    {/* Header Section */}
                    <div className="mb-8 border-b border-gray-100 pb-6">
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                            <span>Tasks / Create</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create a New Task</h1>
                        <p className="text-gray-500 text-sm">Fill in the details below to add a new assignment to the system.</p>
                    </div>

                    {/* Removed width restrictions on form so it fills the centered container naturally */}
                    <form onSubmit={submit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className={labelClasses}>Task Title</label>
                            <input
                                required
                                placeholder="E.g., Update landing page copy"
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                className={inputClasses}
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className={labelClasses}>Description</label>
                            <textarea
                                required
                                rows={4}
                                placeholder="Provide specific details about this task..."
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className={`${inputClasses} resize-none`}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Due Date */}
                            <div>
                                <label className={labelClasses}>Due Date</label>
                                <input
                                    type="date"
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
                                        placeholder="Select team member..."
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setShowDropdown(true);
                                            if (e.target.value === "") {
                                                setForm({ ...form, assignedTo: "" });
                                            }
                                        }}
                                        onFocus={() => setShowDropdown(true)}
                                        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                                        className={inputClasses}
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>

                                {showDropdown && (
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
                                            filteredUsers.map((user) => (
                                                <li
                                                    key={user._id}
                                                    className="px-4 py-2.5 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer text-sm text-gray-700 font-medium flex flex-col transition"
                                                    onClick={() => handleSelectUser(user)}
                                                >
                                                    <span>{user.name}</span>
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

                            {/* Status */}
                            <div className="relative">
                                <label className={labelClasses}>Status</label>
                                <select
                                    value={form.status}
                                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                                    className={`${inputClasses} appearance-none cursor-pointer`}
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
                                    value={form.priority}
                                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                                    className={`${inputClasses} appearance-none cursor-pointer`}
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
                        <div className="pt-6 flex items-center gap-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-lg text-sm font-medium transition shadow-sm disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Creating...
                                    </>
                                ) : "Create Task"}
                            </button>
                            
                            <button
                                type="button"
                                onClick={() => nav("/tasks")}
                                className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 px-6 py-2.5 rounded-lg text-sm font-medium transition shadow-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}