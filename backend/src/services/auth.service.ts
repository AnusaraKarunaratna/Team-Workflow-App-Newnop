import User from '../models/User';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/generateToken';

export const registerUser = async (name: string, email: string,password: string) => {

    // To check weather the password contains 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#])[A-Za-z\d@$!%*?&_#]{8,}$/;

    if (!passwordRegex.test(password)) {
        throw new Error("Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.");
    }

    const existing = await User.findOne({ email });
    if(existing){
        throw new Error ("Email already exists");
    }

    const hashed = await bcrypt.hash(password,10);
    const user = await User.create({
        name,
        email,
        password: hashed,
    });

    const token = generateToken(user._id.toString());
    return {
        token,
        user,
    };
};

export const loginUser = async (email:string,password: string) => {
    const user = await User.findOne({email});

    if(!user){
        throw new Error("Invalid credentials");
    }

    const valid= await bcrypt.compare(password, user.password);

    if(!valid){
        throw new Error("Invalid credentials");
    }

    return{
        token: generateToken(user._id.toString()),
        user
    };
};
