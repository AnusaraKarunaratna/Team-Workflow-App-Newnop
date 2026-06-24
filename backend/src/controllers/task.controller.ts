import { Request, Response } from "express";
import { createTask, getTasks, getTaskById, updateTask, deleteTask} from "../services/task.service";
import { asyncHandler } from "../utils/asyncHandler";

export const create = async (req: any, res: Response) => {
    try{
        const task = await createTask(req.body, req.user.id);
        res.status(201).json(task);
    }catch(error){
        res.status(400).json({ message: (error as Error).message });
    }
};

// req.query contains the key-value pairs found in the URL after the question mark (?). It is primarily used for filtering, sorting, or pagination.
export const getAll = asyncHandler (async(req: any, res: Response) => {
    const result = await getTasks(req.user, req.query);
    res.json(result);
});

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