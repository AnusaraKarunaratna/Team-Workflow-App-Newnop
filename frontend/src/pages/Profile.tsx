import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

export default function Profile() {
    // 1. Extract setUser alongside user
    const { user, setUser } = useAuth(); 
    const navigate = useNavigate();

    const handleLogout = () => {
        // 2. Clear the token from browser storage
        localStorage.removeItem("token");
        
        // 3. Clear the user from React's memory (CRITICAL FIX)
        setUser(null); 
        
        toast.success("Logged out successfully");
        navigate("/login");
    };

    if (!user) {
        return (
            <div className="flex justify-center items-center mt-32">
                <p className="text-gray-500 animate-pulse text-lg font-medium">Loading profile...</p>
            </div>
        );
    }

    const initial = user.name ? user.name.charAt(0).toUpperCase() : "U";

    return (
        <div className="max-w-3xl mx-auto mt-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                
                {/* Decorative Header Banner */}
                <div className="h-32 bg-gradient-to-r from-indigo-600 to-blue-500 relative">
                    {/* Floating Avatar */}
                    <div className="absolute -bottom-12 left-8 w-24 h-24 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center text-4xl font-bold text-indigo-600">
                        {initial}
                    </div>
                </div>

                <div className="pt-16 px-8 pb-8">
                    {/* Main Profile Info & Logout Action */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-10">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                            <div className="flex items-center gap-3 mt-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase border ${
                                    user.role === 'ADMIN' 
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                    : 'bg-blue-50 text-blue-700 border-blue-200'
                                }`}>
                                    {user.role || 'USER'}
                                </span>
                            </div>
                        </div>

                        <button 
                            onClick={handleLogout}
                            className="bg-white text-red-600 hover:bg-red-50 hover:border-red-200 border border-gray-200 px-5 py-2.5 rounded-lg font-medium transition flex items-center gap-2 shadow-sm whitespace-nowrap"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sign Out
                        </button>
                    </div>

                    {/* Account Details Grid */}
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Account Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
                        {/* Email Address */}
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase">Email Address</p>
                                <p className="text-sm font-semibold text-gray-900 mt-0.5">{user.email}</p>
                            </div>
                        </div>

                        {/* User ID */}
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-gray-200 rounded-lg text-gray-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase">Account ID</p>
                                <p className="text-sm font-mono text-gray-600 mt-0.5">{user._id || user.id}</p>
                            </div>
                        </div>

                        {/* Join Date */}
                        {user.createdAt && (
                            <div className="flex items-start gap-3 md:col-span-2 pt-2 border-t border-gray-200">
                                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase">Member Since</p>
                                    <p className="text-sm font-semibold text-gray-900 mt-0.5">
                                        {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}