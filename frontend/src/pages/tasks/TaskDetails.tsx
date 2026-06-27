import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTaskById } from "../../services/tasks.service";
import toast from "react-hot-toast";
import Sidebar from "../../components/layout/Sidebar"; // Added Sidebar import

export default function TaskDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getTaskById(id!);
                setTask(res.data);
            } catch (error: any) {
                toast.error(error.response?.data?.message || "Failed to load task details");
                navigate("/tasks");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id, navigate]);

    // Ensure layout structure is maintained even during loading
    if (loading) {
        return (
            <div className="flex bg-gray-50 overflow-hidden font-sans w-full h-[calc(100vh-72px)]">
                <Sidebar />
                <main className="flex-1 flex justify-center items-center">
                    <p className="text-gray-400 animate-pulse text-sm font-medium">Loading task details...</p>
                </main>
            </div>
        );
    }

    if (!task) return null;

    return (
        // Standardized wrapper applied here
        <div className="flex bg-gray-50 overflow-hidden font-sans w-full h-[calc(100vh-72px)]">
            
            <Sidebar />

            <main className="flex-1 overflow-y-auto p-6 md:p-8">
                {/* Centered card container matching CreateTask layout */}
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col p-8 md:p-10 mb-8">
                    
                    {/* Breadcrumb / Top Navigation */}
                    <div className="mb-8 border-b border-gray-100 pb-6">
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                            <button onClick={() => navigate('/tasks')} className="hover:text-indigo-600 transition flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                Back to Tasks
                            </button>
                            <span className="text-gray-300">/</span>
                            <span>Details</span>
                        </div>

                        {/* Header Title & Badges */}
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                            <h1 className="text-3xl font-bold text-gray-900 leading-tight flex-1">
                                {task.title}
                            </h1>
                            <div className="flex flex-wrap gap-2 items-center pt-1 shrink-0">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                    task.status === 'OPEN' ? 'bg-gray-100 text-gray-700' :
                                    task.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                                    task.status === 'TESTING' ? 'bg-purple-50 text-purple-700 border border-purple-100' : 
                                    'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                }`}>
                                    {task.status.replace('_', ' ')}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border
                                    ${task.priority === 'HIGH' ? 'bg-red-50 text-red-700 border-red-200' : 
                                      task.priority === 'MEDIUM' ? 'bg-orange-50 text-orange-700 border-orange-200' : 
                                      'bg-purple-50 text-purple-700 border-purple-200'}`}>
                                    {task.priority} Priority
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="mb-10">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Description</h3>
                        <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
                                {task.description || <span className="text-gray-400 italic">No description provided.</span>}
                            </p>
                        </div>
                    </div>

                    {/* Metadata Grid */}
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Task Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                        
                        {/* Assignee */}
                        <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-white hover:border-indigo-100 transition-colors">
                            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 shrink-0">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Assigned To</p>
                                <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate">
                                    {task.assignedTo?.name || task.assignedTo || "Unassigned"}
                                </p>
                                {task.assignedTo?.email && (
                                    <p className="text-xs text-gray-500 truncate">{task.assignedTo.email}</p>
                                )}
                            </div>
                        </div>

                        {/* Creator */}
                        <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-white hover:border-gray-200 transition-colors">
                            <div className="p-2 bg-gray-50 rounded-lg text-gray-500 shrink-0 border border-gray-200">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Created By</p>
                                <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate">
                                    {task.createdBy?.name || task.createdBy || "Unknown User"}
                                </p>
                            </div>
                        </div>

                        {/* Due Date */}
                        <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-white hover:border-orange-100 transition-colors">
                            <div className="p-2 bg-orange-50 rounded-lg text-orange-600 shrink-0">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Due Date</p>
                                <p className={`text-sm font-semibold mt-0.5 truncate ${!task.dueDate ? 'text-gray-400 italic' : 'text-gray-900'}`}>
                                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-GB', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : "No deadline set"}
                                </p>
                            </div>
                        </div>

                        {/* Created At Date */}
                        <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-white hover:border-gray-200 transition-colors">
                            <div className="p-2 bg-gray-50 rounded-lg text-gray-500 shrink-0 border border-gray-200">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Created On</p>
                                <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate">
                                    {task.createdAt ? new Date(task.createdAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' }) : "N/A"}
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* Footer Actions */}
                    <div className="mt-auto flex justify-end pt-6 border-t border-gray-100">
                        <button 
                            onClick={() => navigate(`/tasks/edit/${task._id}`)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium flex items-center gap-2 transition px-6 py-2.5 rounded-lg shadow-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            Edit Task
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}