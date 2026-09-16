function getGaugeColor(score) {
  if (score >= 76) return "#ef4444"; // critical - red
  if (score >= 51) return "#f97316"; // high - orange
  if (score >= 26) return "#eab308"; // medium - yellow
  return "#22c55e"; // low - green
}

function ThreatScoreGauge({ score }) {
  const radius = 70;
  const circumference = Math.PI * radius; // half circle
  const progress = (score / 100) * circumference;
  const color = getGaugeColor(score);

  return (
    <div className="gauge-wrapper">
      <svg width="180" height="100" viewBox="0 0 180 100">
        <path
          d="M 10 90 A 80 80 0 0 1 170 90"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M 10 90 A 80 80 0 0 1 170 90"
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
        />
      </svg>
      <div className="gauge-score" style={{ color }}>
        {score}
      </div>
      <p className="gauge-caption">Cyber Threat Score (0–100)</p>
      <p className="gauge-disclaimer">
        An application-generated assessment, not an official security rating.
      </p>
    </div>
  );
}

export default ThreatScoreGauge;