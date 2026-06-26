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

    const inputClasses = "w-full px-4 py-3 border border-gray-200 rounded-md focus:border-gray-400 focus:ring-1 focus:ring-gray-400 outline-none transition text-gray-800 bg-white shadow-sm";
    const labelClasses = "block text-[16px] font-bold text-black mb-3 tracking-wide";

    return (
        // 1. ADDED: Flex container to align Sidebar and Form side-by-side
        <div className="flex h-full">
            
            {/* 2. Sidebar sits on the left */}
            <Sidebar />

            {/* 3. Main Form content expands to fill the remaining space (flex-1) */}
            <div className="flex-1 min-h-screen bg-white pl-8 pr-6 py-10 border-l-[6px] border-[#101828] overflow-y-auto">
                <h2 className="text-4xl font-bold text-black mb-12 tracking-tight">Create a New Task</h2>

                <form onSubmit={submit} className="max-w-3xl space-y-8">
                    {/* Title */}
                    <div>
                        <label className={labelClasses}>Title</label>
                        <input
                            required
                            placeholder="E.g., Update landing page"
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
                            placeholder="Task details..."
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className={`${inputClasses} resize-none`}
                        />
                    </div>

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
                                placeholder="Select..."
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
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                <svg className="w-4 h-4 text-black font-bold" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </div>

                        {showDropdown && (
                            <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                <li
                                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 border-b border-gray-100"
                                    onClick={() => {
                                        setForm({ ...form, assignedTo: "" });
                                        setSearchTerm("");
                                        setShowDropdown(false);
                                    }}
                                >
                                    Select...
                                </li>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <li
                                            key={user._id}
                                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm text-gray-800 font-medium flex flex-col transition"
                                            onClick={() => handleSelectUser(user)}
                                        >
                                            <span>{user.name}</span>
                                        </li>
                                    ))
                                ) : (
                                    <li className="px-4 py-3 text-sm text-gray-500 italic text-center">
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
                        <div className="absolute inset-y-0 top-10 right-0 flex items-center pr-4 pointer-events-none">
                            <svg className="w-4 h-4 text-black font-bold" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
                            </svg>
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
                        <div className="absolute inset-y-0 top-10 right-0 flex items-center pr-4 pointer-events-none">
                            <svg className="w-4 h-4 text-black font-bold" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-6 flex items-center gap-4 pb-12">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[#63b359] hover:bg-[#549e4a] text-white px-8 py-2.5 rounded-md font-bold transition disabled:opacity-50"
                        >
                            {loading ? "Creating..." : "Create Task"}
                        </button>
                        
                        <button
                            type="button"
                            onClick={() => nav("/tasks")}
                            className="text-gray-500 hover:text-gray-800 font-bold px-4 py-2.5 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}