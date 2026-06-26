import {useState} from "react";
import { useNavigate } from "react-router-dom";
import {loginUser} from "../services/auth.service";

export default function () {

    const nav = useNavigate();
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const submit = async(e:any) =>{
        e.preventDefault();

        try{
            const res = await loginUser({email,password});
            localStorage.setItem("token", res.data.token);
            nav("/");
        }catch{
            alert("Login failed");
        }
    };

    return (
        <form onSubmit={submit}>
            <input 
                placeholder="Email"
                value = {email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input 
                type="password"
                placeholder="Password"
                value = {password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button>Login</button>
        </form>
    );
}