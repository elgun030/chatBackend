import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        minlength: 3
    },
    fullName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    profilePic: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const User = mongoose.model("User", UserSchema);