import { useState } from "react";
import { sendChatQuery } from "../api.js";
import { getCategoryStyle, getEngineStyle } from "../routeTokens.js";

export default function ChatInterface() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const trimmed = query.trim();
    if (!trimmed) {
      setError("Type a query before sending.");
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const data = await sendChatQuery(trimmed);
      setResult({ ...data, query: trimmed });
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="chat-view">
      <section className="chat-intro">
        <h1>Ask anything</h1>
        <p>Every query is classified and sent to the model best suited to answer it.</p>
      </section>

      <form className="chat-form" onSubmit={handleSubmit}>
        <textarea
          className="chat-input"
          placeholder="Ask a coding question, request something creative, or anything else…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows={3}
          disabled={isLoading}
        />
        <button className="send-btn" type="submit" disabled={isLoading}>
          {isLoading ? "Routing & Thinking…" : "Send"}
        </button>
      </form>

      {error && (
        <div className="banner banner-error" role="alert">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="loading-strip">
          <span className="pulse-dot" />
          Routing & Thinking…
        </div>
      )}

      {result && !isLoading && <RouteResult result={result} />}
    </div>
  );
}

function RouteResult({ result }) {
  const categoryStyle = getCategoryStyle(result.category);
  const engineStyle = getEngineStyle(result.engine);

  return (
    <section className="result-card">
      <div className="route-strip" aria-label="Routing path">
        <RouteNode label="Query" sublabel={truncate(result.query, 28)} color="#101820" />
        <RouteLine color={categoryStyle.color} />
        <RouteNode label="🏷️ Category" sublabel={categoryStyle.label} color={categoryStyle.color} />
        <RouteLine color={engineStyle.color} />
        <RouteNode label="🤖 Engine" sublabel={engineStyle.label} color={engineStyle.color} />
      </div>

      <div className="result-meta">
        <MetaPill icon="🏷️" label="Category" value={categoryStyle.label} color={categoryStyle.color} />
        <MetaPill icon="🤖" label="Engine used" value={engineStyle.label} color={engineStyle.color} />
        <MetaPill icon="⚡" label="Latency" value={`${result.latency} ms`} color="#101820" />
      </div>

      <div className="response-block">
        <span className="response-label">Response</span>
        <p className="response-text">{result.response}</p>
      </div>
    </section>
  );
}

function RouteNode({ label, sublabel, color }) {
  return (
    <div className="route-node">
      <span className="route-node-dot" style={{ backgroundColor: color }} />
      <div className="route-node-text">
        <span className="route-node-label">{label}</span>
        <span className="route-node-sublabel">{sublabel}</span>
      </div>
    </div>
  );
}

function RouteLine({ color }) {
  return <span className="route-line" style={{ backgroundColor: color }} />;
}

function MetaPill({ icon, label, value, color }) {
  return (
    <div className="meta-pill">
      <span className="meta-pill-icon">{icon}</span>
      <div className="meta-pill-text">
        <span className="meta-pill-label">{label}</span>
        <span className="meta-pill-value" style={{ color }}>
          {value}
        </span>
      </div>
    </div>
  );
}

function truncate(text, max) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}
