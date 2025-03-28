const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");
const UserService = require("../services/UserService.js");
const Notification = require("../models/Notifications");

// Keep track of connected users
const connectedUsers = new Map();

function setupSocketServer(server) {
  const io = socketIo(server, {
    cors: {
      origin: process.env.CORS_ORIGIN,
    },
  });

  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error("Authentication error"));

      // Verify token
      const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
      const user = await UserService.getUserById(decoded.id);

      if (!user) return next(new Error("User not found"));

      // Attach user to socket
      socket.user = user;

      if (user.role_id.role_name != "client") {
        socket.join(`employee_${user.role_id.role_name}`);
      }
      next();
    } catch (error) {
      console.log(error);
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();

    // Store user's socket connection
    connectedUsers.set(userId, { socket: socket.id, user: socket.user });
    // Send initial unread notifications
    socket.on("get-initial-notifications", async () => {
      try {
        const notifications = await Notification.find({
          recipient: userId,
          read: false,
        }).sort({ createdAt: -1 });

        socket.emit("initial-notifications", notifications);
      } catch (error) {
        console.error("Error fetching initial notifications:", error);
      }
    });

    // Handle sending notifications
    socket.on("send-notification", async (data) => {
      try {
        const { recipientId, message_string, to_role } = data;
        const message = await JSON.parse(message_string);
        // Create notification
        const notification = new Notification({
          recipient: recipientId,
          role: to_role || "client",
          sender: userId,
          title: message.title,
          message: message.content,
        });
        await notification.save();

        // Check if recipient is connected

        if (to_role && to_role != "client") {
          console.log("\t send to room client");
          io.to(`employee_${to_role}`).emit("new-notification", notification);
        } else if (recipientId) {
          console.log("\t send to user ", recipientId);
          const recipient = connectedUsers.get(recipientId);
          console.log(recipientId, recipientId);
          const recipientSocketId = recipient.socket;
          io.to(recipientSocketId).emit("new-notification", notification);
        }
      } catch (error) {
        console.error("Error sending notification:", error);
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      connectedUsers.delete(userId);
    });
  });

  return io;
}

module.exports = {
  setupSocketServer,
  getConnectedUsers: () => connectedUsers,
};
