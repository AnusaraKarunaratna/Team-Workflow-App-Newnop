import { Response } from "express";
import { getAllUsers, updateUserRole } from "../services/user.service";
import User from "../models/User";

export const getUsers = async (req: any, res: Response) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export const changeRole = async (req: any, res: Response) => {
    try {
        const { targetUserId, newRole } = req.body;
        const requester = await User.findById(req.user.id);  
        if (!requester) return res.status(404).json({ message: "User not found" });
        const updatedUser = await updateUserRole(targetUserId, newRole, requester.email);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};