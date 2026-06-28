import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import { useAuth } from "../hooks/useAuth";
import { getTasks } from "../services/tasks.service";

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
    const [allStats, setAllStats] = useState({ OPEN: 0, IN_PROGRESS: 0, TESTING: 0, DONE: 0, total: 0 });
    const [createdStats, setCreatedStats] = useState({ OPEN: 0, IN_PROGRESS: 0, TESTING: 0, DONE: 0, total: 0 });
    const [assignedStats, setAssignedStats] = useState({ OPEN: 0, IN_PROGRESS: 0, TESTING: 0, DONE: 0, total: 0 });
    
    // Urgent Tasks Array
    const [dueSoonTasks, setDueSoonTasks] = useState<any[]>([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) return;
            try {
                const res = await getTasks({ limit: 200 }); 
                const tasks = res.data.data || [];
                
                const glStats = { OPEN: 0, IN_PROGRESS: 0, TESTING: 0, DONE: 0, total: 0 };
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

                    // Tally Global (Admin View)
                    glStats[t.status as keyof typeof glStats] = (glStats[t.status as keyof typeof glStats] || 0) + 1;
                    glStats.total++;

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
                        dueDate.setHours(23, 59, 59, 999);
                        const diffHours = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
                        
                        if (diffHours <= 48) { 
                            urgent.push({ ...t, diffHours, isAssignee });
                        }
                    }
                });

                // Sort urgent tasks: most overdue/closest first
                urgent.sort((a, b) => a.diffHours - b.diffHours);

                setAllStats(glStats);
                setCreatedStats(cStats);
                setAssignedStats(aStats);
                setDueSoonTasks(urgent.slice(0, 6)); 
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
        <div className="flex flex-1 h-full min-h-0 bg-gray-50 overflow-hidden font-sans w-full">
            <Sidebar />
            
            <main className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 min-h-full flex flex-col p-8">
                    
                    {/* Header Section */}
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                                <span>Overview</span>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                            <p className="text-gray-500 text-sm">
                                Welcome back, <span className="font-semibold text-[#173062]">{user?.name}</span>
                            </p>
                        </div>
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Today</p>
                            <p className="text-gray-800 font-medium text-sm border border-gray-200 bg-gray-50 px-3 py-1.5 rounded-lg">
                                {new Date().toLocaleDateString('en-GB', { weekday: 'long', month: 'short', day: 'numeric' })}
                            </p>
                        </div>
                    </div>

                    {user?.role === "ADMIN" && (
                        <div className="bg-[#173062]/5 border border-[#173062]/20 p-4 rounded-xl mb-8 flex items-start gap-4">
                            <div className="p-2 bg-[#173062]/10 rounded-lg text-[#173062] mt-0.5">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-[#173062]">Admin Privileges Active</h3>
                                <p className="text-xs text-[#173062]/80 font-medium mt-1">You have elevated access to view and manage all workspace activities.</p>
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex-1 flex justify-center items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#173062]"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            
                            {/* Left Column: Stats */}
                            <div className="col-span-2 space-y-8">

                                {/* GLOBAL WORKSPACE TASKS (ADMIN ONLY) */}
                                {user?.role === "ADMIN" && (
                                    <section className="bg-[#081c43] rounded-2xl p-6 hover:shadow-md transition-shadow relative overflow-hidden">
                                        {/* Decorative background shape */}
                                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>
                                        
                                        <div className="flex justify-between items-center mb-6 relative z-10">
                                            <h3 className="text-lg font-bold text-white">Global Workspace Overview</h3>
                                            <span className="bg-white/10 border border-white/20 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">{allStats.total} Total Tasks</span>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 relative z-10">
                                            <div className="p-4 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl">
                                                <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider mb-1">Open</p>
                                                <p className="text-2xl font-black text-white">{allStats.OPEN}</p>
                                            </div>
                                            <div className="p-4 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl">
                                                <p className="text-[10px] font-bold text-[#38bdf8] uppercase tracking-wider mb-1">In Progress</p>
                                                <p className="text-2xl font-black text-white">{allStats.IN_PROGRESS}</p>
                                            </div>
                                            <div className="p-4 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl">
                                                <p className="text-[10px] font-bold text-[#c084fc] uppercase tracking-wider mb-1">Testing</p>
                                                <p className="text-2xl font-black text-white">{allStats.TESTING}</p>
                                            </div>
                                            <div className="p-4 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl">
                                                <p className="text-[10px] font-bold text-[#52b618] uppercase tracking-wider mb-1">Done</p>
                                                <p className="text-2xl font-black text-white">{allStats.DONE}</p>
                                            </div>
                                        </div>

                                        {/* Visual Progress Bar */}
                                        <div className="relative z-10">
                                            <div className="flex justify-between text-[10px] font-bold text-white/60 uppercase tracking-wider mb-2">
                                                <span>System-Wide Progress</span>
                                                <span className="text-white">{allStats.total > 0 ? Math.round((allStats.DONE / allStats.total) * 100) : 0}% Completed</span>
                                            </div>
                                            <div className="h-2 w-full bg-black/20 rounded-full flex overflow-hidden">
                                                <div style={{ width: calcWidth(allStats.DONE, allStats.total) }} className="bg-[#6a9f4c] transition-all duration-1000"></div>
                                                <div style={{ width: calcWidth(allStats.TESTING, allStats.total) }} className="bg-[#c084fc] transition-all duration-1000"></div>
                                                <div style={{ width: calcWidth(allStats.IN_PROGRESS, allStats.total) }} className="bg-[#38bdf8] transition-all duration-1000"></div>
                                                <div style={{ width: calcWidth(allStats.OPEN, allStats.total) }} className="bg-white/30 transition-all duration-1000"></div>
                                            </div>
                                        </div>
                                    </section>
                                )}
                                
                                {/* TASKS ASSIGNED TO ME */}
                                <section className="border border-gray-100 rounded-2xl p-6 hover:shadow-sm transition-shadow">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg font-bold text-gray-900">Tasks Assigned to Me</h3>
                                        <span className="bg-gray-50 border border-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">{assignedStats.total} Total</span>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                        <div className="p-4 bg-white border border-gray-100 rounded-xl">
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Open</p>
                                            <p className="text-2xl font-black text-gray-800">{assignedStats.OPEN}</p>
                                        </div>
                                        <div className="p-4 bg-white border border-gray-100 rounded-xl">
                                            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-1">In Progress</p>
                                            <p className="text-2xl font-black text-blue-600">{assignedStats.IN_PROGRESS}</p>
                                        </div>
                                        <div className="p-4 bg-white border border-gray-100 rounded-xl">
                                            <p className="text-[10px] font-bold text-purple-500 uppercase tracking-wider mb-1">Testing</p>
                                            <p className="text-2xl font-black text-purple-600">{assignedStats.TESTING}</p>
                                        </div>
                                        <div className="p-4 bg-white border border-gray-100 rounded-xl">
                                            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-1">Done</p>
                                            <p className="text-2xl font-black text-emerald-600">{assignedStats.DONE}</p>
                                        </div>
                                    </div>

                                    {/* Visual Progress Bar */}
                                    <div>
                                        <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                                            <span>Progress Distribution</span>
                                            <span className="text-emerald-600">{assignedStats.total > 0 ? Math.round((assignedStats.DONE / assignedStats.total) * 100) : 0}% Completed</span>
                                        </div>
                                        <div className="h-2 w-full bg-gray-100 rounded-full flex overflow-hidden">
                                            <div style={{ width: calcWidth(assignedStats.DONE, assignedStats.total) }} className="bg-emerald-500 transition-all duration-1000"></div>
                                            <div style={{ width: calcWidth(assignedStats.TESTING, assignedStats.total) }} className="bg-purple-400 transition-all duration-1000"></div>
                                            <div style={{ width: calcWidth(assignedStats.IN_PROGRESS, assignedStats.total) }} className="bg-blue-400 transition-all duration-1000"></div>
                                            <div style={{ width: calcWidth(assignedStats.OPEN, assignedStats.total) }} className="bg-gray-300 transition-all duration-1000"></div>
                                        </div>
                                    </div>
                                </section>

                                {/* MY CREATED TASKS */}
                                <section className="border border-gray-100 rounded-2xl p-6 hover:shadow-sm transition-shadow">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg font-bold text-gray-900">Tasks I've Delegated</h3>
                                        <span className="bg-gray-50 border border-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">{createdStats.total} Total</span>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                        <div className="p-4 bg-white border border-gray-100 rounded-xl">
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Open</p>
                                            <p className="text-2xl font-black text-gray-800">{createdStats.OPEN}</p>
                                        </div>
                                        <div className="p-4 bg-white border border-gray-100 rounded-xl">
                                            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-1">In Progress</p>
                                            <p className="text-2xl font-black text-blue-600">{createdStats.IN_PROGRESS}</p>
                                        </div>
                                        <div className="p-4 bg-white border border-gray-100 rounded-xl">
                                            <p className="text-[10px] font-bold text-purple-500 uppercase tracking-wider mb-1">Testing</p>
                                            <p className="text-2xl font-black text-purple-600">{createdStats.TESTING}</p>
                                        </div>
                                        <div className="p-4 bg-white border border-gray-100 rounded-xl">
                                            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-1">Done</p>
                                            <p className="text-2xl font-black text-emerald-600">{createdStats.DONE}</p>
                                        </div>
                                    </div>

                                    {/* Visual Progress Bar */}
                                    <div>
                                        <div className="h-2 w-full bg-gray-100 rounded-full flex overflow-hidden">
                                            <div style={{ width: calcWidth(createdStats.DONE, createdStats.total) }} className="bg-emerald-500 transition-all duration-1000"></div>
                                            <div style={{ width: calcWidth(createdStats.TESTING, createdStats.total) }} className="bg-purple-400 transition-all duration-1000"></div>
                                            <div style={{ width: calcWidth(createdStats.IN_PROGRESS, createdStats.total) }} className="bg-blue-400 transition-all duration-1000"></div>
                                            <div style={{ width: calcWidth(createdStats.OPEN, createdStats.total) }} className="bg-gray-300 transition-all duration-1000"></div>
                                        </div>
                                    </div>
                                </section>

                            </div>

                            {/* Right Column: Priority Inbox */}
                            <aside className="col-span-1 bg-gray-50/50 border border-gray-100 rounded-2xl p-6 flex flex-col h-full min-h-100">
                                <div className="mb-6">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-bold text-gray-900">Priority Inbox</h3>
                                        <div className="bg-red-50 text-red-600 p-1.5 rounded-md">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 font-medium">Tasks needing immediate attention.</p>
                                </div>

                                <div className="flex-1 overflow-y-auto pr-1">
                                    {!loading && dueSoonTasks.length === 0 ? (
                                        <div className="text-center py-10">
                                            <p className="text-gray-400 text-sm font-medium">You're all caught up!</p>
                                            <p className="text-xs text-gray-400 mt-1">No tasks due within 48 hours.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {dueSoonTasks.map(task => {
                                                const isOverdue = task.diffHours < 0;
                                                
                                                return (
                                                    <Link 
                                                        key={task._id} 
                                                        to={`/tasks/${task._id}`}
                                                        className="block p-4 rounded-xl border border-gray-200 bg-white hover:border-[#173062]/30 hover:shadow-sm transition group"
                                                    >
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                                                isOverdue ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                                                            }`}>
                                                                {formatDueTime(task.diffHours)}
                                                            </span>
                                                            <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded uppercase tracking-wider">
                                                                {task.isAssignee ? 'Assigned to Me' : 'Delegated'}
                                                            </span>
                                                        </div>
                                                        
                                                        <h4 className="font-semibold text-gray-800 text-sm mb-2 group-hover:text-[#173062] transition line-clamp-2">
                                                            {task.title}
                                                        </h4>
                                                        
                                                        <div className="flex items-center gap-1.5 mt-3 text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                                                            <span className={`w-1.5 h-1.5 rounded-full ${
                                                                task.status === 'OPEN' ? 'bg-gray-400' :
                                                                task.status === 'IN_PROGRESS' ? 'bg-blue-400' :
                                                                task.status === 'TESTING' ? 'bg-purple-400' : 'bg-emerald-400'
                                                            }`}></span>
                                                            {task.status.replace('_', ' ')}
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </aside>

                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}