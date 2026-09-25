import React, { useState, useEffect, useRef } from "react";
import {
  Terminal,
  Users,
  LogOut,
  Send,
  HelpCircle,
  Trash2,
  Cpu,
  Sparkles,
} from "lucide-react";

export default function ChatRoom({
  sessionData,
  messages,
  users,
  onSendMessage,
  onTyping,
  onLeave,
}) {
  const [inputText, setInputText] = useState("");
  const [showUsersMobile, setShowUsersMobile] = useState(false);
  const [localSystemLogs, setLocalSystemLogs] = useState([]);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Web Audio Mechanical Sound Effects
  const playTerminalSound = (freq = 800, type = "sine", duration = 0.03) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.00001,
        audioCtx.currentTime + duration,
      );
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio context silenced or not allowed by browser policy
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, localSystemLogs]);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    playTerminalSound(600, "square", 0.02);
    onTyping(true);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      onTyping(false);
    }, 1500);
  };

  // Slash Command Dispatcher
  const handleCommandOrMessage = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    if (trimmed.startsWith("/")) {
      const parts = trimmed.split(" ");
      const cmd = parts[0].toLowerCase();

      playTerminalSound(1000, "triangle", 0.08);

      switch (cmd) {
        case "/help":
          setLocalSystemLogs((prev) => [
            ...prev,
            `AVAILABLE COMMANDS:
  /help       - Show this command manual
  /clear      - Clear local screen buffer
  /users      - Display connected network nodes
  /whoami     - Display active socket & room identity
  /leave      - Terminate encryption tunnel & exit`,
          ]);
          break;

        case "/clear":
          setLocalSystemLogs([]);
          break;

        case "/users":
          const userList = users
            .map((u) => `• ${u.nickname} (${u.status})`)
            .join("\n");
          setLocalSystemLogs((prev) => [
            ...prev,
            `ACTIVE NODES (${users.length}):\n${userList}`,
          ]);
          break;

        case "/whoami":
          setLocalSystemLogs((prev) => [
            ...prev,
            `IDENTITY: ${sessionData.user.nickname}\nROOM_ID: ${sessionData.roomId}\nSOCKET_ID: ${sessionData.user.socketId || "VOLATILE_NODE"}`,
          ]);
          break;

        case "/leave":
          onLeave();
          break;

        default:
          setLocalSystemLogs((prev) => [
            ...prev,
            `[ERROR]: Unknown command '${cmd}'. Type /help for available terminal instructions.`,
          ]);
          break;
      }
      return;
    }

    // Standard Chat Message
    playTerminalSound(800, "sine", 0.04);
    onSendMessage(trimmed);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    handleCommandOrMessage(inputText);
    setInputText("");
    onTyping(false);
  };

  return (
    <div className="relative z-10 w-full max-w-6xl h-[88vh] mx-auto bg-[#0c0d12]/90 border border-[#00ff66]/30 rounded-xl shadow-[0_0_50px_rgba(0,255,102,0.15)] flex flex-col overflow-hidden backdrop-blur-md">
      {/* High-Tech Terminal Top Bar */}
      <div className="bg-[#12141d] px-4 py-3 border-b border-[#00ff66]/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-600"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80 border border-yellow-600"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80 border border-green-600"></div>
          </div>
          <div className="h-4 w-[1px] bg-[#00ff66]/20 mx-1"></div>
          <div className="flex items-center gap-2 text-[#00ff66] font-mono text-xs tracking-wider">
            <Terminal size={15} className="animate-pulse" />
            <span className="font-bold">CYPHER_CHAT</span>
            <span className="text-gray-500">//</span>
            <span className="text-emerald-400 font-semibold">
              TUNNEL: {sessionData.roomId}
            </span>
          </div>
        </div>

        {/* Action Controls & Stats */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-[10px] text-gray-400 bg-[#0a0a0c] px-2.5 py-1 rounded border border-[#00ff66]/20">
            <Cpu size={12} className="text-[#00ff66]" />
            <span>RAM_ONLY: VOLATILE</span>
          </div>

          <button
            onClick={() => setShowUsersMobile(!showUsersMobile)}
            className="md:hidden text-[#00ff66] p-1.5 rounded bg-[#0a0a0c] border border-[#00ff66]/20"
          >
            <Users size={16} />
          </button>

          <button
            onClick={onLeave}
            className="flex items-center gap-1.5 bg-red-950/60 border border-red-500/50 text-red-400 hover:bg-red-900/80 text-xs px-3 py-1.5 rounded transition-all cursor-pointer shadow-[0_0_10px_rgba(239,68,68,0.2)]"
          >
            <LogOut size={13} />
            <span className="font-semibold">PURGE & EXIT</span>
          </button>
        </div>
      </div>

      {/* Main Terminal Viewport */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Feed */}
        <div className="flex-1 flex flex-col bg-[#08090c]/80 relative">
          {/* CRT Scanline Overlay Effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none z-10 opacity-40"></div>

          {/* Quick Helper Command Pills */}
          <div className="p-2 border-b border-[#00ff66]/10 bg-[#0d0e14]/50 flex items-center gap-2 overflow-x-auto text-[11px] font-mono">
            <span className="text-gray-500 text-[10px] uppercase font-bold flex items-center gap-1">
              <Sparkles size={11} className="text-[#00ff66]" /> Quick Commands:
            </span>
            {["/help", "/clear", "/users", "/whoami"].map((cmd) => (
              <button
                key={cmd}
                onClick={() => handleCommandOrMessage(cmd)}
                className="px-2 py-0.5 rounded bg-[#00ff66]/10 border border-[#00ff66]/30 text-[#00ff66] hover:bg-[#00ff66]/20 transition-colors cursor-pointer"
              >
                {cmd}
              </button>
            ))}
          </div>

          {/* Message Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs z-0">
            <div className="p-3 border border-[#00ff66]/20 rounded bg-[#00ff66]/5 text-emerald-400 text-[11px] leading-relaxed">
              [SYSTEM_BOOT]: Terminal linked to room node{" "}
              <span className="font-bold underline">{sessionData.roomId}</span>.
              Messages are non-persistent and exist solely inside memory
              buffers. Type{" "}
              <span className="text-yellow-300 font-bold">/help</span> for
              terminal slash commands.
            </div>

            {/* Render Remote System Logs */}
            {messages.map((msg, i) => {
              if (msg.system) {
                return (
                  <div
                    key={i}
                    className="text-yellow-400/90 italic flex items-center gap-2 py-1"
                  >
                    <span className="text-yellow-500 font-bold">[EVENT]:</span>{" "}
                    {msg.systemMessage}
                  </div>
                );
              }

              const isMe = msg.sender === sessionData.user.socketId;

              return (
                <div
                  key={msg.id || i}
                  className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                >
                  <div className="flex items-center gap-2 mb-1 text-[10px] text-gray-500">
                    <span className="font-bold text-[#00ff66]">
                      {isMe
                        ? `${sessionData.user.nickname} (YOU)`
                        : msg.senderNickname || "ANON_NODE"}
                    </span>
                    <span>•</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div
                    className={`p-3 rounded-lg max-w-lg break-words leading-relaxed ${
                      isMe
                        ? "bg-[#00ff66]/15 border border-[#00ff66]/40 text-[#00ff66] shadow-[0_0_15px_rgba(0,255,102,0.1)]"
                        : "bg-[#12141c] border border-gray-800 text-gray-200"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {/* Local Command Logs */}
            {localSystemLogs.map((log, idx) => (
              <div
                key={`local-${idx}`}
                className="p-3 bg-[#11131a] border border-yellow-500/30 text-yellow-300/90 rounded whitespace-pre-wrap leading-relaxed"
              >
                {log}
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>

          {/* Terminal Input Bar */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-[#10121a] border-t border-[#00ff66]/20 flex gap-2 z-0"
          >
            <div className="relative flex-1 flex items-center">
              <span className="absolute left-3 text-[#00ff66] font-bold font-mono text-sm">
                &gt;
              </span>
              <input
                type="text"
                placeholder="Type message or /command..."
                value={inputText}
                onChange={handleInputChange}
                className="w-full bg-[#08090c] border border-[#00ff66]/30 rounded pl-7 pr-3 py-2.5 text-xs text-[#00ff66] placeholder-gray-600 focus:outline-none focus:border-[#00ff66] focus:ring-1 focus:ring-[#00ff66] font-mono tracking-wide"
              />
            </div>
            <button
              type="submit"
              className="bg-[#00ff66] text-[#0a0a0c] px-4 py-2.5 rounded font-bold hover:bg-[#00cc52] transition-colors cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,255,102,0.3)]"
            >
              <Send size={15} />
              <span className="hidden sm:inline text-xs uppercase">Send</span>
            </button>
          </form>
        </div>

        {/* Active Nodes Panel (Desktop) */}
        <div className="hidden md:block w-64 bg-[#0d0e14] border-l border-[#00ff66]/20 p-4 font-mono">
          <div className="flex items-center justify-between border-b border-[#00ff66]/20 pb-3 mb-4">
            <span className="text-xs font-bold text-[#00ff66] flex items-center gap-2">
              <Users size={14} /> ACTIVE NODES
            </span>
            <span className="text-[10px] bg-[#00ff66]/20 px-2 py-0.5 rounded text-[#00ff66] font-bold">
              {users.length}
            </span>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[calc(100%-3rem)]">
            {users.map((user, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded bg-[#12141d] border border-gray-800 flex items-center justify-between text-xs"
              >
                <span className="truncate text-gray-300">
                  {user.nickname}{" "}
                  {user.nickname === sessionData.user.nickname && (
                    <span className="text-[#00ff66] text-[10px]">(You)</span>
                  )}
                </span>
                <span className="flex h-2 w-2 relative">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      user.status === "typing"
                        ? "bg-yellow-400"
                        : "bg-[#00ff66]"
                    }`}
                  ></span>
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      user.status === "typing"
                        ? "bg-yellow-500"
                        : "bg-[#00ff66]"
                    }`}
                  ></span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
