const { Liveblocks } = require("@liveblocks/node");
const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
const router = express.Router();

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY,
});

router.post('/', async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const session = liveblocks.prepareSession(user._id.toString(), {
      userInfo: {
        name: user.name,
        color: getRandomColor(),
        picture: user.picture,
      },
    });

    const { room } = await req.body;
    console.log(room)

    console.log("Room from frontend:", req.body.room);
    console.log("User allowed room:", room);

    session.allow(room, session.FULL_ACCESS);

    const { body, status } = await session.authorize();
    // console.log(body, status)
    return res.status(status).json({token: body}); // ✅ only return token
  } catch (error) {
    console.error('Liveblocks auth error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
});


// Helper function to generate random color
function getRandomColor() {
  const colors = [
    "#ff4d4f", "#40a9ff", "#73d13d", "#ffa940", "#9254de", "#13c2c2",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

module.exports = router;

