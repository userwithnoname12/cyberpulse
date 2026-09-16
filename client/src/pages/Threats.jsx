import { useState, useEffect } from "react";
import { Globe2 } from "lucide-react";
import { getAllNews } from "../services/newsService";
import { detectCountries } from "../utils/countryDetector";

function Threats() {
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
        setError("Could not load threat map data. Is the backend server running?");
      } finally {
        setLoading(false);
      }
    }

    loadNews();
  }, []);

  const countryData = detectCountries(articles);
  const maxCount = countryData.length > 0 ? countryData[0].count : 1;

  if (loading) {
    return (
      <div className="page">
        <h2>Threat Map</h2>
        <p className="status-message">Analyzing news for country mentions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h2>Threat Map</h2>
        <p className="status-message status-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>Threat Map</h2>
      <p>
        Countries mentioned in current cybersecurity news, based on real text
        matches in article titles and descriptions. This reflects media
        coverage, not verified incident locations or an official threat feed.
      </p>

      {countryData.length === 0 ? (
        <p className="status-message">No country mentions detected in current news.</p>
      ) : (
        <div className="country-list">
          {countryData.map((item) => (
            <div key={item.country} className="country-row">
              <div className="country-row-header">
                <span className="country-name">
                  <Globe2 size={16} /> {item.country}
                </span>
                <span className="country-count">
                  {item.count} mention{item.count !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="country-bar-track">
                <div
                  className="country-bar-fill"
                  style={{ width: `${(item.count / maxCount) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Threats;