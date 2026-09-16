import { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { getAllNews } from "../services/newsService";
import { getTrendingTopics } from "../utils/trending";

function Trending() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadNews() {
      try {
        setLoading(true);
        const data = await getAllNews();
        setArticles(data);
        setError(null);
      } catch (err) {
        setError("Could not load trending data. Is the backend server running?");
      } finally {
        setLoading(false);
      }
    }

    loadNews();
  }, []);

  const trendingTopics = getTrendingTopics(articles);
  const topFive = trendingTopics.slice(0, 5);

  if (loading) {
    return (
      <div className="page">
        <h2>Trending Threats</h2>
        <p className="status-message">Analyzing news for trending topics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h2>Trending Threats</h2>
        <p className="status-message status-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>Trending Threats</h2>
      <p>
        Topics appearing most frequently across current cybersecurity news.
        Counts reflect the number of articles mentioning each topic — not
        official statistics.
      </p>

      {trendingTopics.length === 0 ? (
        <p className="status-message">No trending topics detected right now.</p>
      ) : (
        <>
          <div className="trending-cards-grid">
            {topFive.map((item, index) => (
              <div key={item.topic} className="trending-card">
                <div className="trending-rank">#{index + 1}</div>
                <div className="trending-icon">
                  <TrendingUp size={20} />
                </div>
                <p className="trending-topic-name">{item.topic}</p>
                <p className="trending-count">
                  {item.count} article{item.count !== 1 ? "s" : ""}
                </p>
              </div>
            ))}
          </div>

          <div className="trending-tags-row">
            {trendingTopics.map((item) => (
              <span key={item.topic} className="trending-tag">
                {item.topic} ({item.count})
              </span>
            ))}
          </div>

          <div className="card chart-card">
            <h3>Topic Frequency</h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={trendingTopics} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis type="number" stroke="#8b96a5" fontSize={12} allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="topic"
                  stroke="#8b96a5"
                  fontSize={12}
                  width={140}
                />
                <Tooltip
                  contentStyle={{
                    background: "#131a24",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "8px",
                    color: "#e6edf3",
                  }}
                />
                <Bar dataKey="count" fill="#a78bfa" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

export default Trending;