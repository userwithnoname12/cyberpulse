import { severityBadgeClass } from "../utils/severity";

function formatDate(dateString) {
  if (!dateString) return "Unknown date";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function CveCard({ cve }) {
  return (
    <div className="card cve-card">
      <div className="cve-card-header">
        <span className="cve-id">{cve.id}</span>
        <span className={`badge ${severityBadgeClass(cve.severity)}`}>
          {cve.severity}
        </span>
      </div>

      <p className="cve-description">{cve.description}</p>

      <div className="cve-meta-grid">
        <div>
          <p className="analysis-label">CVSS Score</p>
          <p className="analysis-text">
            {cve.cvssScore !== null ? cve.cvssScore.toFixed(1) : "N/A"}
          </p>
        </div>
        <div>
          <p className="analysis-label">Published</p>
          <p className="analysis-text">{formatDate(cve.publishedDate)}</p>
        </div>
      </div>

      {cve.affectedProducts.length > 0 && (
        <div className="cve-products">
          <p className="analysis-label">Affected Products</p>
          <div className="cve-product-tags">
            {cve.affectedProducts.map((product, i) => (
              <span key={i} className="cve-product-tag">
                {product}
              </span>
            ))}
          </div>
        </div>
      )}

      <a
        href={cve.link}
        target="_blank"
        rel="noopener noreferrer"
        className="news-card-link"
      >
        View on NVD →
      </a>
    </div>
  );
}

export default CveCard;