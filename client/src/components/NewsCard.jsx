import { useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { severityBadgeClass } from "../utils/severity";
import { isBookmarked, toggleBookmark } from "../utils/bookmarks";

function formatDate(dateString) {
  if (!dateString) return "Unknown date";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function NewsCard({ article }) {
  const [saved, setSaved] = useState(isBookmarked(article.id));

  function handleBookmarkClick() {
    const nowSaved = toggleBookmark(article);
    setSaved(nowSaved);
  }

  return (
    <div className="news-card">
      <div className="news-card-image-wrapper">
        {article.image ? (
          <img src={article.image} alt={article.title} className="news-card-image" />
        ) : (
          <div className="news-card-image news-card-image-placeholder">
            <span>No Image</span>
          </div>
        )}

        <button
          className={saved ? "bookmark-btn active" : "bookmark-btn"}
          onClick={handleBookmarkClick}
          title={saved ? "Remove bookmark" : "Add bookmark"}
        >
          {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </button>
      </div>

      <div className="news-card-body">
        <div className="news-card-meta">
          <span className="news-card-source">{article.source}</span>
          <span className="news-card-date">{formatDate(article.publishedAt)}</span>
        </div>

        <div className="news-card-tags">
          {article.category && (
            <span className="category-tag">{article.category}</span>
          )}
          {article.severityLevel && (
            <span className={`badge ${severityBadgeClass(article.severityLevel)}`}>
              {article.severityLevel}
            </span>
          )}
        </div>

        <h3 className="news-card-title">{article.title}</h3>
        <p className="news-card-description">{article.description}</p>

        <Link to={`/news/${encodeURIComponent(article.id)}`} className="news-card-link">
          Read More →
        </Link>
      </div>
    </div>
  );
}

export default NewsCard;