import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";
import User from "../models/User";

export const register = async (req: Request, res: Response) => {
    try{

        const { name, email, password } = req.body;
        const data = await registerUser(
            name,
            email,
            password
        );
        res.status(201).json(data);

    }catch(error){
        res.status(400).json({message: (error as Error).message});
    }
};

export const login = async (req: Request, res: Response) => {
    try{
        const {email, password} = req.body;
        const data = await loginUser(email,password);
        res.json(data);
    }catch(error){
        res.status(401).json({message: (error as Error).message});
    }
}

export const me = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
};