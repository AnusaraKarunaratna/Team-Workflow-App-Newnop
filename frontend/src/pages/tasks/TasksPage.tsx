import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTasks, deleteTask } from "../../services/tasks.service";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import Sidebar from "../../components/layout/Sidebar"; // Adjust path as needed based on your structure

// Helper to calculate exact time left for due soon tasks
const getDueDateStatus = (dateString?: string) => {
    if (!dateString) return { text: "-", style: "text-gray-400" };
    
    const dueDate = new Date(dateString);
    const now = new Date();
    const diffMs = dueDate.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    const formattedDate = dueDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

    if (diffHours < 0) {
        return { text: formattedDate, style: "text-red-600 font-medium" };
    } else if (diffHours > 0 && diffHours <= 24) {
        return { text: formattedDate, style: "text-orange-600 font-medium" };
    }
    
    return { text: formattedDate, style: "text-gray-600" };
};

// Priority Badge Helper
const getPriorityStyles = (priority: string) => {
    switch(priority?.toUpperCase()) {
        case 'HIGH': return 'bg-red-100 text-red-700';
        case 'MEDIUM': return 'bg-orange-100 text-orange-700';
        case 'LOW': return 'bg-purple-100 text-purple-700';
        default: return 'bg-gray-100 text-gray-700';
    }
};

export default function TasksPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<any>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const loadTasks = async (currentPage = page) => {
        try {
            setLoading(true);
            const res = await getTasks({
                page: currentPage,
                search,
                status,
                priority,
            });
            setTasks(res.data.data || []);
            setPagination(res.data.pagination);
            setError("");
        } catch {
            setError("Failed to load tasks");
            toast.error("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTasks(1);
    }, []);

    const applyFilters = async () => {
        setPage(1);
        await loadTasks(1);
    };

    const remove = async (id: string) => {
        if (deletingId) return;
        try {
            setDeletingId(id);
            await deleteTask(id);
            setTasks((prev) => prev.filter((t) => t._id !== id));
            toast.success("Task deleted");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Delete failed");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        // FIX: Replaced 'h-screen max-h-screen' with 'h-[calc(100vh-72px)]' to account for top navbar
        <div className="flex h-[calc(100vh-72px)] bg-gray-50 overflow-hidden font-sans w-full">
            
            {/* Sidebar Injection */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 min-h-full flex flex-col p-8">
                    
                    {/* Header Section */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>Task Management</span>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">All Tasks</h1>
                            <p className="text-gray-500 text-sm">Manage, filter, and track all assigned tasks in the system.</p>
                        </div>
                        
                        <button
                            onClick={() => navigate("/tasks/create")}
                            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition font-medium flex items-center gap-2 shadow-sm text-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            New Task
                        </button>
                    </div>

                    {/* Navigation / Filters Area */}
                    <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-200 pb-4 mb-4 gap-4">
                        
                        {/* Tab-like styling for visual consistency */}
                        <div className="flex gap-6 text-sm font-medium">
                            <span className="text-indigo-600 border-b-2 border-indigo-600 pb-4 -mb-4 px-1">Tasks List</span>
                        </div>

                        {/* Search & Select Filters */}
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <svg className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                <input
                                    placeholder="Search tasks..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64"
                                />
                            </div>
                            <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none bg-white text-gray-600">
                                <option value="">All Statuses</option>
                                <option value="OPEN">Open</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="TESTING">Testing</option>
                                <option value="DONE">Done</option>
                            </select>
                            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none bg-white text-gray-600">
                                <option value="">All Priorities</option>
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                            <button onClick={applyFilters} className="text-gray-500 hover:text-indigo-600 p-2 transition" title="Apply Filters">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                            </button>
                        </div>
                    </div>

                    {/* Error / Loading States */}
                    {error && <div className="p-4 bg-red-50 text-red-600 rounded-md mb-6">{error}</div>}
                    {loading && <div className="flex justify-center items-center py-12"><p className="text-gray-400 text-sm animate-pulse">Loading tasks...</p></div>}

                    {/* Task List (Table Header) */}
                    {!loading && !error && tasks.length > 0 && (
                        <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 py-3 px-4 border-b border-gray-100">
                            <div className="col-span-4">Task name</div>
                            <div className="col-span-2">Deadline</div>
                            <div className="col-span-2">Assignee</div>
                            <div className="col-span-2 text-center">Priority</div>
                            <div className="col-span-2 text-right">Actions</div>
                        </div>
                    )}

                    {/* Task List Items */}
                    {!loading && !error && tasks.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-gray-400 text-sm font-medium">No tasks found matching your criteria.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {tasks.map((t) => {
                                const currentUserId = user?._id || user?.id;
                                const creatorId = t.createdBy?._id || t.createdBy;
                                const isCreatorOrAdmin = creatorId === currentUserId || user?.role === "ADMIN";
                                const dueInfo = getDueDateStatus(t.dueDate);

                                return (
                                    <div key={t._id} className="grid grid-cols-12 gap-4 items-center py-4 px-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-sm">
                                        
                                        {/* Task Name (Checkmark Icon Removed) */}
                                        <div className="col-span-4 flex items-center gap-3">
                                            <span className="font-medium text-gray-800 truncate pr-2">{t.title}</span>
                                        </div>

                                        {/* Deadline */}
                                        <div className={`col-span-2 ${dueInfo.style}`}>
                                            {dueInfo.text}
                                        </div>

                                        {/* Assignee */}
                                        <div className="col-span-2 text-gray-600 truncate pr-2">
                                            {t.assignedTo?.name || t.assignedTo || "Unassigned"}
                                        </div>

                                        {/* Priority Badge */}
                                        <div className="col-span-2 flex justify-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getPriorityStyles(t.priority)}`}>
                                                {t.priority}
                                            </span>
                                        </div>

                                        {/* Actions (Always Visible Now) */}
                                        <div className="col-span-2 flex items-center justify-end gap-2 transition-opacity">
                                            <button onClick={() => navigate(`/tasks/${t._id}`)} className="text-xs font-semibold text-gray-500 hover:text-indigo-600 px-2 py-1 bg-white border border-gray-200 rounded shadow-sm">
                                                View
                                            </button>
                                            <button onClick={() => navigate(`/tasks/edit/${t._id}`)} className="text-xs font-semibold text-gray-500 hover:text-indigo-600 px-2 py-1 bg-white border border-gray-200 rounded shadow-sm">
                                                Edit
                                            </button>
                                            
                                            {isCreatorOrAdmin && (
                                                <button 
                                                    onClick={() => remove(t._id)} 
                                                    disabled={deletingId === t._id}
                                                    className="text-xs font-semibold text-red-500 hover:text-red-700 px-2 py-1 bg-white border border-gray-200 hover:border-red-200 rounded shadow-sm disabled:opacity-50"
                                                >
                                                    {deletingId === t._id ? '...' : 'Del'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination && pagination.pages > 1 && (
                        <div className="flex justify-center gap-2 mt-auto pt-8">
                            {Array.from({ length: pagination.pages }).map((_, index) => (
                                <button 
                                    key={index} 
                                    onClick={() => { setPage(index + 1); loadTasks(index + 1); }} 
                                    className={`w-8 h-8 rounded-md text-sm font-medium transition shadow-sm border ${ 
                                        page === index + 1 
                                        ? "bg-indigo-50 text-indigo-700 border-indigo-200" 
                                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50" 
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}