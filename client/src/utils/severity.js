// Keywords that indicate higher severity when found in an article's text.
// Each match adds points. Final score decides the severity level.

const CRITICAL_KEYWORDS = [
  "zero-day", "zero day", "0-day", "actively exploited",
  "critical vulnerability", "maximum severity", "wormable",
  "nation-state", "supply chain attack",
];

const HIGH_KEYWORDS = [
  "ransomware", "data breach", "breach", "rce", "remote code execution",
  "unauthenticated", "backdoor", "exploited", "million users",
  "credentials extracted", "leaked data",
];

const MEDIUM_KEYWORDS = [
  "phishing", "malware", "vulnerability", "patch", "trojan",
  "spyware", "exposed", "misconfigured", "credential theft",
];

function countMatches(text, keywords) {
  return keywords.reduce((count, keyword) => {
    return text.includes(keyword) ? count + 1 : count;
  }, 0);
}

// Returns { level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL", score: 0-100 }
export function getSeverity(article) {
  const text = `${article.title} ${article.description}`.toLowerCase();

  const criticalMatches = countMatches(text, CRITICAL_KEYWORDS);
  const highMatches = countMatches(text, HIGH_KEYWORDS);
  const mediumMatches = countMatches(text, MEDIUM_KEYWORDS);

  // Weighted score: critical keywords count for the most.
  let score =
    criticalMatches * 30 +
    highMatches * 15 +
    mediumMatches * 8;

  // Cap at 100
  score = Math.min(score, 100);

  let level;
  if (score >= 76) level = "CRITICAL";
  else if (score >= 51) level = "HIGH";
  else if (score >= 26) level = "MEDIUM";
  else level = "LOW";

  // Ensure at least a small baseline score so the gauge isn't 0 for everything
  if (score === 0) score = 12;

  return { level, score };
}

export const SEVERITY_LEVELS = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

export function severityBadgeClass(level) {
  switch (level) {
    case "CRITICAL":
      return "badge-critical";
    case "HIGH":
      return "badge-high";
    case "MEDIUM":
      return "badge-medium";
    default:
      return "badge-low";
  }
}