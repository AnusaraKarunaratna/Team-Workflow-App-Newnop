import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTasks, deleteTask } from "../../services/tasks.service";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";

// Helper to calculate exact time left for due soon tasks
const getDueDateStatus = (dateString?: string) => {
    if (!dateString) return null;
    
    const dueDate = new Date(dateString);
    const now = new Date();
    const diffMs = dueDate.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 0) {
        return { status: "OVERDUE", text: "Overdue", style: "bg-red-50 text-red-700 border-red-200" };
    } else if (diffHours > 0 && diffHours <= 24) {
        const hrs = Math.floor(diffHours);
        const mins = Math.floor((diffHours - hrs) * 60);
        return { 
            status: "DUE_SOON", 
            text: `Due in ${hrs}h ${mins}m`, 
            style: "bg-orange-50 text-orange-700 border-orange-200 animate-pulse" 
        };
    }
    
    return { 
        status: "NORMAL", 
        text: dueDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }), 
        style: "text-gray-600" 
    };
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

    if (loading) return <div className="flex justify-center items-center h-64"><p className="text-gray-500 text-lg animate-pulse">Loading tasks...</p></div>;
    
    if (error) return <div className="p-4 bg-red-50 text-red-600 rounded-md m-6">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Tasks</h2>
                <button
                    onClick={() => navigate("/tasks/create")}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition font-medium shadow-sm flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Create Task
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex-1 relative">
                    <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input
                        placeholder="Search tasks..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                </div>

                <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-medium text-gray-700">
                    <option value="">All Statuses</option>
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="TESTING">Testing</option>
                    <option value="DONE">Done</option>
                </select>

                <select value={priority} onChange={(e) => setPriority(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-medium text-gray-700">
                    <option value="">All Priorities</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                </select>

                <button onClick={applyFilters} className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-md transition font-medium">
                    Apply Filters
                </button>
            </div>

            {/* Task Grid */}
            {tasks.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300 shadow-sm">
                    <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                    <p className="text-gray-500 font-medium">No tasks found matching your criteria.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {tasks.map((t) => {
                        const currentUserId = user?._id || user?.id;
                        const creatorId = t.createdBy?._id || t.createdBy;
                        const assigneeId = t.assignedTo?._id || t.assignedTo;
                        
                        const isCreator = creatorId === currentUserId;
                        const isAssignee = assigneeId === currentUserId;
                        const isCreatorOrAdmin = isCreator || user?.role === "ADMIN";

                        const dueInfo = getDueDateStatus(t.dueDate);

                        return (
                            <div key={t._id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col relative overflow-hidden group">
                                
                                {/* Top Badges Row */}
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider bg-gray-100 text-gray-800 uppercase border border-gray-200">
                                            {t.status}
                                        </span>
                                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase border 
                                            ${t.priority === 'HIGH' ? 'bg-red-50 text-red-700 border-red-200' : 
                                              t.priority === 'MEDIUM' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                                              'bg-green-50 text-green-700 border-green-200'}`}>
                                            {t.priority}
                                        </span>
                                    </div>

                                    {/* Relationship Tags */}
                                    <div className="flex flex-col gap-1 items-end">
                                        {isAssignee && (
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">
                                                Assigned to me
                                            </span>
                                        )}
                                        {isCreator && (
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                                                Author
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{t.title}</h3>
                                <p className="text-gray-500 text-sm mb-5 line-clamp-2 flex-1">{t.description}</p>
                                
                                {/* Task Meta Info */}
                                <div className="flex flex-col gap-3 mb-5 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    {/* Due Date with Visual Urgency */}
                                    <div className="flex items-center gap-2 text-sm">
                                        <svg className={`w-4 h-4 ${dueInfo?.status === 'DUE_SOON' || dueInfo?.status === 'OVERDUE' ? 'text-current' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        <span className={`font-medium ${dueInfo?.status === 'DUE_SOON' || dueInfo?.status === 'OVERDUE' ? 'px-2 py-0.5 rounded-md border text-xs uppercase tracking-wide' : ''} ${dueInfo?.style}`}>
                                            {dueInfo ? dueInfo.text : "No Date Set"}
                                        </span>
                                    </div>

                                    {/* Assignee */}
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        <span className="truncate font-medium">
                                            {t.assignedTo?.name || t.assignedTo || "Unassigned"}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100">
                                    <button onClick={() => navigate(`/tasks/${t._id}`)} className="flex-1 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 py-2 rounded-lg text-sm font-semibold transition shadow-sm">
                                        View
                                    </button>
                                    <button onClick={() => navigate(`/tasks/edit/${t._id}`)} className="flex-1 bg-indigo-50 border border-indigo-100 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-200 py-2 rounded-lg text-sm font-semibold transition shadow-sm">
                                        Edit
                                    </button>
                                    
                                    {isCreatorOrAdmin && (
                                        <button 
                                            onClick={() => remove(t._id)} 
                                            disabled={deletingId === t._id}
                                            className="flex-none bg-white border border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 px-3 py-2 rounded-lg text-sm font-semibold transition shadow-sm disabled:opacity-50 flex items-center justify-center"
                                            title="Delete Task"
                                        >
                                            {deletingId === t._id ? (
                                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            ) : (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {pagination && pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-12">
                    {Array.from({ length: pagination.pages }).map((_, index) => (
                        <button key={index} onClick={() => { setPage(index + 1); loadTasks(index + 1); }} className={`w-10 h-10 rounded-lg font-bold transition shadow-sm ${ page === index + 1 ? "bg-indigo-600 text-white border-transparent" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50" }`}>
                            {index + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}