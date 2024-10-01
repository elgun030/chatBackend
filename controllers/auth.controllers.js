import { User } from "../models/user.model.js";

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signUp = async (req, res) => {
    const { fullName, userName, password, confirmPassword, profilePic } = req.body;

    const responseMessage = [
        [ "fullName", "Valid" ],
        [ "userName", "Valid" ],
        [ "password", "Valid" ],
        [ "confirmPassword", "Valid" ],
        [ "profilePic", "Valid" ],
    ];

    if (fullName.length < 3) responseMessage[0][1] = 'Full name must be at least 3 characters';
    if (userName.length < 3) responseMessage[1][1] = 'Username must be at least 3 characters';
    if (password.length < 6) responseMessage[2][1] = 'Password must be at least 6 characters';
    if (confirmPassword !== password) responseMessage[3][1] = 'Passwords do not match';
    if (!profilePic) responseMessage[4][1] = 'Profile picture URL is required';

    if (responseMessage.some(([_, msg]) => msg !== 'Valid')) {
        return res.status(400).json({ responseMessage });
    }

    try {
        const [user, hashedPassword] = await Promise.all([
            User.findOne({ userName }),
            bcrypt.genSalt().then(salt => bcrypt.hash(password, salt))
        ]);

        if (user) {
            responseMessage.userName = 'Username already exists';
            return res.status(400).json({ responseMessage });
        }

        const newUser = await User.create({
            userName,
            fullName,
            password: hashedPassword,
            profilePic
        });

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '15d' });
        // res.cookie('jwt', token,
        // {
        //     maxAge: 1296000000, // 15 days
        //     sameSite: 'None',
        //     secure: true
        // });

        return res.status(201).json({ responseMessage: 'User created successfully', data: newUser, token });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ responseMessage: 'Internal server error' });
    }
};

export const signIn = async (request, response) => {
    const { userName, password } = request.body;

    const existingUser = await User.findOne({ userName });

    if ( !existingUser || ! await bcrypt.compare(password, existingUser.password))  {
        response.status(401).send("Wrong username or password");
        return;
    }

    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: "15d" });

    // response.cookie("jwt", token, {
    //     maxAge: 1296000000,  // 15 days
    //     sameSite: 'None',
    //     secure: true
    // });
    
    response.status(200).send({ message: "Logged in successfully", data: existingUser, token });
};

// export const logout = async (request, response) => {
//     response.cookie("jwt", "", {
//         expires: new Date(0),
//         httpOnly: true,
//         path: "/",
//         sameSite: 'Strict'
//     });

//     response.status(200).send("Logged out successfully");
// };