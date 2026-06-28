export type TaskStatus = | "OPEN" | "IN_PROGRESS" | "TESTING" | "DONE";
export type TaskPriority = | "LOW" | "MEDIUM" | "HIGH";

export interface Task {
    _id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: string;
    assignedTo?: string | { _id: string; name: string; email: string }; 
    createdBy?: string | { _id: string; name: string; email: string };
}