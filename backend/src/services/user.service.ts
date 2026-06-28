import User from '../models/User';

export const getAllUsers = async () => {
    // .select("-password") excludes the password field from the query results
    const users = await User.find().select("-password").sort({ name: 1 });
    return users;
};

export const updateUserRole = async (targetUserId: string, newRole: string, requesterEmail: string) => {
    const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN;

    if (requesterEmail !== SUPER_ADMIN_EMAIL) {
        throw new Error("Unauthorized: Only the super administrator can perform this action.");
    }

    const updatedUser = await User.findByIdAndUpdate(
        targetUserId,
        { role: newRole },
        { new: true }
    ).select("-password");

    if (!updatedUser) {
        throw new Error("User not found");
    }

    return updatedUser;
};