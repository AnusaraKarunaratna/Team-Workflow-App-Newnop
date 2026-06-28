import { Link } from "react-router-dom";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gray-50 font-sans selection:bg-[#5c61ff] selection:text-white pb-8">

            {/* Custom Styles for Marquee Animation */}
            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
            `}</style>

            {/* HERO SECTION */}
            <div className="p-4 md:p-6">
                <div className="relative bg-[#0a0d55] rounded-[3rem] text-white overflow-hidden pt-24 md:pt-32 flex flex-col items-center text-center shadow-xl border border-indigo-400/30">

                    {/* Subtle background patterns */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

                    <div className="relative z-10 max-w-4xl mx-auto px-6">
                        {/* Top Badge */}
                        <div className="inline-block border border-white/30 rounded-full px-6 py-1.5 text-sm font-medium mb-6 bg-white/5 backdrop-blur-sm">
                            The best way to manage team tasks online.
                        </div>

                        {/* Headlines */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 uppercase leading-[1.1]">
                            Manage your projects <br />
                            <span className="italic font-black mt-2 inline-block">Faster than ever</span>
                        </h1>

                        <p className="text-indigo-100 text-lg md:text-xl font-medium mb-8 max-w-2xl mx-auto">
                            Complete Task Management with powerful CRUD capabilities.
                        </p>

                        <Link to="/tasks" className="inline-block bg-white text-gray-900 px-8 py-3.5 rounded-2xl font-bold text-lg hover:scale-105 hover:shadow-xl transition-all duration-300 mb-12">
                            Try it now
                        </Link>
                    </div>

                    {/* Hero Graphic Workspace */}
                    <div className="relative w-full max-w-5xl mx-auto mt-4 px-4 md:px-0 h-75 md:h-87.5">
                        <img
                            src="https://images.unsplash.com/photo-1542621334-a254cf47733d?q=80&w=2000&auto=format&fit=crop"
                            alt="Workspace"
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full md:w-[80%] h-full object-cover object-top rounded-t-3xl shadow-2xl opacity-90 border-t border-x border-white/20"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-[#46489e] via-transparent to-transparent z-10"></div>

                        {/* Floating Glass Badges - Replaced with CRUD concepts */}
                        <div className="absolute bottom-16 left-[10%] z-20 bg-white/20 backdrop-blur-md border border-white/40 px-4 py-2 rounded-xl items-center gap-2 shadow-2xl hidden md:flex">
                            <span>➕</span> <span className="font-semibold text-sm">Create Tasks</span>
                        </div>
                        <div className="absolute bottom-24 left-[25%] z-20 bg-white/20 backdrop-blur-md border border-white/40 px-4 py-2 rounded-xl items-center gap-2 shadow-2xl hidden md:flex">
                            <span>👁️</span> <span className="font-semibold text-sm">Read Dashboard</span>
                        </div>
                        <div className="absolute bottom-10 right-[25%] z-20 bg-white/20 backdrop-blur-md border border-white/40 px-4 py-2 rounded-xl items-center gap-2 shadow-2xl hidden md:flex">
                            <span>✏️</span> <span className="font-semibold text-sm">Update Status</span>
                        </div>
                        <div className="absolute bottom-20 right-[10%] z-20 bg-white/20 backdrop-blur-md border border-white/40 px-4 py-2 rounded-xl items-center gap-2 shadow-2xl hidden md:flex">
                            <span>🗑️</span> <span className="font-semibold text-sm">Delete Records</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* MARQUEE TICKER */}
            <div className="bg-gray-50 border-b border-gray-200 py-4 overflow-hidden flex whitespace-nowrap relative">
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-linear-to-r from-gray-50 to-transparent z-10"></div>
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-linear-to-l from-gray-50 to-transparent z-10"></div>

                <div className="animate-marquee flex gap-12 items-center text-xs font-bold text-gray-500 uppercase tracking-widest w-[200%]">
                    <div className="flex gap-12 items-center min-w-full justify-around">
                        <span>Master Your Workflow</span><span className="text-gray-300">/</span><span className="text-gray-900 text-base">Create Tasks</span><span className="text-gray-300">/</span>
                        <span>Master Your Workflow</span><span className="text-gray-300">/</span><span className="text-gray-900 text-base">Assign Teams</span><span className="text-gray-300">/</span>
                        <span>Master Your Workflow</span><span className="text-gray-300">/</span><span className="text-gray-900 text-base">Track Progress</span>
                    </div>
                    <div className="flex gap-12 items-center min-w-full justify-around">
                        <span>Master Your Workflow</span><span className="text-gray-300">/</span><span className="text-gray-900 text-base">Create Tasks</span><span className="text-gray-300">/</span>
                        <span>Master Your Workflow</span><span className="text-gray-300">/</span><span className="text-gray-900 text-base">Assign Teams</span><span className="text-gray-300">/</span>
                        <span>Master Your Workflow</span><span className="text-gray-300">/</span><span className="text-gray-900 text-base">Track Progress</span>
                    </div>
                </div>
            </div>

            {/* SECONDARY SECTION (The 'Why' Behind) */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    <div className="order-2 lg:order-1">
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 uppercase leading-tight tracking-tight">
                            The "Why" Behind <br />
                            <span className="italic text-[#1e228d]">Tasker</span>
                        </h2>
                        <p className="text-gray-500 text-base mb-8 leading-relaxed max-w-lg">
                            We saw that teams were spending more time managing tools than doing the actual work. Tasker was built to provide straightforward, fast, and reliable Create, Read, Update, and Delete (CRUD) operations for your entire organization.
                        </p>
                        <button className="bg-[#2a2a2a] hover:bg-black text-white px-6 py-2.5 rounded-xl font-semibold transition shadow-md flex items-center gap-2">
                            View More
                        </button>

                        <div className="mt-10 flex items-center gap-3 border-t border-gray-200 pt-6">
                            <div className="flex -space-x-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex justify-center items-center font-bold text-[10px] text-blue-600">A</div>
                                <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-white flex justify-center items-center font-bold text-[10px] text-emerald-600">K</div>
                                <div className="w-8 h-8 rounded-full bg-purple-100 border-2 border-white flex justify-center items-center font-bold text-[10px] text-purple-600">J</div>
                            </div>
                            <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">5,000+ Global Teams</span>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 relative h-87.5 md:h-100 w-full flex justify-center items-center">
                        <div className="absolute inset-0 bg-linear-to-tr from-gray-100 to-white rounded-4xl shadow-sm border border-gray-100"></div>
                        <img
                            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1500&auto=format&fit=crop"
                            alt="Abstract minimal"
                            className="absolute inset-0 w-full h-full object-cover rounded-4xl opacity-40 mix-blend-multiply"
                        />

                        {/* Floating Cards simulating CRUD operations */}
                        <div className="relative z-10 transform rotate-6 translate-x-8 -translate-y-8 bg-white p-3 pr-8 rounded-xl shadow-lg border border-gray-100 flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-50 rounded-md flex items-center justify-center shadow-inner">📝</div>
                            <span className="font-bold text-gray-800 text-sm">Assign User</span>
                        </div>
                        <div className="relative z-10 transform -rotate-3 -translate-x-4 translate-y-12 bg-white p-3 pr-8 rounded-xl shadow-lg border border-gray-100 flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-50 rounded-md flex items-center justify-center shadow-inner">✅</div>
                            <span className="font-bold text-gray-800 text-sm">Mark as Done</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES GRID - Focused on CRUD */}
            <section className="bg-white py-16 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-2">Core Data Operations</h2>
                        <p className="text-gray-500 text-base">Everything you need to manage database records flawlessly.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-[#1e228d] transition duration-300">
                            <div className="w-12 h-12 bg-white shadow-sm border border-gray-200 rounded-xl flex justify-center items-center text-xl mb-4">➕</div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Create & Assign</h3>
                            <p className="text-gray-500 leading-relaxed text-sm">Instantly generate new task records, set priorities, establish deadlines, and assign them directly to team members.</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-[#1e228d] transition duration-300">
                            <div className="w-12 h-12 bg-white shadow-sm border border-gray-200 rounded-xl flex justify-center items-center text-xl mb-4">🔍</div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Read & Filter</h3>
                            <p className="text-gray-500 leading-relaxed text-sm">View comprehensive dashboards. Filter tasks by status, priority, or search by keywords to find exactly what you need.</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-[#1e228d] transition duration-300">
                            <div className="w-12 h-12 bg-white shadow-sm border border-gray-200 rounded-xl flex justify-center items-center text-xl mb-4">⚙️</div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Update & Delete</h3>
                            <p className="text-gray-500 leading-relaxed text-sm">Modify existing task details and progress statuses, or permanently remove completed and irrelevant records from the database.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA FOOTER */}
            <section className="bg-gray-900 py-16 text-center mt-8 m-4 rounded-4xl border border-gray-800 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '30px 30px' }}></div>
                <div className="relative z-10 max-w-2xl mx-auto px-6">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-4">Stop managing, start doing.</h2>
                    <p className="text-gray-400 text-base mb-8">Join the platform that is redefining team productivity.</p>
                    <Link to="/login" className="inline-block bg-[#5c61ff] hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold text-base shadow-xl hover:shadow-indigo-500/25 transition">
                        Create Free Account
                    </Link>
                </div>
            </section>
        </div>
    );
}