import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import { useAuth } from "../hooks/useAuth";
import { getUsers, changeUserRole } from "../services/users.service";
import toast from "react-hot-toast";

const superAdmin = import.meta.env.VITE_SUPER_ADMIN_EMAIL;

export default function Team() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    // Check if the logged-in user is the super admin
    const isSuperAdmin = currentUser?.email === superAdmin;

    const fetchUsers = async () => {
        try {
            const res = await getUsers();
            setUsers(res.data);
        } catch (error) {
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (targetUserId: string, currentRole: string, newRole: string) => {
        if (currentRole === newRole) return;
        
        try {
            setUpdatingId(targetUserId);
            await changeUserRole(targetUserId, newRole);
            toast.success("User role updated successfully");
            
            // Update the local state to reflect the change instantly
            setUsers(users.map(u => u._id === targetUserId ? { ...u, role: newRole } : u));
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update role");
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen bg-[#f8fafc]">
                <Sidebar />
                <div className="flex-1 flex justify-center items-center border-l-[6px] border-[#101828]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#173062]"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
            <Sidebar />
            
            <main className="flex-1 overflow-y-auto p-6 lg:p-10 border-l-[6px] border-[#101828]">
                <header className="mb-10">
                    <h2 className="text-3xl font-bold text-[#173062] tracking-tight">Team Management</h2>
                    <p className="text-gray-500 mt-1 font-medium">
                        View all workspace members and manage their access levels.
                    </p>
                </header>

                {!isSuperAdmin && (
                    <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl mb-8 flex items-start gap-4 shadow-sm">
                        <div className="p-2 bg-orange-100 rounded-lg text-orange-600 mt-0.5">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-orange-900">View-Only Mode</h3>
                            <p className="text-sm text-orange-800 mt-0.5 font-medium">Only the Super Administrator ({superAdmin}) has permission to change user roles.</p>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                                    <th className="p-5 font-bold">User</th>
                                    <th className="p-5 font-bold">Account ID</th>
                                    <th className="p-5 font-bold">Join Date</th>
                                    <th className="p-5 font-bold text-right">Role Access</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map((u) => {
                                    const initial = u.name ? u.name.charAt(0).toUpperCase() : "U";
                                    const isCurrentUser = currentUser?._id === u._id || currentUser?.id === u._id;

                                    return (
                                        <tr key={u._id} className="hover:bg-gray-50/50 transition duration-150">
                                            <td className="p-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-[#173062]/10 text-[#173062] flex items-center justify-center font-bold shadow-sm">
                                                        {initial}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 flex items-center gap-2">
                                                            {u.name}
                                                            {isCurrentUser && (
                                                                <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">You</span>
                                                            )}
                                                        </p>
                                                        <p className="text-sm text-gray-500 font-medium">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                    {u._id}
                                                </span>
                                            </td>
                                            <td className="p-5">
                                                <span className="text-sm text-gray-600 font-medium">
                                                    {new Date(u.createdAt).toLocaleDateString()}
                                                </span>
                                            </td>
                                            <td className="p-5 text-right">
                                                {/* Super Admin Dropdown Control */}
                                                <div className="flex justify-end items-center gap-3">
                                                    {updatingId === u._id && (
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#173062]"></div>
                                                    )}
                                                    
                                                    <select
                                                        disabled={!isSuperAdmin || isCurrentUser || updatingId === u._id}
                                                        value={u.role}
                                                        onChange={(e) => handleRoleChange(u._id, u.role, e.target.value)}
                                                        className={`text-sm font-bold rounded-lg border-2 px-3 py-1.5 outline-none transition-all ${
                                                            u.role === 'ADMIN' 
                                                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                                                            : 'bg-white border-gray-200 text-gray-700'
                                                        } ${
                                                            (!isSuperAdmin || isCurrentUser) 
                                                            ? 'opacity-60 cursor-not-allowed appearance-none pr-3' 
                                                            : 'cursor-pointer hover:border-[#38bdf8] focus:border-[#0284c7]'
                                                        }`}
                                                    >
                                                        <option value="USER" className="text-gray-900 font-medium">USER</option>
                                                        <option value="ADMIN" className="text-gray-900 font-medium">ADMIN</option>
                                                    </select>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}