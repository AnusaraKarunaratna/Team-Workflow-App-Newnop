import { Response } from "express";
import { getAllUsers } from "../services/user.service";

export const getUsers = async (req: any, res: Response) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};