import api from "../api/axios";

export const getUsers = () => 
    api.get("/users");