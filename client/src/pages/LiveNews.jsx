import { useState, useEffect, useCallback } from "react";
import { getAllNews } from "../services/newsService";
import NewsCard from "../components/NewsCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import ErrorState from "../components/ErrorState";
import { CATEGORIES, detectCategory } from "../utils/categorize";
import { getSeverity, SEVERITY_LEVELS } from "../utils/severity";

function LiveNews() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSeverity, setSelectedSeverity] = useState("All");

  const loadNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllNews();
      const tagged = data.map((article) => {
        const severity = getSeverity(article);
        return {
          ...article,
          category: detectCategory(article),
          severityLevel: severity.level,
          severityScore: severity.score,
        };
      });
      setArticles(tagged);
    } catch (err) {
      setError("Could not load news. Is the backend server running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  const filteredArticles = articles.filter((article) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      article.title.toLowerCase().includes(term) ||
      article.description.toLowerCase().includes(term);

    const matchesCategory =
      selectedCategory === "All" || article.category === selectedCategory;

    const matchesSeverity =
      selectedSeverity === "All" || article.severityLevel === selectedSeverity;

    return matchesSearch && matchesCategory && matchesSeverity;
  });

  function clearFilters() {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedSeverity("All");
  }

  const filtersActive =
    searchTerm || selectedCategory !== "All" || selectedSeverity !== "All";

  return (
    <div className="page">
      <h2>Live Cyber News</h2>
      <p>Real-time cybersecurity news from trusted sources.</p>

      <div className="search-bar-wrapper">
        <input
          type="text"
          placeholder="Search by keyword, company, malware, CVE..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
      </div>

      <p className="filter-label">Category</p>
      <div className="category-filters">
        <button
          className={selectedCategory === "All" ? "category-chip active" : "category-chip"}
          onClick={() => setSelectedCategory("All")}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={selectedCategory === cat ? "category-chip active" : "category-chip"}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className="filter-label">Severity</p>
      <div className="category-filters">
        <button
          className={selectedSeverity === "All" ? "category-chip active" : "category-chip"}
          onClick={() => setSelectedSeverity("All")}
        >
          All
        </button>
        {SEVERITY_LEVELS.map((level) => (
          <button
            key={level}
            className={selectedSeverity === level ? "category-chip active" : "category-chip"}
            onClick={() => setSelectedSeverity(level)}
          >
            {level}
          </button>
        ))}
        {filtersActive && (
          <button className="clear-filters-btn" onClick={clearFilters}>
            Clear Filters
          </button>
        )}
      </div>

      {loading && <LoadingSkeleton type="cards" count={6} />}

      {!loading && error && <ErrorState message={error} onRetry={loadNews} />}

      {!loading && !error && filteredArticles.length === 0 && (
        <p className="status-message">No articles match your filters.</p>
      )}

      {!loading && !error && filteredArticles.length > 0 && (
        <div className="news-grid">
          {filteredArticles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

export default LiveNews;