// A focused list of countries that commonly appear in cybersecurity news.
// This is intentionally not exhaustive — it only flags countries we can
// detect with reasonable confidence from plain text mentions.

const COUNTRIES = [
  "United States", "US", "USA",
  "United Kingdom", "UK",
  "China", "Russia", "India", "Ukraine",
  "Iran", "North Korea", "Israel",
  "Germany", "France", "Japan",
  "Australia", "Canada", "Brazil",
  "South Korea", "Netherlands", "Singapore",
];

// Maps aliases to one canonical display name
const CANONICAL_NAME = {
  "US": "United States",
  "USA": "United States",
  "UK": "United Kingdom",
};

function canonicalize(name) {
  return CANONICAL_NAME[name] || name;
}

export function detectCountries(articles) {
  const counts = {};

  articles.forEach((article) => {
    const text = `${article.title} ${article.description}`;

    COUNTRIES.forEach((country) => {
      // Word-boundary match so "US" doesn't match inside "business", etc.
      const pattern = new RegExp(`\\b${country}\\b`, "i");
      if (pattern.test(text)) {
        const canonical = canonicalize(country);
        counts[canonical] = (counts[canonical] || 0) + 1;
      }
    });
  });

  return Object.entries(counts)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count);
}