import mongoose from 'mongoose';

export enum TaskStatus{
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    TESTING = "TESTING",
    DONE = "DONE",
}

export enum TaskPriority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
}

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

        description: String,

        priority: {
            type: String,
            enum: Object.values(TaskPriority),
            default: TaskPriority.MEDIUM,
        },

        status: {
            type: String,
            enum: Object.values(TaskStatus),
            default: TaskStatus.OPEN,
        },

        dueDate: Date,

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref : "User",
        },
    },
    { timestamps: true}
);

export default mongoose.model("Task", taskSchema);