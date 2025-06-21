import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import profile from "/profile.svg";

export function Messaging() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    // Initialize Socket.IO connection
    socketRef.current = io("http://localhost:3000", {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Connection events
    socketRef.current.on("connect", () => {
      console.log("Connected to chat server");
    });

    // Message handling
    socketRef.current.on("chat message", (msg) => {
      setMessages((prev) => [
        ...prev,
        {
          ...msg,
          isCurrentUser: socketRef.current.id === msg.socketId,
        },
      ]);
    });

    // Typing indicators
    socketRef.current.on("typing update", (userIds) => {
      setTypingUsers(userIds);
      setTypingUsers(userIds.map(id => `User ${id.slice(-4)}`));
    });

    // User join/leave notifications
    socketRef.current.on("user connected", (username) => {
      setMessages((prev) => [
        ...prev,
        {
          type: "notification",
          text: `${username} joined the chat`,
          timestamp: new Date(),
        },
      ]);
    });

    socketRef.current.on("user disconnected", (username) => {
      setMessages((prev) => [
        ...prev,
        {
          type: "notification",
          text: `${username} left the chat`,
          timestamp: new Date(),
        },
      ]);
    });

    // Message status updates
    socketRef.current.on("message status", ({ messageId, status }) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, status } : msg))
      );
    });

    // Clean up on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() && socketRef.current?.connected) {
      socketRef.current.emit("chat message", inputValue);
      setInputValue("");
      // Notify server we stopped typing
      socketRef.current.emit("typing", false);
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);

    // Notify server when user starts typing
    if (!typingTimeoutRef.current) {
      socketRef.current.emit("typing", true);
    }

    // Reset typing timer
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit("typing", false);
      typingTimeoutRef.current = null;
    }, 2000);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Mark messages as read when they become visible
  const handleMessageViewed = (messageId) => {
    socketRef.current.emit("message read", messageId);
  };

  return (
    <div className="hidden md:flex w-[65%] bg-gray-100 flex-col h-screen relative">
      {/* Messages container */}
      <div className="flex-1 scrollbar scrollbar-thin scrollbar-track-sky-200  scrollbar-thumb-blue-400 overflow-y-auto p-4 pb-20">
        {/* Date separator */}
        <div className="mt-10 flex justify-center items-center">
          <hr className="text-gray-300 w-full" />
          <div className="p-1 rounded-xl text-xs bg-gray-200 text-center absolute">
            <span className="p-1">{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Messages */}
        {messages.map((message, index) => {
          if (message.type === "notification") {
            return (
              <div
                key={index}
                className="text-center text-xs text-gray-500 my-2"
              >
                {message.text}
              </div>
            );
          }

          return (
            <div
              key={index}
              className={`px-5 py-5 ${
                message.isCurrentUser ? "flex flex-col place-items-end" : ""
              }`}
              onMouseEnter={() => handleMessageViewed(message.id)}
            >
              <div className="flex gap-2 place-items-baseline">
                <img
                  className="w-8 bg-amber-200 rounded-full"
                  src={profile}
                  alt="Profile"
                />
                <span className="text-xs">
                  {!message.isCurrentUser && `${message.username} • `}
                  {formatTime(message.timestamp)}
                </span>
                {
                message.status === "read" ?
                  <span className="text-xs text-blue-500">✓✓</span>
                  :
                  <span className="text-xs text-blue-500">✓</span>
                }
              </div>
              <div
                className={`p-2 rounded-lg inline-block max-w-xs ${
                  message.isCurrentUser ? "bg-blue-100" : "bg-gray-200"
                }`}
              >
                {message.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing indicator */}
      {typingUsers.length > 0 && (
        <div className="absolute bottom-30 left-0 right-0 text-center text-xs text-gray-500">
          {typingUsers.join(", ")} {typingUsers.length > 1 ? "are" : "is"}{" "}
          typing...
        </div>
      )}

      {/* Input area */}
      <div className="w-[calc(65%-1px)] fixed right-0 bottom-0 z-50 bg-gray-200 p-4 border-t border-gray-300">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <button type="button" className="text-gray-500">
            <i className="fa-solid fa-paperclip"></i>
          </button>
          <input
            className="flex-1 outline-none bg-white rounded-full px-4 py-2"
            type="text"
            placeholder="Type a message..."
            value={inputValue}
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className="text-blue-500 disabled:text-gray-400"
            disabled={!inputValue.trim()}
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  );
}
