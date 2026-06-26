import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Helper to style active navigation links
    const isActive = (path: string) => location.pathname === path;
    const linkClass = (path: string) => 
        `transition-colors px-3 py-2 rounded-md text-sm font-medium ${
            isActive(path) 
            ? 'bg-indigo-800 text-white shadow-inner' 
            : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'
        }`;

    return (
        <header className="h-16 px-6 bg-indigo-700 text-white flex justify-between items-center shadow-md z-10 sticky top-0 shrink-0">
            <div className="flex items-center gap-8">
                {/* Logo & Brand */}
                <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition">
                    <svg className="w-8 h-8 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                    <h1 className="text-xl font-bold tracking-wide hidden sm:block">Team Workflow</h1>
                </Link>

                {/* Main Navigation - Changes based on authentication */}
                {!loading && (
                    <nav className="flex items-center gap-2">
                        {user ? (
                            <>
                                <Link to="/" className={linkClass("/")}>Dashboard</Link>
                                <Link to="/tasks" className={linkClass("/tasks")}>Tasks</Link>
                                <Link to="/about" className={linkClass("/about")}>About</Link>
                            </>
                        ) : (
                            <>
                                <Link to="/about" className={linkClass("/about")}>About</Link>
                                <Link to="/login" className={linkClass("/login")}>Login</Link>
                                <Link to="/register" className={linkClass("/register")}>Register</Link>
                            </>
                        )}
                    </nav>
                )}
            </div>
            
            {/* Profile Avatar (Only shows if logged in) */}
            {user && (
                <Link 
                    to="/profile" 
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-800 hover:bg-indigo-900 border-2 border-indigo-500 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700"
                    title="View Profile"
                >
                    <span className="font-bold text-sm tracking-widest text-indigo-100">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </span>
                </Link>
            )}
        </header>
    );
}