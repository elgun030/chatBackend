import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import mongoose from 'mongoose';

import { getSocketId, io } from "../socket.js";

export const getMessage = async (request, response) => {
    const userId = request.userId;
    const { chatPartnerId } = request.params;

    const messages = await Message.find({ $or: [
        { sentTo: userId, sentBy: chatPartnerId },
        { sentTo: chatPartnerId, sentBy: userId }
    ]});

    if (!messages) {
        response.status(404).send("Something went wrong");
        return;
    }

    response.status(200).send({ message: "Messages fetched successfully", data: messages });
};

export const sendMessage = async (request, response) => {
    const userId = request.userId;
    const { chatPartnerId } = request.params;
    const { content } = request.body;

    if ( userId === chatPartnerId ) {
        response.status(500).send("You can't send messages to yourself");
        return;
    }

    if ( !content ) {
        response.status(500).send("No content provided");
        return;
    }

    if ( !mongoose.Types.ObjectId.isValid(userId) || !await User.findById(userId) ) {
        response.status(404).send("Invalid sender id");
        return;
    }

    if ( !mongoose.Types.ObjectId.isValid(chatPartnerId) ) {
        response.status(404).send("Invalid reciver id");
        return;
    }

    const reciverUser = await User.findById(chatPartnerId);

    if (!reciverUser) {
        response.status(404).send("Invalid reciver id");
        return;
    }

    const newMessage = await Message.create( {
        text: content,
        sentBy: userId,
        sentTo: chatPartnerId
    } );

    if ( !newMessage ) {
        response.status(400).send("Something went wrong");
        return;
    }

    const reciverSocketId = getSocketId(reciverUser.userName);

    io.to(reciverSocketId).emit("newMessage", { newMessage, senderId: userId })

    response.status(201).send(newMessage);
};