import { User } from "../models/user.model.js";
import mongoose from "mongoose";

export const getAllUsers = async (request, response) => {
    const id = request.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        response.status(400).send({ message: "Invalid id" });
        return;
    }

    const allUsers = await User.find();

    response.status(200).send({ message: "Successfull", data: allUsers });
};