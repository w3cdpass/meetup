const mongoose = require('mongoose');

const readStatusSchema = new mongoose.Schema({
    status: Boolean,
    timestamp: {
        type: Date,
        default: Date.now
    }
})


const deliveredStatusSchema = new mongoose.Schema({
    status: Boolean,
    timestamp: {
        type: Date,
        default: Date.now
    }
})

const messageSchema = new mongoose.Schema({
    text: String,
    read: readStatusSchema,
    deliverd: deliveredStatusSchema,
    socketId: { type: String, required: true },
    isCurrentUser: Boolean,
    timestamp: {
        type: Date,
        default: Date.now
    },
},{ _id: true })

const usernameSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    messages: [messageSchema],
    lastActive: {type: Date, default: Date.now},
    socketId: String,
}, { strict: true })

module.exports = mongoose.model('User', usernameSchema);
// This schema defines a User model with a username, password, and an array of messages.