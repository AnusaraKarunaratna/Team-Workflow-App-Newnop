import api from "../api/axios";

export const loginUser = (data: any) => 
    api.post("/auth/login",data);

export const registerUser = (data:any) => 
    api.post("/auth/register",data);

export const getMe = () => 
    api.get("/auth/me");