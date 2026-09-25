import { io } from "socket.io-client";

// Fetch the URL from Vite environment variables or default to local backend
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket", "polling"], // Fallback transport support for hosted platforms
  timeout: 10000,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
