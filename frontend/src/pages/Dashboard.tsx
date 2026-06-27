import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import { useAuth } from "../hooks/useAuth";
import { getTasks } from "../services/tasks.service";

// Helper to format due dates
const formatDueTime = (diffHours: number) => {
    if (diffHours < 0) {
        const absHours = Math.abs(diffHours);
        if (absHours > 24) return `${Math.floor(absHours / 24)}d overdue`;
        return `${Math.floor(absHours)}h overdue`;
    }
    if (diffHours < 24) {
        const hrs = Math.floor(diffHours);
        const mins = Math.floor((diffHours - hrs) * 60);
        return `Due in ${hrs}h ${mins}m`;
    }
    return `Due in ${Math.floor(diffHours / 24)} days`;
};

export default function Dashboard() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    
    // Categorized Stats
    const [createdStats, setCreatedStats] = useState({ OPEN: 0, IN_PROGRESS: 0, TESTING: 0, DONE: 0, total: 0 });
    const [assignedStats, setAssignedStats] = useState({ OPEN: 0, IN_PROGRESS: 0, TESTING: 0, DONE: 0, total: 0 });
    
    // Urgent Tasks Array
    const [dueSoonTasks, setDueSoonTasks] = useState<any[]>([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) return;
            try {
                const res = await getTasks({ limit: 200 }); // Fetch a healthy amount to calculate stats
                const tasks = res.data.data || [];
                
                const cStats = { OPEN: 0, IN_PROGRESS: 0, TESTING: 0, DONE: 0, total: 0 };
                const aStats = { OPEN: 0, IN_PROGRESS: 0, TESTING: 0, DONE: 0, total: 0 };
                const urgent: any[] = [];
                const currentUserId = user._id || user.id;
                const now = new Date();

                tasks.forEach((t: any) => {
                    const creatorId = t.createdBy?._id || t.createdBy;
                    const assigneeId = t.assignedTo?._id || t.assignedTo;
                    const isCreator = creatorId === currentUserId;
                    const isAssignee = assigneeId === currentUserId;

                    // Tally Created
                    if (isCreator) {
                        cStats[t.status as keyof typeof cStats] = (cStats[t.status as keyof typeof cStats] || 0) + 1;
                        cStats.total++;
                    }
                    // Tally Assigned
                    if (isAssignee) {
                        aStats[t.status as keyof typeof aStats] = (aStats[t.status as keyof typeof aStats] || 0) + 1;
                        aStats.total++;
                    }

                    // Calculate Due Soon (Assigned to me OR Created by me, NOT DONE, Due within 48h or Overdue)
                    if ((isCreator || isAssignee) && t.status !== 'DONE' && t.dueDate) {
                        const dueDate = new Date(t.dueDate);
                        // Add 23:59:59 to the due date to make it end-of-day
                        dueDate.setHours(23, 59, 59, 999);
                        const diffHours = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
                        
                        if (diffHours <= 48) { // 48 hours or overdue
                            urgent.push({ ...t, diffHours, isAssignee });
                        }
                    }
                });

                // Sort urgent tasks: most overdue/closest first
                urgent.sort((a, b) => a.diffHours - b.diffHours);

                setCreatedStats(cStats);
                setAssignedStats(aStats);
                setDueSoonTasks(urgent.slice(0, 6)); // Keep top 6 urgent
            } catch (error) {
                console.error("Failed to load dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    // Progress Bar Helper
    const calcWidth = (val: number, total: number) => total === 0 ? '0%' : `${(val / total) * 100}%`;

    return (
        <div className="h-screen flex bg-[#f8fafc]">
            <Sidebar />
            
            <main className="flex-1 flex flex-col xl:flex-row overflow-hidden">
                
                {/* Main Content Area (Stats & Overviews) */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-10 scrollbar-hide">
                    <header className="mb-10 flex justify-between items-end">
                        <div>
                            <h2 className="text-3xl font-bold text-[#173062] tracking-tight">Dashboard</h2>
                            <p className="text-gray-500 mt-1 font-medium">
                                Welcome back, <span className="text-[#0284c7]">{user?.name}</span>
                            </p>
                        </div>
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Today</p>
                            <p className="text-[#173062] font-semibold">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                        </div>
                    </header>

                    {user?.role === "ADMIN" && (
                        <div className="bg-linear-to-r from-emerald-50 to-teal-50 border border-emerald-100 p-4 rounded-xl mb-8 shadow-sm flex items-start gap-4">
                            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700 mt-0.5">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-emerald-900">Admin Privileges Active</h3>
                                <p className="text-sm text-emerald-700 font-medium mt-0.5">You have elevated access to view and manage all workspace activities.</p>
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="h-64 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#173062]"></div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            
                            {/* TASKS ASSIGNED TO ME */}
                            <section className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#38bdf8]"></div>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-[#173062]">Tasks Assigned to Me</h3>
                                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-bold">{assignedStats.total} Total</span>
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <p className="text-xs font-bold text-gray-500 uppercase mb-1">Open</p>
                                        <p className="text-2xl font-black text-gray-800">{assignedStats.OPEN}</p>
                                    </div>
                                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                        <p className="text-xs font-bold text-blue-600 uppercase mb-1">In Progress</p>
                                        <p className="text-2xl font-black text-blue-900">{assignedStats.IN_PROGRESS}</p>
                                    </div>
                                    <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                                        <p className="text-xs font-bold text-purple-600 uppercase mb-1">Testing</p>
                                        <p className="text-2xl font-black text-purple-900">{assignedStats.TESTING}</p>
                                    </div>
                                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                        <p className="text-xs font-bold text-emerald-600 uppercase mb-1">Done</p>
                                        <p className="text-2xl font-black text-emerald-900">{assignedStats.DONE}</p>
                                    </div>
                                </div>

                                {/* Visual Progress Bar */}
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-gray-400 uppercase mb-2">
                                        <span>Progress Distribution</span>
                                        <span className="text-[#65a30d]">{assignedStats.total > 0 ? Math.round((assignedStats.DONE / assignedStats.total) * 100) : 0}% Completed</span>
                                    </div>
                                    <div className="h-3 w-full bg-gray-100 rounded-full flex overflow-hidden">
                                        <div style={{ width: calcWidth(assignedStats.DONE, assignedStats.total) }} className="bg-[#65a30d] transition-all duration-1000"></div>
                                        <div style={{ width: calcWidth(assignedStats.TESTING, assignedStats.total) }} className="bg-purple-400 transition-all duration-1000"></div>
                                        <div style={{ width: calcWidth(assignedStats.IN_PROGRESS, assignedStats.total) }} className="bg-[#38bdf8] transition-all duration-1000"></div>
                                        <div style={{ width: calcWidth(assignedStats.OPEN, assignedStats.total) }} className="bg-gray-300 transition-all duration-1000"></div>
                                    </div>
                                </div>
                            </section>

                            {/* MY CREATED TASKS */}
                            <section className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#65a30d]"></div>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-[#173062]">Tasks I've Delegated</h3>
                                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-bold">{createdStats.total} Total</span>
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <p className="text-xs font-bold text-gray-500 uppercase mb-1">Open</p>
                                        <p className="text-2xl font-black text-gray-800">{createdStats.OPEN}</p>
                                    </div>
                                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                        <p className="text-xs font-bold text-blue-600 uppercase mb-1">In Progress</p>
                                        <p className="text-2xl font-black text-blue-900">{createdStats.IN_PROGRESS}</p>
                                    </div>
                                    <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                                        <p className="text-xs font-bold text-purple-600 uppercase mb-1">Testing</p>
                                        <p className="text-2xl font-black text-purple-900">{createdStats.TESTING}</p>
                                    </div>
                                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                        <p className="text-xs font-bold text-emerald-600 uppercase mb-1">Done</p>
                                        <p className="text-2xl font-black text-emerald-900">{createdStats.DONE}</p>
                                    </div>
                                </div>

                                {/* Visual Progress Bar */}
                                <div>
                                    <div className="h-3 w-full bg-gray-100 rounded-full flex overflow-hidden mt-6">
                                        <div style={{ width: calcWidth(createdStats.DONE, createdStats.total) }} className="bg-[#65a30d] transition-all duration-1000"></div>
                                        <div style={{ width: calcWidth(createdStats.TESTING, createdStats.total) }} className="bg-purple-400 transition-all duration-1000"></div>
                                        <div style={{ width: calcWidth(createdStats.IN_PROGRESS, createdStats.total) }} className="bg-[#38bdf8] transition-all duration-1000"></div>
                                        <div style={{ width: calcWidth(createdStats.OPEN, createdStats.total) }} className="bg-gray-300 transition-all duration-1000"></div>
                                    </div>
                                </div>
                            </section>

                        </div>
                    )}
                </div>

                {/* Right Sidebar (Priority & Due Soon) */}
                <aside className="w-full xl:w-96 bg-white border-l border-gray-200 overflow-y-auto flex flex-col">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 sticky top-0 z-10 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-lg text-red-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h3 className="text-lg font-bold text-[#173062]">Priority Inbox</h3>
                        </div>
                        <p className="text-sm text-gray-500 mt-2 font-medium">Tasks needing immediate attention.</p>
                    </div>

                    <div className="p-6 flex-1">
                        {!loading && dueSoonTasks.length === 0 ? (
                            <div className="text-center py-10">
                                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <p className="text-gray-900 font-bold">You're all caught up!</p>
                                <p className="text-sm text-gray-500 mt-1">No tasks due within 48 hours.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {dueSoonTasks.map(task => {
                                    const isOverdue = task.diffHours < 0;
                                    
                                    return (
                                        <Link 
                                            key={task._id} 
                                            to={`/tasks/${task._id}`}
                                            className="block p-4 rounded-xl border border-gray-100 bg-white hover:border-[#38bdf8] hover:shadow-md transition group"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                                    isOverdue ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                                                }`}>
                                                    {formatDueTime(task.diffHours)}
                                                </span>
                                                <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded uppercase">
                                                    {task.isAssignee ? 'For Me' : 'Delegated'}
                                                </span>
                                            </div>
                                            
                                            <h4 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-[#0284c7] transition line-clamp-2">
                                                {task.title}
                                            </h4>
                                            
                                            <div className="flex items-center gap-2 mt-3 text-xs font-medium text-gray-500">
                                                <span className="w-2 h-2 rounded-full bg-[#38bdf8]"></span>
                                                {task.status.replace('_', ' ')}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </aside>

            </main>
        </div>
    );
}