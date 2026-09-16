import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getAllNews } from "../services/newsService";
import { detectCategory } from "../utils/categorize";
import { getSeverity, severityBadgeClass } from "../utils/severity";
import { analyzeArticle } from "../utils/threatAnalyzer";
import ThreatScoreGauge from "../components/ThreatScoreGauge";

function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadArticle() {
      try {
        setLoading(true);
        const data = await getAllNews();
        const found = data.find((a) => a.id === id);

        if (!found) {
          setError("Article not found. It may have been removed from the feed.");
          return;
        }

        const severity = getSeverity(found);
        setArticle({
          ...found,
          category: detectCategory(found),
          severityLevel: severity.level,
          severityScore: severity.score,
        });
        setError(null);
      } catch (err) {
        setError("Could not load article. Is the backend server running?");
      } finally {
        setLoading(false);
      }
    }

    loadArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="page">
        <p className="status-message">Loading article...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="page">
        <button className="back-btn" onClick={() => navigate("/live-news")}>
          <ArrowLeft size={16} /> Back to News
        </button>
        <p className="status-message status-error">{error}</p>
      </div>
    );
  }

  const analysis = analyzeArticle(article);

  return (
    <div className="page">
      <button className="back-btn" onClick={() => navigate("/live-news")}>
        <ArrowLeft size={16} /> Back to News
      </button>

      <div className="detail-header">
        <div className="news-card-tags">
          <span className="category-tag">{article.category}</span>
          <span className={`badge ${severityBadgeClass(article.severityLevel)}`}>
            {article.severityLevel}
          </span>
        </div>
        <h2>{article.title}</h2>
        <div className="news-card-meta">
          <span className="news-card-source">{article.source}</span>
          <span className="news-card-date">
            {article.publishedAt
              ? new Date(article.publishedAt).toLocaleDateString()
              : "Unknown date"}
          </span>
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-main">
          <div className="card">
            <h3>Original Article</h3>
            <p className="detail-description">{article.description}</p>
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="news-card-link"
            >
              Read Original Article →
            </a>
          </div>

          <div className="card ai-analyzer-card">
            <div className="ai-analyzer-header">
              <h3>AI Cyber Threat Analyzer</h3>
              <span className="ai-badge">AI-Generated Analysis</span>
            </div>

            <div className="analysis-section">
              <p className="analysis-label">Threat Summary</p>
              <p className="analysis-text">{analysis.summary}</p>
            </div>

            <div className="analysis-row">
              <div className="analysis-section">
                <p className="analysis-label">Attack Type</p>
                <p className="analysis-text">{analysis.attackType}</p>
              </div>
              <div className="analysis-section">
                <p className="analysis-label">Affected Sector</p>
                <p className="analysis-text">{analysis.affectedSector}</p>
              </div>
            </div>

            <div className="analysis-section">
              <p className="analysis-label">Potential Impact</p>
              <p className="analysis-text">{analysis.potentialImpact}</p>
            </div>

            <div className="analysis-section">
              <p className="analysis-label">Recommended Actions</p>
              <ul className="recommendations-list">
                {analysis.recommendedActions.map((action, i) => (
                  <li key={i}>{action}</li>
                ))}
              </ul>
            </div>

            <div className="analysis-section beginner-box">
              <p className="analysis-label">Beginner Explanation</p>
              <p className="analysis-text">{analysis.beginnerExplanation}</p>
            </div>
          </div>
        </div>

        <div className="detail-sidebar">
          <div className="card gauge-card">
            <ThreatScoreGauge score={analysis.threatScore} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewsDetail;