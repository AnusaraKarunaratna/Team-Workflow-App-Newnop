import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/auth.service";
import toast from "react-hot-toast";
import background from "../assets/background.png";
import { useAuth } from "../hooks/useAuth";

export default function Register() {
    const nav = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { setUser } = useAuth();

    const submit = async (e: any) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await registerUser({ name, email, password });
            localStorage.setItem("token", res.data.token);
            setUser(res.data.user);
            toast.success("Account created successfully!");
            nav("/dashboard");
        } catch {
            toast.error("Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex w-full bg-white font-sans">
            
            {/* Left Panel: Full Cover Image (No Text/Blue Background) */}
            <div className="hidden lg:block w-1/2 relative z-10 shadow-2xl rounded-r-[3.5rem] overflow-hidden bg-gray-100">
                <img 
                    src={background} 
                    alt="Register Background" 
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </div>

            {/* Right Panel: Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-20 bg-white">
                <div className="w-full max-w-md">
                    
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h2 className="text-[28px] font-bold text-[#173062] mb-3">Create Account</h2>
                        <p className="text-[#173062] text-sm font-medium">Sign up to start managing your tasks.</p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        {/* Full Name Input */}
                        <div>
                            <input
                                type="text"
                                required
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#173062] focus:border-[#173062] outline-none transition placeholder-gray-400 text-gray-800"
                            />
                        </div>

                        {/* Email Input */}
                        <div>
                            <input
                                type="email"
                                required
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#173062] focus:border-[#173062] outline-none transition placeholder-gray-400 text-gray-800"
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <input
                                type="password"
                                required
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#173062] focus:border-[#173062] outline-none transition placeholder-gray-400 text-gray-800"
                            />
                        </div>

                        {/* Primary Gradient Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-linear-to-r from-[#24457e] to-[#6a9f4c] hover:opacity-95 text-white font-bold py-3.5 rounded-xl transition shadow-md disabled:opacity-70 tracking-wide text-[15px]"
                            >
                                {loading ? "Creating account..." : "Sign Up"}
                            </button>
                        </div>
                    </form>

                    {/* Divider */}
                    <div className="mt-10 flex items-center">
                        <div className="grow border-t border-[#173062]/30"></div>
                        <span className="shrink-0 mx-4 text-[#173062] text-sm font-medium">OR</span>
                        <div className="grow border-t border-[#6a9f4c]/40"></div>
                    </div>

                    {/* Sign In Link */}
                    <p className="mt-8 text-center text-sm font-medium text-[#173062]">
                        Already have an account?{" "}
                        <Link to="/login" className="text-[#6a9f4c] hover:text-[#527d3b] transition">
                            Sign In!
                        </Link>
                    </p>

                </div>
            </div>
            
        </div>
    );
}