export const CATEGORIES = [
  "Malware",
  "Ransomware",
  "Data Breach",
  "Phishing",
  "Vulnerabilities",
  "AI Security",
  "Cloud Security",
  "Network Security",
  "Cybercrime",
  "Privacy",
  "Zero-Day",
];

// Keywords that suggest each category. Checked in order, first match wins.
const CATEGORY_KEYWORDS = [
  { category: "Zero-Day", keywords: ["zero-day", "zero day", "0-day"] },
  { category: "Ransomware", keywords: ["ransomware", "ransom"] },
  { category: "Data Breach", keywords: ["data breach", "breach", "leaked data", "exposed database"] },
  { category: "Phishing", keywords: ["phishing", "phish"] },
  { category: "AI Security", keywords: ["ai model", "artificial intelligence", "llm", "chatgpt", "machine learning"] },
  { category: "Cloud Security", keywords: ["aws", "azure", "cloud security", "s3 bucket", "google cloud"] },
  { category: "Network Security", keywords: ["router", "firewall", "vpn", "network security", "ssh"] },
  { category: "Vulnerabilities", keywords: ["cve-", "vulnerability", "vulnerabilities", "exploit", "patch"] },
  { category: "Privacy", keywords: ["privacy", "gdpr", "surveillance"] },
  { category: "Cybercrime", keywords: ["arrested", "indicted", "cybercrime", "hacker group", "law enforcement"] },
  { category: "Malware", keywords: ["malware", "trojan", "backdoor", "spyware", "worm"] },
];

export function detectCategory(article) {
  const text = `${article.title} ${article.description}`.toLowerCase();

  for (const entry of CATEGORY_KEYWORDS) {
    if (entry.keywords.some((keyword) => text.includes(keyword))) {
      return entry.category;
    }
  }

  return "Cybercrime"; // sensible fallback if nothing matches
}