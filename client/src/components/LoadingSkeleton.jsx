function LoadingSkeleton({ type = "cards", count = 6 }) {
  if (type === "cards") {
    return (
      <div className="news-grid">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-box skeleton-image"></div>
            <div className="skeleton-box skeleton-line short"></div>
            <div className="skeleton-box skeleton-line long"></div>
            <div className="skeleton-box skeleton-line medium"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "stats") {
    return (
      <div className="stats-grid">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton-box skeleton-stat"></div>
        ))}
      </div>
    );
  }

  if (type === "list") {
    return (
      <div className="skeleton-list">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton-box skeleton-line long"></div>
        ))}
      </div>
    );
  }

  return <div className="skeleton-box skeleton-line long"></div>;
}

export default LoadingSkeleton;