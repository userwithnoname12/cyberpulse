// Extracts meaningful keyword "topics" from articles (beyond just categories)
// so trending feels more specific than the Dashboard's category chart.

const TOPIC_KEYWORDS = [
  "Ransomware",
  "Zero-Day",
  "Data Breach",
  "Phishing",
  "AI Attacks",
  "Supply Chain",
  "Credential Theft",
  "Malware",
  "DDoS",
  "Cloud Misconfiguration",
  "Nation-State",
  "Cryptocurrency Theft",
];

const TOPIC_KEYWORD_MAP = {
  "Ransomware": ["ransomware", "ransom"],
  "Zero-Day": ["zero-day", "zero day", "0-day"],
  "Data Breach": ["data breach", "breach", "leaked data"],
  "Phishing": ["phishing", "phish"],
  "AI Attacks": ["ai model", "artificial intelligence", "llm", "chatgpt", "ai agent"],
  "Supply Chain": ["supply chain"],
  "Credential Theft": ["credential", "password theft", "stolen credentials"],
  "Malware": ["malware", "trojan", "spyware", "worm", "backdoor"],
  "DDoS": ["ddos", "denial of service"],
  "Cloud Misconfiguration": ["misconfigured", "exposed s3", "exposed database", "cloud security"],
  "Nation-State": ["nation-state", "state-sponsored", "apt group"],
  "Cryptocurrency Theft": ["bitcoin", "crypto", "cryptocurrency"],
};

export function getTrendingTopics(articles) {
  const counts = {};

  TOPIC_KEYWORDS.forEach((topic) => {
    counts[topic] = 0;
  });

  articles.forEach((article) => {
    const text = `${article.title} ${article.description}`.toLowerCase();

    TOPIC_KEYWORDS.forEach((topic) => {
      const keywords = TOPIC_KEYWORD_MAP[topic];
      if (keywords.some((k) => text.includes(k))) {
        counts[topic] += 1;
      }
    });
  });

  return Object.entries(counts)
    .map(([topic, count]) => ({ topic, count }))
    .filter((entry) => entry.count > 0)
    .sort((a, b) => b.count - a.count);
}