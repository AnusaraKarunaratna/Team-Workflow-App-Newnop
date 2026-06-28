import api from "../api/axios";

export const getUsers = () => 
    api.get("/users");

export const changeUserRole = (targetUserId: string, newRole: string) => 
    api.patch("/users/role", { targetUserId, newRole });