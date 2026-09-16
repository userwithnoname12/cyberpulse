import { useState, useEffect, useCallback } from "react";
import { getRecentCves } from "../services/cveService";
import CveCard from "../components/CveCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import ErrorState from "../components/ErrorState";
import { SEVERITY_LEVELS } from "../utils/severity";

function Vulnerabilities() {
  const [cves, setCves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeverity, setSelectedSeverity] = useState("All");

  const loadCves = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRecentCves();
      setCves(data);
    } catch (err) {
      setError(
        "Could not load vulnerability data. The NVD service may be temporarily busy."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCves();
  }, [loadCves]);

  const filteredCves = cves.filter(
    (cve) => selectedSeverity === "All" || cve.severity === selectedSeverity
  );

  return (
    <div className="page">
      <h2>Vulnerabilities</h2>
      <p>Recently published CVEs from the National Vulnerability Database (NVD).</p>

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
      </div>

      {loading && <LoadingSkeleton type="cards" count={6} />}

      {!loading && error && <ErrorState message={error} onRetry={loadCves} />}

      {!loading && !error && filteredCves.length === 0 && (
        <p className="status-message">No vulnerabilities match this filter.</p>
      )}

      {!loading && !error && filteredCves.length > 0 && (
        <div className="cve-grid">
          {filteredCves.map((cve) => (
            <CveCard key={cve.id} cve={cve} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Vulnerabilities;