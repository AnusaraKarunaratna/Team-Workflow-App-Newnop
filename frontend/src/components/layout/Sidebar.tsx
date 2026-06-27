import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  // Helper function to check active paths
  const isActive = (path: string) => location.pathname === path;

  // Helper for dynamic classes
  const linkClass = (path: string) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
      isActive(path) 
      ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100' 
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-transparent'
  }`;

  // Helper to get the user's first initial, falling back to 'U' if no name/email exists
  const userInitial = user?.name 
    ? user.name.charAt(0).toUpperCase() 
    : (user?.email ? user.email.charAt(0).toUpperCase() : 'U');

  return (
    // FIX: Replaced 'h-screen sticky top-0' with 'h-full shrink-0 overflow-y-auto'
    <aside className="w-64 bg-white border-r border-gray-200 h-full shrink-0 overflow-y-auto p-4 flex flex-col gap-2 shadow-sm">
      
      <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 mt-2">Menu</p>

      {/* Primary Navigation */}
      <Link to="/dashboard" className={linkClass("/dashboard")}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
        Dashboard
      </Link>

      <Link to="/tasks" className={linkClass("/tasks")}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
        Tasks
      </Link>

      {/* Admin Navigation */}
      {user?.role === "ADMIN" && (
        <>
          <div className="my-2 border-t border-gray-100"></div>
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Admin</p>
          <Link to="/users" className={linkClass("/users")}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
            User Management
          </Link>
        </>
      )}

      {/* User Profile Section (Pushed to bottom using mt-auto) */}
      <div className="mt-auto pt-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-2 py-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors">
          
          {/* Initial-based Avatar */}
          <div className="w-10 h-10 shrink-0 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg">
            {userInitial}
          </div>
          
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium text-gray-900 truncate">
              {user?.name || "Jonathan Hope"}
            </span>
            <span className="text-xs text-gray-500 truncate">
              {user?.email || "john@email.com"}
            </span>
          </div>
          
          <svg className="w-4 h-4 ml-auto text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
        </div>
      </div>

    </aside>
  );
}