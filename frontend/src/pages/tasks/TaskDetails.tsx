import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTaskById } from "../../services/tasks.service";
import toast from "react-hot-toast";

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

    if (loading) {
        return (
            <div className="flex justify-center items-center mt-32">
                <p className="text-gray-500 animate-pulse text-lg font-medium">Loading task details...</p>
            </div>
        );
    }

    if (!task) return null;

    return (
        <div className="max-w-3xl mx-auto mt-12 bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-8">
                <h1 className="text-3xl font-bold text-gray-900 leading-tight flex-1">
                    {task.title}
                </h1>
                <div className="flex flex-wrap gap-2 items-center">
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold tracking-wide bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                        {task.status}
                    </span>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase border
                        ${task.priority === 'HIGH' ? 'bg-red-50 text-red-700 border-red-200' : 
                          task.priority === 'MEDIUM' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                          'bg-green-50 text-green-700 border-green-200'}`}>
                        {task.priority} Priority
                    </span>
                </div>
            </div>

            {/* Description Section */}
            <div className="mb-10">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Description</h3>
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {task.description || <span className="text-gray-400 italic">No description provided.</span>}
                    </p>
                </div>
            </div>

            {/* Metadata Grid */}
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Task Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 p-5 rounded-xl border border-gray-100 bg-white">
                
                {/* Assignee */}
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">Assigned To</p>
                        <p className="text-sm font-semibold text-gray-900 mt-0.5">
                            {task.assignedTo?.name || task.assignedTo || "Unassigned"}
                        </p>
                        {task.assignedTo?.email && (
                            <p className="text-xs text-gray-500">{task.assignedTo.email}</p>
                        )}
                    </div>
                </div>

                {/* Creator */}
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">Created By</p>
                        <p className="text-sm font-semibold text-gray-900 mt-0.5">
                            {task.createdBy?.name || task.createdBy || "Unknown User"}
                        </p>
                    </div>
                </div>

                {/* Due Date */}
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">Due Date</p>
                        <p className={`text-sm font-semibold mt-0.5 ${!task.dueDate ? 'text-gray-500 italic' : 'text-gray-900'}`}>
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' }) : "No deadline"}
                        </p>
                    </div>
                </div>

                {/* Created At Date */}
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">Created On</p>
                        <p className="text-sm font-semibold text-gray-900 mt-0.5">
                            {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : "N/A"}
                        </p>
                    </div>
                </div>

            </div>

            {/* Footer Actions */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                <button 
                    onClick={() => navigate('/tasks')}
                    className="text-gray-500 hover:text-indigo-600 font-medium flex items-center gap-2 transition px-4 py-2 rounded-lg hover:bg-indigo-50"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Tasks
                </button>

                <button 
                    onClick={() => navigate(`/tasks/edit/${task._id}`)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex items-center gap-2 transition px-6 py-2 rounded-lg shadow-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    Edit Task
                </button>
            </div>
        </div>
    );
}