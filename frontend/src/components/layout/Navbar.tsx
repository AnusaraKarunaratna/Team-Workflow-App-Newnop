import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    }

    return(
        <header 
            className="
                h-16
                px-6
                border-b
                flex
                justify-between
                items-center
            "
        >
            <h1>Team Workflow</h1>
            <button onClick={logout}>Logout</button>
        </header>
    );
}