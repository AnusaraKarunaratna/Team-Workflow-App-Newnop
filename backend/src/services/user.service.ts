import User from '../models/User';

export const getAllUsers = async () => {
    // .select("-password") excludes the password field from the query results
    const users = await User.find().select("-password").sort({ name: 1 });
    return users;
};