import React, { useState, useEffect } from "react";
import { socket } from "./socket";
import MatrixBackground from "./components/MatrixBackground";
import JoinRoom from "./components/JoinRoom";
import ChatRoom from "./components/ChatRoom";

export default function App() {
  const [sessionData, setSessionData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Socket Event Listeners
    socket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("user_joined", ({ user, users, systemMessage }) => {
      setUsers(users);
      setMessages((prev) => [...prev, { system: true, systemMessage }]);
    });

    socket.on("user_left", ({ nickname, users, systemMessage }) => {
      setUsers(users);
      setMessages((prev) => [...prev, { system: true, systemMessage }]);
    });

    socket.on("user_status_changed", ({ users }) => {
      setUsers(users);
    });

    return () => {
      socket.off("receive_message");
      socket.off("user_joined");
      socket.off("user_left");
      socket.off("user_status_changed");
    };
  }, []);

  const handleCreateRoom = ({ nickname, roomId, password }) => {
    setError(null);
    socket.connect();

    socket.emit("create_room", { nickname, roomId, password }, (res) => {
      if (res.success) {
        setSessionData({ roomId: res.data.roomId, user: res.data.user });
        setUsers(res.data.users);
        setMessages(res.data.messages || []);
      } else {
        setError(res.error);
        socket.disconnect();
      }
    });
  };

  const handleJoinRoom = ({ nickname, roomId, password }) => {
    setError(null);
    socket.connect();

    socket.emit("join_room", { nickname, roomId, password }, (res) => {
      if (res.success) {
        setSessionData({ roomId: res.data.roomId, user: res.data.user });
        setUsers(res.data.users);
        setMessages(res.data.messages || []);
      } else {
        setError(res.error);
        socket.disconnect();
      }
    });
  };

  const handleSendMessage = (text) => {
    if (!sessionData) return;
    socket.emit("send_message", { roomId: sessionData.roomId, text }, (res) => {
      if (!res.success) {
        console.error("Failed to send:", res.error);
      }
    });
  };

  const handleTypingStatus = (isTyping) => {
    if (!sessionData) return;
    socket.emit("typing_status", { roomId: sessionData.roomId, isTyping });
  };

  const handleLeaveRoom = () => {
    if (sessionData) {
      socket.emit("leave_room");
    }
    socket.disconnect();
    setSessionData(null);
    setMessages([]);
    setUsers([]);
  };

  return (
    <main className="relative min-h-screen w-full bg-terminal-bg flex items-center justify-center p-4">
      <MatrixBackground />

      {!sessionData ? (
        <JoinRoom
          onJoin={handleJoinRoom}
          onCreate={handleCreateRoom}
          error={error}
        />
      ) : (
        <ChatRoom
          sessionData={sessionData}
          messages={messages}
          users={users}
          onSendMessage={handleSendMessage}
          onTyping={handleTypingStatus}
          onLeave={handleLeaveRoom}
        />
      )}
    </main>
  );
}
