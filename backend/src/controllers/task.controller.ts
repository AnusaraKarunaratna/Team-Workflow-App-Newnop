import { Request, Response } from "express";
import { createTask, getTasks, getTaskById, updateTask, deleteTask} from "../services/task.service";

export const create = async (req: any, res: Response) => {
    try{
        const task = await createTask(req.body, req.user.id);
        res.status(201).json(task);
    }catch(error){
        res.status(400).json({ message: (error as Error).message });
    }
};

export const getAll = async (req: any, res: Response) => {
    try{
        const tasks = await getTasks(req.user);
        res.json(tasks);
    }catch(error){
        res.status(400).json({message: (error as Error).message});
    }
};

export const getOne = async (req: any, res: Response) => {
    try{
        const task = await getTaskById(req.params.id, req.user);
        res.json(task);
    }catch(error){
        res.status(400).json({message: (error as Error).message});
    }
};

export const update = async (req: any, res: Response) => {
    try{
        const task = await updateTask(req.params.id, req.body, req.user);
        res.json(task);
    }catch(error){
        res.status(400).json({message: (error as Error).message});
    }
};

export const remove = async (req: any, res: Response) => {
    try{
        const result = await deleteTask(req.params.id, req.user);
    }catch(error){
        res.status(400).json({message: (error as Error).message});
    }
};