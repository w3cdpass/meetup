const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors({
    origin: process.env.NODE_ENV === 'development'
        ? 'http://localhost:5173' // Vite dev server
        : 'app://./' // Electron production
}));

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:3000'],
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Track connected users and typing status
const users = new Map();
const typingUsers = new Set();

io.on('connection', (socket) => {
    const username = `User${Math.floor(Math.random() * 1000)}`;
    users.set(socket.id, username);

    // Notify everyone about new user
    io.emit('user connected', username);

    // Send current typing users to new connection
    socket.emit('typing update', Array.from(typingUsers));

    // Handle chat messages
    socket.on('chat message', (msg) => {
        const messageData = {
            id: Date.now().toString(),
            text: msg,
            timestamp: new Date(),
            username: users.get(socket.id),
            socketId: socket.id,
            status: 'delivered'
        };

        io.emit('chat message', messageData);

        // Here you would normally save to MongoDB
        // await saveMessageToDB(messageData);
    });

    // Handle typing indicators
    socket.on('typing', (isTyping) => {
        if (isTyping) {
            typingUsers.add(socket.id);
        } else {
            typingUsers.delete(socket.id);
        }

        // Broadcast to all except sender
        const typingUsernames = Array.from(typingUsers).map(id => users.get(id));
        socket.broadcast.emit('typing update', typingUsernames);
    });

    // Handle message read receipts
    socket.on('message read', (messageId) => {
        io.emit('message status', {
            messageId,
            status: 'read'
        });

        // Here you would update in MongoDB
        // await updateMessageStatus(messageId, 'read');
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        const username = users.get(socket.id);
        io.emit('user disconnected', username);
        users.delete(socket.id);
        typingUsers.delete(socket.id);

        // Update typing indicators for remaining users
        socket.broadcast.emit('typing update', Array.from(typingUsers));
    });
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});

// Helper functions (would normally interact with MongoDB)
/*
async function saveMessageToDB(message) {
  // Your existing MongoDB message saving logic
}

async function updateMessageStatus(messageId, status) {
  // Your existing MongoDB update logic
}
*/