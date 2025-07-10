const mongoose = require('mongoose');
const { Schema } = mongoose;
const userSchema = new mongoose.Schema({
    googleId: { type: String, required: true, unique: true },
    email: String,
    name: String,
    picture: String,

    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    chats: [{ type: Schema.Types.ObjectId, ref: 'Chat' }],
    friendRequestsSent: [{ type: Schema.Types.ObjectId, ref: 'User' }],

    friendRequestsReceived: [{ type: Schema.Types.ObjectId, ref: 'User' }],

    socketId: String,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);


const messageSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['sent', 'delivered', 'read'],
        default: 'sent',
    }
});

const chatSchema = new Schema({
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    messages: [messageSchema],
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema,);

module.exports = { User, Chat }