import React from "react";
import { Users, Circle } from "lucide-react";

export default function ActiveUsers({ users, currentNickname }) {
  return (
    <div className="w-64 bg-terminal-card border-l border-terminal-border flex flex-col h-full">
      <div className="p-4 border-b border-terminal-border flex items-center gap-2 text-terminal-green font-semibold text-xs">
        <Users size={16} />
        <span>ACTIVE NODES ({users.length})</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {users.map((user, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-2 rounded bg-terminal-bg/50 border border-terminal-border/50 text-xs"
          >
            <span className="truncate font-mono">
              {user.nickname} {user.nickname === currentNickname && "(You)"}
            </span>
            <div className="flex items-center gap-1.5">
              <Circle
                size={8}
                className={
                  user.status === "typing"
                    ? "fill-yellow-400 text-yellow-400 animate-ping"
                    : "fill-terminal-green text-terminal-green"
                }
              />
              <span className="text-[10px] text-terminal-muted capitalize">
                {user.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
