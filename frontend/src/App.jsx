import { useState } from "react";
import ChatInterface from "./components/ChatInterface.jsx";
import Dashboard from "./components/Dashboard.jsx";

export default function App() {
  const [view, setView] = useState("chat");

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="4" cy="10" r="2.4" fill="currentColor" />
              <circle cx="16" cy="4" r="2.4" fill="currentColor" />
              <circle cx="16" cy="16" r="2.4" fill="currentColor" />
              <path
                d="M6.2 9.2 13.8 4.9M6.2 10.8 13.8 15.1"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="brand-name">Signal</span>
        </div>

        <nav className="tabs" role="tablist" aria-label="Views">
          <button
            role="tab"
            aria-selected={view === "chat"}
            className={`tab ${view === "chat" ? "tab-active" : ""}`}
            onClick={() => setView("chat")}
          >
            Chat
          </button>
          <button
            role="tab"
            aria-selected={view === "dashboard"}
            className={`tab ${view === "dashboard" ? "tab-active" : ""}`}
            onClick={() => setView("dashboard")}
          >
            Analytics
          </button>
        </nav>
      </header>

      <main className="app-main">
        {view === "chat" ? <ChatInterface /> : <Dashboard />}
      </main>
    </div>
  );
}
