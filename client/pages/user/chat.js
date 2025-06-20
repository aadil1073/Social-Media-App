// pages/user/chat.js
import { useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "@/context";
import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import UserRoute from "@/components/routes/UserRoute";
import io from "socket.io-client";
import debounce from "lodash.debounce";

let socket;

const Chat = () => {
  const [state] = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const messagesEndRef = useRef(null);
  const socketRef = useRef();

  const defaultImage = "https://www.pngkit.com/png/detail/126-1262807_instagram-default-profile-picture-png.png";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Initialize socket connection
  useEffect(() => {
    if (state?.token) {
      socketRef.current = io("/", {
        auth: { token: state.token },
      });

      socketRef.current.on("message", (msg) => {
        if (msg.sender === selectedUser?._id || msg.receiver === selectedUser?._id) {
          setMessages((prev) => [...prev, msg]);
          scrollToBottom();
        }
      });

      return () => socketRef.current.disconnect();
    }
  }, [state?.token, selectedUser]);

  const fetchChatUsers = async () => {
    try {
      const { data } = await axios.get("/chat-users", {
        headers: {
          Authorization: `Bearer ${state?.token}`,
        },
      });
      setUsers(data);
    } catch (err) {
      console.error("Failed to load chat users", err);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/messages/${userId}`, {
        headers: {
          Authorization: `Bearer ${state?.token}`,
        },
      });
      setMessages(data);
      scrollToBottom();
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

 const handleSend = async () => {
  if (!newMsg.trim()) return;

  try {
    const { data } = await axios.post(
      "/send-message",
      {
        receiverId: selectedUser._id,
        content: newMsg,
      },
      {
        headers: {
          Authorization: `Bearer ${state?.token}`,
        },
      }
    );

    setMessages((prev) => [...prev, data]);

    // ✅ Emit via socket
    if (socketRef.current) {
      socketRef.current.emit("sendMessage", {
        to: selectedUser._id,
        message: data,
      });
    }

    setNewMsg("");
    scrollToBottom();

    // ✅ Clear message notification after replying
    await axios.put(`/clear-message-notification/${selectedUser._id}`, null, {
      headers: {
        Authorization: `Bearer ${state?.token}`,
      },
    });

  } catch (err) {
    console.error("Error sending message", err.response?.data || err.message);
    alert("Failed to send message");
  }
};



  useEffect(() => {
    if (state?.token) {
      fetchChatUsers();
    }
  }, [state?.token]);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser._id);
    }
  }, [selectedUser]);

  const searchUsers = debounce(async (q) => {
    if (!q.trim()) return setSearchResults([]);
    const { data } = await axios.get(`/find-people?q=${q}`, {
      headers: { Authorization: `Bearer ${state.token}` },
    });
    setSearchResults(data);
  }, 300);

  useEffect(() => {
    if (searchQuery) {
      searchUsers(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const startChat = (user) => {
    setSelectedUser(user);
    setSearchQuery("");
    setSearchResults([]);
    fetchMessages(user._id);
  };

  const clearMessageNotification = async (userId) => {
  try {
    await axios.put(`/clear-message-notification/${userId}`, {
      headers: {
        Authorization: `Bearer ${state.token}`,
      },
    });

    // Also update frontend state if needed
  } catch (err) {
    console.error("Error clearing notification", err);
  }
};

useEffect(() => {
  if (selectedUser) {
    fetchMessages(selectedUser._id);
    clearMessageNotification(selectedUser._id);
  }
}, [selectedUser]);


  return (
    <Layout>
      <UserRoute>
        <div className="container-fluid mt-4" style={{ height: "80vh" }}>
          <div className="row h-100">
            {/* Sidebar */}
            <div className="col-md-3 border-end overflow-auto">
              <div className="p-3 border-bottom">
                <h5 className="text-center">Messages</h5>
                <input
                  type="text"
                  className="form-control mt-2"
                  placeholder="🔍 Search user"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Search results */}
              {searchResults.length > 0 ? (
                <div>
                  {searchResults.map((user) => (
                    <div
                      key={user._id}
                      onClick={() => startChat(user)}
                      className="p-2 border-bottom"
                      style={{ cursor: "pointer" }}
                    >
                      {user.name}
                    </div>
                  ))}
                </div>
              ) : (
                users.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => setSelectedUser(user)}
                    className={`p-2 border-bottom ${
                      selectedUser?._id === user._id ? "bg-light" : ""
                    }`}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex align-items-center">
                      <img
                        src={user.image?.url || defaultImage}
                        className="rounded-circle me-2"
                        width={40}
                        height={40}
                        alt="user"
                      />
                      <div>
                        <strong>{user.username}</strong>
                        <div className="text-muted" style={{ fontSize: "12px" }}>
                          {user.name}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Chat box */}
            <div className="col-md-9 d-flex flex-column">
              {selectedUser ? (
                <>
                  <div className="p-3 border-bottom">
                    <strong>{selectedUser.name}</strong>
                  </div>
                  <div
                    className="flex-grow-1 overflow-auto px-3 py-2"
                    style={{ background: "#f9f9f9" }}
                  >
                    {messages.map((msg) => (
                      <div
                        key={msg._id}
                        className={`mb-2 d-flex ${
                          msg.sender === state?.user?._id
                            ? "justify-content-end"
                            : "justify-content-start"
                        }`}
                      >
                        <div
                          className={`px-3 py-2 rounded-pill ${
                            msg.sender === state?.user?._id
                              ? "bg-primary text-white"
                              : "bg-light text-dark"
                          }`}
                          style={{ maxWidth: "60%" }}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef}></div>
                  </div>
                  <div className="p-3 border-top d-flex">
                    <input
                      type="text"
                      className="form-control me-2"
                      placeholder="Type a message"
                      value={newMsg}
                      onChange={(e) => setNewMsg(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    />
                    <button className="btn btn-primary" onClick={handleSend}>
                      Send
                    </button>
                  </div>
                </>
              ) : (
                <div className="d-flex align-items-center justify-content-center flex-grow-1">
                  <p className="text-muted">Select or search a user to start chatting</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </UserRoute>
    </Layout>
  );
};

export default Chat;
