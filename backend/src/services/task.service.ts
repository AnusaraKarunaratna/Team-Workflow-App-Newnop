import Task from "../models/Task";
import User from "../models/User"; 

export const createTask = async (data: any, userId: string) => {
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

    // Fetch the actual user from the DB to check their real role
    const currentUser = await User.findById(user.id);

    // Role Based Authorization 
    if (currentUser?.role !== "ADMIN") {
        filter.$or = [
            { createdBy: user.id },
            { assignedTo: user.id} 
        ];
    }

    // Filters
    if (query.status) filter.status = query.status;
    if (query.priority) filter.priority = query.priority;

    // Search 
    if (query.search) {
        filter.title = {
            $regex : query.search,
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

    // Fetch the actual user
    const currentUser = await User.findById(user.id);
    const creatorId = (task.createdBy as any)?._id?.toString();
    const assigneeId = (task.assignedTo as any)?._id?.toString();

    if(
        currentUser?.role !== "ADMIN" &&
        creatorId !== user.id &&
        assigneeId !== user.id
    ) {
        throw new Error("Unauthorized");
    }

    return task;
};


export const updateTask = async (id: string, data: any, user: any) => {
    const task = await Task.findById(id);

    if(!task) throw new Error("Task not found");

    // Fetch the actual user
    const currentUser = await User.findById(user.id);
    const isCreator = task.createdBy.toString() === user.id;
    const isAssignee = task.assignedTo?.toString() === user.id;
    const isAdmin = currentUser?.role === "ADMIN";

    if(!isAdmin && !isCreator && !isAssignee){
        throw new Error("Unauthorized");
    }

    let updatePayload = data;

    if (!isAdmin && !isCreator && isAssignee) {
        updatePayload = { status: data.status };
    }

    if (updatePayload.assignedTo === "") {
        updatePayload.assignedTo = null; 
    }

    return await Task.findByIdAndUpdate(id, updatePayload, { new: true});
}

export const deleteTask = async ( id: string, user: any) => {
    const task = await Task.findById(id);

    if(!task) throw new Error ("Task not found");

    // Fetch the actual user
    const currentUser = await User.findById(user.id);

    if(currentUser?.role !== "ADMIN" && task.createdBy.toString() !== user.id) {
        throw new Error("Unauthorized");
    }

    await Task.findByIdAndDelete(id);
    return { message: "Task deleted"};
}