import { getAssetKeys } from "node:sea";
import Task from "../models/Task";

export const createTask = async (data: any, userId: string) => {
    //This takes all the properties inside the dataobject and create a new object with createdBy field.
    return await Task.create({
        ...data,
        createdBy: userId,
    });
}

export const getTasks = async (user: any) => {
    if(user.role === "ADMIN"){
        return await Task.find()
            //If the user is an admin, it executes Task.find(), which fetches all tasks in the database, regardless of who created them.
            .populate("createdBy", "name email")
            .populate("assignedTo","name email");
    }

    return await Task.find({
        $or: [
            { createdBy: user.id },
            { assignedTo: user.id },
        ],
    }).populate("assignedTo", "name email");
}

export const getTaskById = async (id: string, user: any) => {
    const task = await Task.findById(id)
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email");

    if (!task) throw new Error("Task not found");

    if(
        user.role !== "ADMIN" &&
        task.createdBy.toString() !== user.id &&
        //? sign is used to accept null or undefined. Without this program will crash in those scenarios.
        task.assignedTo?.toString() !== user.id
    ) {
        throw new Error("Unauthorized");
    }

    return task;
};


export const updateTask = async (id: string, data: any, user: any) => {
    const task = await Task.findById(id);

    if(!task) throw new Error("Task not found");

    if(user.role !== "ADMIN" && task.createdBy.toString() !== user.id){
        throw new Error("Unauthroized");
    }

    return await Task.findByIdAndUpdate(id, data, { new: true});
}

export const deleteTask = async ( id: string, user: any) => {
    const task = await Task.findById(id);

    if(!task) throw new Error ("Task not found");

    if(user.role !== "ADMIN" && task.createdBy.toString() !== user.id) {
        throw new Error("Unauthroized");
    }

    await Task.findByIdAndDelete(id);
    return { message: "Task deleted"};
}

//populate is like JOIN is sql