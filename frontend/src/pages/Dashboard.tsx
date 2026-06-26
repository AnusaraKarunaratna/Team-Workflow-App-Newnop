import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import StatCard from "../components/common/StatCard";
import { useAuth } from "../hooks/useAuth";
import { getTasks } from "../services/tasks.service";

export default function Dashboard() {
    const { user } = useAuth();
    const [createdStats, setCreatedStats] = useState({ OPEN: 0, IN_PROGRESS: 0, TESTING: 0, DONE: 0 });
    const [assignedStats, setAssignedStats] = useState({ OPEN: 0, IN_PROGRESS: 0, TESTING: 0, DONE: 0 });

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) return;
            try {
                // Fetch a large limit so we get an accurate tally
                const res = await getTasks({ limit: 1000 });
                const tasks = res.data.data || [];
                
                const cStats = { OPEN: 0, IN_PROGRESS: 0, TESTING: 0, DONE: 0 };
                const aStats = { OPEN: 0, IN_PROGRESS: 0, TESTING: 0, DONE: 0 };
                const currentUserId = user._id || user.id;

                tasks.forEach((t: any) => {
                    const creatorId = t.createdBy?._id || t.createdBy;
                    const assigneeId = t.assignedTo?._id || t.assignedTo;

                    if (creatorId === currentUserId) {
                        cStats[t.status as keyof typeof cStats] = (cStats[t.status as keyof typeof cStats] || 0) + 1;
                    }
                    if (assigneeId === currentUserId) {
                        aStats[t.status as keyof typeof aStats] = (aStats[t.status as keyof typeof aStats] || 0) + 1;
                    }
                });

                setCreatedStats(cStats);
                setAssignedStats(aStats);
            } catch (error) {
                console.error("Failed to load dashboard stats", error);
            }
        };

        fetchDashboardData();
    }, [user]);

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="p-8 flex-1 overflow-y-auto">
                    <header className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
                        <p className="text-gray-600 mt-1">
                            Welcome back, <span className="font-semibold text-indigo-600">{user?.name}</span>!
                        </p>
                    </header>

                    {user?.role === "ADMIN" && (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-lg mb-8 shadow-sm flex items-center gap-3">
                            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            <div>
                                <h3 className="font-bold">Admin Panel Active</h3>
                                <p className="text-sm text-emerald-700">You have elevated privileges to manage the workspace.</p>
                            </div>
                        </div>
                    )}

                    <section className="mb-10">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">My Created Tasks</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard title="Open" count={createdStats.OPEN} className="border-blue-200 bg-white shadow-sm" />
                            <StatCard title="In Progress" count={createdStats.IN_PROGRESS} className="border-yellow-200 bg-white shadow-sm" />
                            <StatCard title="Testing" count={createdStats.TESTING} className="border-purple-200 bg-white shadow-sm" />
                            <StatCard title="Done" count={createdStats.DONE} className="border-green-200 bg-white shadow-sm" />
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Tasks Assigned To Me</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard title="Open" count={assignedStats.OPEN} className="border-blue-200 bg-white shadow-sm" />
                            <StatCard title="In Progress" count={assignedStats.IN_PROGRESS} className="border-yellow-200 bg-white shadow-sm" />
                            <StatCard title="Testing" count={assignedStats.TESTING} className="border-purple-200 bg-white shadow-sm" />
                            <StatCard title="Done" count={assignedStats.DONE} className="border-green-200 bg-white shadow-sm" />
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}