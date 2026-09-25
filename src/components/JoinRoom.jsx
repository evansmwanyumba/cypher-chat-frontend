import React, { useState } from "react";
import {
  Shield,
  Key,
  User,
  ArrowRight,
  Lock,
  PlusCircle,
  LogIn,
} from "lucide-react";

export default function JoinRoom({ onJoin, onCreate, error }) {
  const [mode, setMode] = useState("join"); // 'join' or 'create'
  const [nickname, setNickname] = useState("");
  const [roomId, setRoomId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nickname || !roomId || !password) return;

    if (mode === "create") {
      onCreate({ nickname, roomId, password });
    } else {
      onJoin({ nickname, roomId, password });
    }
  };

  return (
    <div className="relative z-10 w-full max-w-md mx-auto p-6">
      <div className="bg-terminal-card border border-terminal-border rounded-xl shadow-2xl p-8 backdrop-blur-md">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 bg-terminal-bg rounded-full border border-terminal-green/30 text-terminal-green mb-3">
            <Shield size={32} />
          </div>
          <h1 className="text-2xl font-bold tracking-wider text-terminal-green">
            CYPHER_CHAT
          </h1>
          <p className="text-xs text-terminal-muted mt-1 text-center">
            Volatile RAM Memory • End-to-End Ephemeral Architecture
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-terminal-border mb-6">
          <button
            onClick={() => setMode("join")}
            className={`flex-1 pb-2 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${
              mode === "join"
                ? "border-terminal-green text-terminal-green"
                : "border-transparent text-terminal-muted hover:text-gray-300"
            }`}
          >
            <LogIn size={16} /> Join Tunnel
          </button>
          <button
            onClick={() => setMode("create")}
            className={`flex-1 pb-2 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${
              mode === "create"
                ? "border-terminal-green text-terminal-green"
                : "border-transparent text-terminal-muted hover:text-gray-300"
            }`}
          >
            <PlusCircle size={16} /> Create Room
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/50 border border-red-500/50 rounded text-red-400 text-xs">
            [ERROR]: {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase text-terminal-muted mb-1 flex items-center gap-1">
              <User size={12} /> Handle / Nickname
            </label>
            <input
              type="text"
              required
              placeholder="e.g. cyber_ghost"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-terminal-green focus:outline-none focus:border-terminal-green text-sm"
            />
          </div>

          <div>
            <label className="block text-xs uppercase text-terminal-muted mb-1 flex items-center gap-1">
              <Key size={12} /> Room Code
            </label>
            <input
              type="text"
              required
              placeholder="e.g. room-7781"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-terminal-green focus:outline-none focus:border-terminal-green text-sm"
            />
          </div>

          <div>
            <label className="block text-xs uppercase text-terminal-muted mb-1 flex items-center gap-1">
              <Lock size={12} /> Secret Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-terminal-green focus:outline-none focus:border-terminal-green text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-terminal-green text-terminal-bg font-bold py-2.5 rounded flex items-center justify-center gap-2 hover:bg-terminal-dimGreen transition-colors cursor-pointer"
          >
            {mode === "create"
              ? "Initialize Encrypted Tunnel"
              : "Authenticate & Join"}
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-6 text-[10px] text-terminal-muted text-center leading-relaxed">
          Zero data stored to disk. Messages and active rooms are permanently
          destroyed from RAM when all participants exit.
        </div>
      </div>
    </div>
  );
}
