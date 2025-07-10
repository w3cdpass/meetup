require("dotenv").config();
const express = require('express');
const { User, Chat } = require('./models/User');
const { createServer, validateHeaderName } = require('node:http');
const { Server } = require('socket.io');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');
const app = express();
const client = new OAuth2Client();
const cookieParser = require('cookie-parser');
const cookie = require('cookie');
const jwt = require('jsonwebtoken');
const { default: mongoose, Types } = require("mongoose");
const authMiddleware = require("./middlewares/authMiddleware");
const { Socket } = require("node:dgram");
const keys = {
  "web": {
    "client_id": process.env.GOOGLE_CLIENT_ID
  }
}

app.use(cors({
  // origin: process.env.NODE_ENV === 'development'
  //     ? 'http://localhost:5173' // Vite dev server
  //     : 'app://./' ,// Electron production

  // curl -i -X OPTIONS http://localhost:3000/ -H "Origin: http://localhost:5173
  origin: ['http://localhost:5173', 'app://./'],
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));
const Jwt_Token = process.env.JWT_SECRET
const DB = process.env.MONGO_URI
mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() =>
  console.log('Data base connected'));
app.use(express.json());
app.use(cookieParser());
app.get('/api/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate(
      'friendRequestsReceived',
      'name picture _id',
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err.message });
  }
});

app.post('/', async (req, res) => {
  const token = req.body.token;
  if (!token) {
    return res.status(400).json({ error: 'Missing token' });
  }
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      // audience: keys.web.client_id,
    });

    const payload = ticket.getPayload();
    console.log("✅ Token verified:", payload);
    let user = await User.findOne({ googleId: payload.sub });
    if (!user) {
      user = await User.create({
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      });
    }
    const appToken = jwt.sign({
      userId: user._id.toString(),
      email: user.email,
    }, Jwt_Token, { expiresIn: '30hr' });
    res.cookie("token", appToken, {
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
    })
    res.status(200).json({ message: 'Login success', user });
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
})


app.get('/frnd-req/:senderId', authMiddleware, async (req, res) => {
  const receiverId = req.user.userId;         // Authenticated user (e.g. Rahul)
  const senderId = req.params.senderId;       // ID in the URL (e.g. Vikas)

  if (!mongoose.isValidObjectId(senderId)) {
    return res.status(400).json({ error: 'Invalid sender ID' });
  }

  if (receiverId === senderId) {
    return res.status(400).json({ error: "You can't send a request to yourself." });
  }

  const sender = await User.findById(senderId);
  const receiver = await User.findById(receiverId);

  if (!sender || !receiver) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Check if already friends or already sent
  if (
    receiver.friendRequestsReceived.includes(senderId) ||
    receiver.friends.includes(senderId)
  ) {
    return res.redirect('http://localhost:5173/chats');
  }

  // Add friend request
  receiver.friendRequestsReceived.push(senderId);
  sender.friendRequestsSent.push(receiverId);

  await receiver.save();
  await sender.save();

  return res.redirect('http://localhost:5173/chats');
});



app.post('/frnd-req/:senderId/accept', authMiddleware, async (req, res) => {
  try {
    const receiverId = req.user.userId; // the logged-in user
    const senderId = req.params.senderId;

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if sender actually sent a request
    if (!receiver.friendRequestsReceived.includes(senderId)) {
      return res.status(400).json({ message: "No friend request from this user." });
    }

    // Add each other as friends
    sender.friends.push(receiverId);
    receiver.friends.push(senderId);

    // Remove request from both sides
    sender.friendRequestsSent = sender.friendRequestsSent.filter(id => id.toString() !== receiverId);
    receiver.friendRequestsReceived = receiver.friendRequestsReceived.filter(id => id.toString() !== senderId);

    await sender.save();
    await receiver.save();

    return res.status(200).json({ message: "Friend request accepted." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

app.post('/frnd-req/:senderId/decline', authMiddleware, async (req, res) => {
  try {
    const receiverId = req.user.userId;
    const senderId = req.params.senderId;

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if sender sent a request
    if (!receiver.friendRequestsReceived.includes(senderId)) {
      return res.status(400).json({ message: "No friend request from this user." });
    }

    // Remove request from both users
    sender.friendRequestsSent = sender.friendRequestsSent.filter(id => id.toString() !== receiverId);
    receiver.friendRequestsReceived = receiver.friendRequestsReceived.filter(id => id.toString() !== senderId);

    await sender.save();
    await receiver.save();

    return res.status(200).json({ message: "Friend request declined." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

app.get('/chats', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId)
      .populate({
        path: 'friends',
        select: 'name email picture socketId',
        populate: {
          path: 'chats',
          select: '_id participants lastMessageAt',
          match: { participants: userId }
        }
      })
      .exec();

    // Enhance friends data with chat info
    const friendsWithChats = user.friends.map(friend => {
      const chat = friend.chats?.[0]; // Get the chat between current user and this friend
      return {
        ...friend.toObject(),
        chatId: chat?._id,
        lastMessageAt: chat?.lastMessageAt
      };
    });

    // Sort friends by most recent chat activity
    friendsWithChats.sort((a, b) => {
      const dateA = a.lastMessageAt || new Date(0);
      const dateB = b.lastMessageAt || new Date(0);
      return dateB - dateA;
    });

    res.json({ friends: friendsWithChats });
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ error: 'Failed to load friends' });
  }
});

// Get or create a chat between current user and another user
// GET /chat/:chatId/messages
app.get('/chats/:chatId/messages', authMiddleware, async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.userId;    
    const chat = await Chat.findById(chatId).populate('participants','name messages')
    const chats = chat.participants
    if (!chats.find((value) => value._id.toString() === userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }


    const messages = chat || [];
    // const messages = (chat?.messages || []).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    res.json({ messages });
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});



const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ["GET", "POST"],
    credentials: true
  }
});



const onlineUsers = new Map();
const typingUsers = new Set();
io.on('connection', async (ConnectionSocket) => {
  const cookies = cookie.parse(ConnectionSocket.handshake.headers.cookie || '')
  // console.log(cookies.token)
  const token = cookies.token;

  if (!token) return ConnectionSocket.disconnect(true)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    // console.log(userId)
    const user = await User.findById(userId).populate('friends');
    if (!user) return ConnectionSocket.disconnect(true)

    // Save user ID
    onlineUsers.set(ConnectionSocket.id, userId);

    console.log(`✅ User ${user.name} connected (${ConnectionSocket.id})`);

    user.friends.forEach((friend) => {
      const friendId = friend._id?.toString?.() || friend.toString();
      const roomName = createRoomName(userId, friendId);
      ConnectionSocket.join(roomName);
    });


    ConnectionSocket.on("join_debug", () => {
      const rooms = [...ConnectionSocket.rooms];
      console.log(`Socket ${ConnectionSocket.id} is in rooms:`, rooms);
    });

    
    ConnectionSocket.on('typing', ({ chatId, senderId }) => {
      typingUsers.add(`${chatId}: ${senderId}`);

      ConnectionSocket.broadcast.emit('user typing', {
        chatId, senderId
      })
    })

    ConnectionSocket.on("stop typing", ({ chatId, senderId }) => {
      typingUsers.delete(`${chatId}: ${senderId}`)
      ConnectionSocket.broadcast.emit('user stop typing', {
        chatId, senderId
      })
    })

    ConnectionSocket.on('send_message', async ({ to, text }) => {
      const room = createRoomName(userId, to);

      // 1. Validate friendship
      const sender = await User.findById(userId);
      const isFriend = sender.friends.some((id) => id.toString() === to);

      if (!isFriend) {
        return ConnectionSocket.emit('error', { message: "User is not your friend" });
      }


      // 2. Construct the message object
      const message = {
        from: userId,
        to,
        text,
        timestamp: new Date().toISOString(),
      };

      // // 3. Emit to frontend immediately (real-time)
      io.to(room).emit('receive_message', message);
      // // 4. Delay DB save (e.g., after 3 seconds)
      setTimeout(async () => {
        let chat = await Chat.findOne({
          participants: { $all: [userId, to], $size: 2 },
        });

        if (!chat) {
          chat = new Chat({
            participants: [userId, to],
            messages: [],
          });
        }

        chat.messages.push({
          sender: userId,
          text,
          timestamp: new Date(),
          status: 'sent',
        });

        await chat.save();
        console.log('💾 Message saved to DB');
      }, 3000); // Save after 3 seconds
    });
    ConnectionSocket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${ConnectionSocket.id}`);
    });
  } catch (error) {
    console.error('JWT Error:', error);
    ConnectionSocket.disconnect(true);
  }
})

function createRoomName(userId1, userId2) {
  return [userId1, userId2].sort().join('_');
}

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
