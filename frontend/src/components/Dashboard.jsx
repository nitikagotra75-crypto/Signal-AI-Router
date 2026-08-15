import { useEffect, useState } from "react";
import { fetchAnalytics } from "../api.js";
import { getEngineStyle } from "../routeTokens.js";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError("");
      try {
        const analytics = await fetchAnalytics();
        if (!cancelled) setData(analytics);
      } catch (err) {
        if (!cancelled) setError(err.message || "Could not load analytics.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="dashboard-view">
        <div className="loading-strip">
          <span className="pulse-dot" />
          Loading analytics…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-view">
        <div className="banner banner-error" role="alert">
          {error}
        </div>
      </div>
    );
  }

  const { totalQueries, averageLatency, engineUsage } = data;
  const maxCount = Math.max(1, ...engineUsage.map((e) => e.count));

  return (
    <div className="dashboard-view">
      <section className="chat-intro">
        <h1>Analytics</h1>
        <p>How your queries have been routed across models.</p>
      </section>

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-label">Total queries</span>
          <span className="stat-value">{totalQueries}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Average latency</span>
          <span className="stat-value">{averageLatency} ms</span>
        </div>
      </div>

      <div className="usage-card">
        <span className="usage-title">Model usage</span>

        {engineUsage.length === 0 && (
          <p className="empty-note">No queries have been routed yet.</p>
        )}

        <div className="usage-bars">
          {engineUsage.map((item) => {
            const style = getEngineStyle(item.engine);
            const widthPct = Math.round((item.count / maxCount) * 100);
            return (
              <div className="usage-row" key={item.engine}>
                <div className="usage-row-head">
                  <span className="usage-row-label">{style.label}</span>
                  <span className="usage-row-count">{item.count}</span>
                </div>
                <div className="usage-bar-track">
                  <div
                    className="usage-bar-fill"
                    style={{ width: `${widthPct}%`, backgroundColor: style.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
