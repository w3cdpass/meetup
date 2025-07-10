const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { User } = require("../models/User");

async function authMiddleware(req, res, next) {
    // 1. Extract token from cookies or Authorization header
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        // 2. Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Validate the decoded userId
        if (!decoded.userId || !mongoose.isValidObjectId(decoded.userId)) {
            return res.status(400).json({ error: "Invalid user ID in token" });
        }

        // 4. Convert to ObjectId and find the user
        const user = await User.findById(new mongoose.Types.ObjectId(decoded.userId));
        
        if (!user) {
            console.error(`User not found for ID: ${decoded.userId}`);
            return res.status(404).json({ error: "User not found" });
        }

        // 5. Attach user data to the request
        req.user = {
            userId: user._id.toString(),
            email: user.email
        };
        
        next();
    } catch (error) {
        console.error("Authentication error:", error.message);
        return res.status(403).json({ 
            error: "Invalid or expired token",
            details: error.message 
        });
    }
}

module.exports = authMiddleware;