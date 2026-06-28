import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTasks, deleteTask } from "../../services/tasks.service";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import Sidebar from "../../components/layout/Sidebar";

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
    } else if (diffHours > 0 && diffHours <= 48) {
        return { text: formattedDate, style: "text-orange-600 font-medium" };
    }
    
    return { text: formattedDate, style: "text-gray-600 font-medium" };
};

// Priority Badge Helper
const getPriorityStyles = (priority: string) => {
    switch(priority?.toUpperCase()) {
        case 'HIGH': return 'bg-red-100 text-red-700 border-red-200';
        case 'MEDIUM': return 'bg-orange-100 text-orange-700 border-orange-200';
        case 'LOW': return 'bg-purple-100 text-purple-700 border-purple-200';
        default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
};

// Status Badge Helper
const getStatusStyles = (status: string) => {
    switch(status?.toUpperCase()) {
        case 'OPEN': return 'bg-gray-100 text-gray-600 border-gray-200';
        case 'IN_PROGRESS': return 'bg-[#38bdf8]/10 text-[#0284c7] border-[#38bdf8]/30';
        case 'TESTING': return 'bg-purple-100 text-purple-700 border-purple-200';
        case 'DONE': return 'bg-[#6a9f4c]/10 text-[#527d3b] border-[#6a9f4c]/30';
        default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
};

type TabType = 'ALL' | 'ASSIGNED' | 'CREATED' | 'COMPLETED';

export default function TasksPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    
    // Data States
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);
    
    // Filter & Pagination States
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<any>(null);
    
    // Tab State
    const [activeTab, setActiveTab] = useState<TabType>('ALL');

    const loadTasks = async (currentPage = page) => {
        try {
            setLoading(true);
            const res = await getTasks({
                page: currentPage,
                search,
                status,
                priority
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

    // Filter tasks based on the active UX tab
    const filteredTasks = tasks.filter(t => {
        const currentUserId = user?._id || user?.id;
        const isAssignee = (t.assignedTo?._id || t.assignedTo) === currentUserId;
        const isCreator = (t.createdBy?._id || t.createdBy) === currentUserId;
        const isDone = t.status === 'DONE';

        if (activeTab === 'ALL') return !isDone; 
        if (activeTab === 'ASSIGNED') return isAssignee && !isDone;
        if (activeTab === 'CREATED') return isCreator && !isDone;
        if (activeTab === 'COMPLETED') return isDone;
        return true;
    });

    return (
        <div className="flex h-[calc(100vh-72px)] bg-gray-50 overflow-hidden font-sans w-full">
            <Sidebar />

            {/* Removed the border-l-[6px] border-[#101828] here */}
            <main className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 min-h-full flex flex-col p-8">
                    
                    {/* Header Section */}
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-[#173062] mb-2 tracking-tight">Task Directory</h1>
                            <p className="text-gray-500 text-sm font-medium">Manage, filter, and track all assigned tasks in the system.</p>
                        </div>
                        
                        <button
                            onClick={() => navigate("/tasks/create")}
                            className="bg-linear-to-r from-[#09275b] to-[#1d0980] hover:opacity-95 text-white px-5 py-2.5 rounded-lg transition font-medium flex items-center gap-2 shadow-sm text-sm shrink-0"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                            New Task
                        </button>
                    </div>

                    {/* Navigation Tabs - Changed font-bold to font-medium */}
                    <div className="flex gap-6 text-sm font-medium overflow-x-auto w-full border-b border-gray-200 mb-5 hide-scrollbar">
                        <button onClick={() => setActiveTab('ALL')} className={`pb-3 px-1 whitespace-nowrap transition-colors ${activeTab === 'ALL' ? 'text-[#173062] border-b-2 border-[#173062]' : 'text-gray-400 hover:text-gray-700'}`}>
                            Active Tasks
                        </button>
                        <button onClick={() => setActiveTab('ASSIGNED')} className={`pb-3 px-1 whitespace-nowrap transition-colors ${activeTab === 'ASSIGNED' ? 'text-[#173062] border-b-2 border-[#173062]' : 'text-gray-400 hover:text-gray-700'}`}>
                            Assigned to Me
                        </button>
                        <button onClick={() => setActiveTab('CREATED')} className={`pb-3 px-1 whitespace-nowrap transition-colors ${activeTab === 'CREATED' ? 'text-[#173062] border-b-2 border-[#173062]' : 'text-gray-400 hover:text-gray-700'}`}>
                            Delegated by Me
                        </button>
                        <button onClick={() => setActiveTab('COMPLETED')} className={`pb-3 px-1 whitespace-nowrap transition-colors ${activeTab === 'COMPLETED' ? 'text-[#6a9f4c] border-b-2 border-[#6a9f4c]' : 'text-gray-400 hover:text-gray-700'}`}>
                            Completed
                        </button>
                    </div>

                    {/* Filters & Search Row */}
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <div className="relative flex-1 min-w-50">
                            <svg className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            <input
                                placeholder="Search tasks..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#173062] outline-none w-full font-medium text-gray-700"
                            />
                        </div>
                        
                        <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none bg-white text-gray-600 font-medium">
                            <option value="">All Statuses</option>
                            <option value="OPEN">Open</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="TESTING">Testing</option>
                            <option value="DONE">Done</option>
                        </select>
                        
                        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none bg-white text-gray-600 font-medium">
                            <option value="">All Priorities</option>
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </select>
                        
                        <button onClick={applyFilters} className="bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-[#173062] px-5 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                            Filter
                        </button>
                    </div>

                    {/* Error / Loading States */}
                    {error && <div className="p-4 bg-red-50 text-red-600 rounded-md mb-6 font-medium">{error}</div>}
                    {loading && (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#173062]"></div>
                        </div>
                    )}

                    {/* Task List (Table Header) - Changed font-bold to font-medium */}
                    {!loading && !error && filteredTasks.length > 0 && (
                        <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                            <div className="col-span-3">Task Name</div>
                            <div className="col-span-2 text-center">Status</div>
                            <div className="col-span-2">Deadline</div>
                            <div className="col-span-2">Assignee</div>
                            <div className="col-span-2 text-center">Priority</div>
                            <div className="col-span-1 text-right">Actions</div>
                        </div>
                    )}

                    {/* Task List Items */}
                    {!loading && !error && filteredTasks.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200 mt-4">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                            </div>
                            <p className="text-gray-900 font-medium text-lg">No tasks found</p>
                            <p className="text-gray-500 text-sm mt-1 font-medium">There are no tasks matching this criteria.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {filteredTasks.map((t) => {
                                const currentUserId = user?._id || user?.id;
                                const creatorId = t.createdBy?._id || t.createdBy;
                                const isCreatorOrAdmin = creatorId === currentUserId || user?.role === "ADMIN";
                                const dueInfo = getDueDateStatus(t.dueDate);

                                return (
                                    <div key={t._id} className="grid grid-cols-12 gap-4 items-center py-4 px-4 border-b border-gray-100 hover:bg-gray-50/50 transition-colors text-sm">
                                        
                                        {/* Task Name - Changed font-bold to font-medium */}
                                        <div className="col-span-3 flex flex-col">
                                            <span className="font-medium text-gray-900 truncate pr-2 hover:text-[#0284c7] cursor-pointer transition" onClick={() => navigate(`/tasks/${t._id}`)}>
                                                {t.title}
                                            </span>
                                        </div>

                                        {/* Status Badge */}
                                        <div className="col-span-2 flex justify-center">
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getStatusStyles(t.status)}`}>
                                                {t.status.replace('_', ' ')}
                                            </span>
                                        </div>

                                        {/* Deadline */}
                                        <div className={`col-span-2 ${dueInfo.style}`}>
                                            {dueInfo.text}
                                        </div>

                                        {/* Assignee */}
                                        <div className="col-span-2 flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-[#173062]/10 text-[#173062] flex items-center justify-center text-[10px] font-bold shrink-0">
                                                {t.assignedTo?.name ? t.assignedTo.name.charAt(0).toUpperCase() : "?"}
                                            </div>
                                            <span className="text-gray-700 font-medium truncate">
                                                {t.assignedTo?.name || "Unassigned"}
                                            </span>
                                        </div>

                                        {/* Priority Badge */}
                                        <div className="col-span-2 flex justify-center">
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getPriorityStyles(t.priority)}`}>
                                                {t.priority}
                                            </span>
                                        </div>

                                        {/* Actions */}
                                        <div className="col-span-1 flex items-center justify-end gap-2">
                                            <button onClick={() => navigate(`/tasks/edit/${t._id}`)} className="text-gray-400 hover:text-[#173062] transition p-1" title="Edit Task">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            </button>
                                            
                                            {isCreatorOrAdmin && (
                                                <button 
                                                    onClick={() => remove(t._id)} 
                                                    disabled={deletingId === t._id}
                                                    className="text-gray-400 hover:text-red-600 transition p-1 disabled:opacity-50"
                                                    title="Delete Task"
                                                >
                                                    {deletingId === t._id ? (
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                                                    ) : (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    )}
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
                        <div className="flex justify-center gap-2 mt-auto pt-8 border-t border-gray-100">
                            {Array.from({ length: pagination.pages }).map((_, index) => (
                                <button 
                                    key={index} 
                                    onClick={() => { setPage(index + 1); loadTasks(index + 1); }} 
                                    className={`w-8 h-8 rounded-md text-sm font-medium transition shadow-sm border ${ 
                                        page === index + 1 
                                        ? "bg-[#173062] text-white border-[#173062]" 
                                        : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-[#173062]" 
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