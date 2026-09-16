import { getSeverity } from "./severity";
import { detectCategory } from "./categorize";

const SECTOR_KEYWORDS = [
  { sector: "Banking", keywords: ["bank", "banking", "financial institution", "payment", "fintech"] },
  { sector: "Healthcare", keywords: ["hospital", "healthcare", "patient data", "medical"] },
  { sector: "Government", keywords: ["government", "federal", "state agency", "military", "cisa"] },
  { sector: "Education", keywords: ["university", "school", "student data", "education"] },
  { sector: "Technology", keywords: ["software", "cloud", "saas", "tech company", "developers", "api"] },
  { sector: "E-Commerce", keywords: ["magento", "shopify", "online store", "e-commerce", "retail"] },
];

const ATTACK_TYPE_KEYWORDS = [
  { type: "Ransomware", keywords: ["ransomware", "ransom"] },
  { type: "Phishing", keywords: ["phishing", "phish"] },
  { type: "Zero-Day Exploit", keywords: ["zero-day", "zero day", "0-day"] },
  { type: "Data Breach", keywords: ["data breach", "breach", "leaked", "exposed database"] },
  { type: "DDoS", keywords: ["ddos", "denial of service"] },
  { type: "Malware", keywords: ["malware", "trojan", "spyware", "worm", "backdoor"] },
  { type: "Social Engineering", keywords: ["social engineering", "impersonation", "pretexting"] },
];

function detectSector(text) {
  for (const entry of SECTOR_KEYWORDS) {
    if (entry.keywords.some((k) => text.includes(k))) return entry.sector;
  }
  return "General / Cross-Industry";
}

function detectAttackType(text) {
  for (const entry of ATTACK_TYPE_KEYWORDS) {
    if (entry.keywords.some((k) => text.includes(k))) return entry.type;
  }
  return "Unspecified / Emerging Threat";
}

function buildSummary(article) {
  return `This article from ${article.source}, published ${
    article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : "recently"
  }, discusses: "${article.title}". ${article.description}`;
}

function buildImpact(level, attackType) {
  const impacts = {
    CRITICAL: `If this ${attackType.toLowerCase()} threat spreads unchecked, it could lead to widespread system compromise, significant data loss, financial damage, and reputational harm to affected organizations. Immediate action is strongly advised.`,
    HIGH: `This ${attackType.toLowerCase()} activity poses a serious risk. Affected systems or users could face data exposure, unauthorized access, or operational disruption if not addressed promptly.`,
    MEDIUM: `While not immediately catastrophic, this ${attackType.toLowerCase()} issue could escalate if left unpatched or ignored, potentially affecting a subset of users or systems.`,
    LOW: `The immediate risk from this ${attackType.toLowerCase()} report appears limited, but it's still worth monitoring as part of general security awareness.`,
  };
  return impacts[level] || impacts.MEDIUM;
}

function buildRecommendations(level, attackType) {
  const base = [
    "Keep all software, plugins, and operating systems fully updated.",
    "Use strong, unique passwords and enable multi-factor authentication (MFA).",
    "Monitor official vendor advisories for patches related to this issue.",
  ];

  const specific = {
    Ransomware: ["Maintain regular, offline backups of critical data.", "Avoid opening unexpected email attachments or links."],
    Phishing: ["Verify sender identities before clicking links or downloading attachments.", "Enable email filtering and phishing-awareness training."],
    "Zero-Day Exploit": ["Apply vendor patches immediately once released.", "Restrict exposure of vulnerable services to the internet where possible."],
    "Data Breach": ["Change passwords for any potentially affected accounts.", "Monitor for signs of identity theft or unauthorized account activity."],
    DDoS: ["Use rate-limiting and DDoS protection services for public-facing infrastructure.", "Have an incident response plan ready for service disruptions."],
    Malware: ["Run updated antivirus/endpoint protection scans.", "Avoid downloading software from untrusted sources."],
    "Social Engineering": ["Train staff to verify unusual requests through a second channel.", "Limit sensitive information shared publicly (e.g. on social media)."],
  };

  const list = [...base, ...(specific[attackType] || [])];

  if (level === "CRITICAL" || level === "HIGH") {
    list.unshift("Treat this as high priority — review affected systems as soon as possible.");
  }

  return list;
}

function buildBeginnerExplanation(attackType, sector) {
  return `In simple terms: this is a type of cyber attack called "${attackType}". Think of it like someone finding a hidden way to get into a system without permission — similar to finding an unlocked back door to a house. It's relevant to the "${sector}" sector, meaning organizations or people in that area should pay closer attention. You don't need to be a security expert to stay safe — just keep your software updated, be cautious of suspicious links or emails, and use strong passwords.`;
}

// Main function: takes one article and returns a full analysis
export function analyzeArticle(article) {
  const text = `${article.title} ${article.description}`.toLowerCase();

  const severity = getSeverity(article);
  const category = article.category || detectCategory(article);
  const attackType = detectAttackType(text);
  const sector = detectSector(text);

  return {
    summary: buildSummary(article),
    threatLevel: severity.level,
    threatScore: severity.score,
    attackType,
    affectedSector: sector,
    category,
    potentialImpact: buildImpact(severity.level, attackType),
    recommendedActions: buildRecommendations(severity.level, attackType),
    beginnerExplanation: buildBeginnerExplanation(attackType, sector),
  };
}