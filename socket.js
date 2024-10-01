import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

export const app = express();
export const server = http.createServer(app);
export const io = new Server(server, {
    cors: {
        origin: ['https://chat-frontend-main.vercel.app/'],
    }
});

const onlineUsers = {};

export const getSocketId = (userName) => {
    return onlineUsers[userName];
}

io.on('connection', (socket) => {
    const userName = socket.handshake.query.userName;

    onlineUsers[userName] = socket.id;
    console.log(userName);

    io.emit("getOnlineUsers", Object.keys(onlineUsers));

    socket.on('disconnect', () => {
        delete onlineUsers[userName];
        io.emit("getOnlineUsers", Object.keys(onlineUsers));
    });
});
