import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { readdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';                   
import { Server } from 'socket.io';        
import jwt from 'jsonwebtoken';   

// Setup for __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Config dotenv
dotenv.config();

// Initialize app
const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use(morgan("dev"));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Connected to DB"))
  .catch(err => console.log("MongoDB connection error:", err));

// Auto-load routes
const routeFiles = readdirSync(path.join(__dirname, "routes"));

for (const file of routeFiles) {
  if (file.endsWith(".js")) {
    const route = await import(`./routes/${file}`);
    app.use("/api", route.default);
  }
}

// Create HTTP server
const server = http.createServer(app);

// --- Setup Socket.IO ---
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  }
});

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("No token provided"));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded._id;
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  console.log("📡 User connected:", socket.userId);
  socket.join(socket.userId); // Join personal room

  // Listen for message sending
  socket.on("sendMessage", async ({ to, content }) => {
    try {
      const Message = (await import("./models/message.js")).default;
      const message = await Message.create({
        sender: socket.userId,
        receiver: to,
        content,
      });

      // Send message to both sender and receiver
      io.to(to).to(socket.userId).emit("message", message);
    } catch (err) {
      console.log("SendMessage Error:", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.userId);
  });
});

// Test route
app.get("/", (req, res) => {
  res.send("<h1>Welcome to my Website</h1>");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
