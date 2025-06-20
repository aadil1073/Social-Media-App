# PostSphere 🧑‍🤝‍🧑 | MERN Stack Social Media Application

A full-featured social media web app built using the **MERN stack (MongoDB, Express, React, Node.js)**. It allows users to create posts, follow others with request-based approval, like/comment on posts, and chat in real-time using Socket.IO. Includes user authentication (JWT), Cloudinary image upload, and custom notifications.

---

## 🌐 Live Demo

🔗 [Deployed Link](#)

---

## 🚀 Features

### 👤 User Features
- Registration & secure login (JWT Auth)
- Profile with image, username, bio, etc.
- Follow/unfollow with approval requests
- Follower & following list with modal views

### 📝 Posts
- Create, edit, delete posts with text + images
- Like & comment system (real-time update)
- See posts from followed users on dashboard

### 🔔 Notifications
- Follow request notifications
- Message notifications (count + clear on chat open or reply)

### 💬 Real-time Messaging
- 1-to-1 private chat (Socket.IO)
- Send/receive messages instantly
- Search users & start a new chat
- Notification badge on unread messages

---

## 🛠️ Tech Stack

| Frontend | Backend | Database | Real-time | Others |
|----------|---------|----------|-----------|--------|
| React.js | Express | MongoDB  | Socket.IO | Cloudinary (image upload) |
| Next.js  | Node.js | Mongoose | JWT Auth  | Axios, Bootstrap |


---

## ⚙️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/social-sphere.git
cd social-sphere

**### 2. Backend Setup**

```bash
npm install

**Create .env File**

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_KEY=your_cloud_key
CLOUDINARY_SECRET=your_cloud_secret

**Start Server**

npm run dev

**### 3. Frontend Setup**
cd ../client
npm install

** Future Improvements**
Group chat support
Online/offline status
Post sharing
Email verification











