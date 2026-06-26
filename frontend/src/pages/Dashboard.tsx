import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import StatCard from "../components/common/StatCard";

export default function Dashboard() {
    return (
        <div
            className="h-screen flex flex-col">
            <Navbar />
            <div className="flex flex1">
                <Sidebar />
                <main className="p-8 flex-1">
                    <h2>Dashboard</h2>
                    <div className="grid grid-cols-4 gap-4 mt-6">
                        <StatCard title="Open" count={0} />
                        <StatCard title="In Progress" count={0} />
                        <StatCard title="Testing" count={0} />
                        <StatCard title="Done" count={0} />
                    </div>
                </main>
            </div>
        </div>
    );
}