import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import logo from "../../assets/logo.png";

export default function Navbar() {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Helper to determine if a route is currently active
    const isActive = (path: string) => location.pathname === path;

    // Text link styling for both Logged-In and Logged-Out users
    // Active = Solid Blue Button, Inactive = Text Link
    const textLinkClass = (path: string) => 
        `font-medium px-5 py-2 transition text-sm rounded-lg ${
            isActive(path) 
            ? 'bg-[#173062] text-white shadow-sm' 
            : 'text-[#173062] hover:text-[#0284c7] hover:bg-gray-50'
        }`;

    return (
        <header className="h-18 px-6 bg-white flex justify-between items-center border-b border-gray-200 sticky top-0 shrink-0 z-20">
            
            {/* Image Logo */}
            <div className="shrink-0">
                <Link to="/" className="flex items-center hover:opacity-90 transition">
                    <img 
                        src={logo}
                        alt="Logo" 
                        className="h-10 w-auto object-contain" 
                    />
                </Link>
            </div>

            {/* Right: Navigation Links */}
            <div className="flex items-center gap-4 shrink-0">
                {!loading && (
                    <nav className="flex items-center gap-2 sm:gap-4">
                        {user ? (
                            <>
                                {/* Logged-In State: Text Links */}
                                <Link to="/dashboard" className={textLinkClass("/dashboard")}>
                                    Dashboard
                                </Link>
                                <Link to="/tasks" className={textLinkClass("/tasks")}>
                                    Tasks
                                </Link>
                                <Link to="/" className={textLinkClass("/")}>
                                    About
                                </Link>

                                {/* Profile Avatar with First Initial */}
                                <Link 
                                    to="/profile" 
                                    className={`ml-2 flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-all ${
                                        isActive("/profile")
                                        ? 'bg-[#173062] text-white ring-2 ring-offset-2 ring-[#173062]'
                                        : 'bg-gray-100 text-[#173062] hover:bg-[#173062] hover:text-white'
                                    }`}
                                    title="Profile"
                                >
                                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                                </Link>
                            </>
                        ) : (
                            <>
                                {/* Logged-Out State: Text Links */}
                                <Link to="/" className={textLinkClass("/")}>
                                    About
                                </Link>
                                <Link to="/login" className={textLinkClass("/login")}>
                                    Sign In
                                </Link>
                                <Link to="/register" className={textLinkClass("/register")}>
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                )}
            </div>
        </header>
    );
}