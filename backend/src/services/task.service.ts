import { getAssetKeys } from "node:sea";
import Task from "../models/Task";

export const createTask = async (data: any, userId: string) => {
    //This takes all the properties inside the dataobject and create a new object with createdBy field.
    return await Task.create({
        ...data,
        createdBy: userId,
    });
}

export const getTasks = async (user: any, query: any) => {

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page-1) * limit;

    const filter: any = {};

    // Role Based Authorization 
    if (user.role !== "ADMIN") {
        filter.$or = [
            { createdBy: user.id },
            { assignedTo: user.id} 
        ];
    }

    // Filters
    if (query.status) filter.status = query.status;
    if (query.priority) filter.priority = query.priority;

    // search 
    if (query.search) {
        filter.title = {
            $regex : query.search,
            //"i" stands for Case-Insensitivity.
            $options: "i",
        };
    }

    const tasks = await Task.find(filter)
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    const total = await Task.countDocuments(filter);

    return {
        data: tasks,
        pagination: {
            total,
            page,
            pages: Math.ceil(total / limit),
        },
    };
};

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