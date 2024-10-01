import mongoose from "mongoose";

const MessageSchema = mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    sentTo: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    sentBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Message = mongoose.model("Message", MessageSchema);