const NVD_API_URL = "https://services.nvd.nist.gov/rest/json/cves/2.0";

function getSeverityFromScore(score) {
  if (score === null || score === undefined) return "UNKNOWN";
  if (score >= 9.0) return "CRITICAL";
  if (score >= 7.0) return "HIGH";
  if (score >= 4.0) return "MEDIUM";
  return "LOW";
}

function extractScore(metrics) {
  if (!metrics) return null;

  // Try CVSS v3.1, then v3.0, then v2 as fallback
  const v31 = metrics.cvssMetricV31?.[0]?.cvssData?.baseScore;
  const v30 = metrics.cvssMetricV30?.[0]?.cvssData?.baseScore;
  const v2 = metrics.cvssMetricV2?.[0]?.cvssData?.baseScore;

  return v31 ?? v30 ?? v2 ?? null;
}

function normalizeCve(item) {
  const cve = item.cve;
  const score = extractScore(cve.metrics);

  const description =
    cve.descriptions?.find((d) => d.lang === "en")?.value ||
    "No description available.";

  const affectedProducts = [];
  cve.configurations?.forEach((config) => {
    config.nodes?.forEach((node) => {
      node.cpeMatch?.forEach((match) => {
        if (match.criteria) {
          const parts = match.criteria.split(":");
          if (parts[4]) affectedProducts.push(parts[4]);
        }
      });
    });
  });

  return {
    id: cve.id,
    description: description.slice(0, 300),
    severity: getSeverityFromScore(score),
    cvssScore: score,
    publishedDate: cve.published,
    affectedProducts: [...new Set(affectedProducts)].slice(0, 5),
    link: `https://nvd.nist.gov/vuln/detail/${cve.id}`,
  };
}

export async function fetchRecentCves() {
  // Get CVEs published in the last 14 days, most recent first
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 14);

  const params = new URLSearchParams({
    pubStartDate: startDate.toISOString().split(".")[0],
    pubEndDate: endDate.toISOString().split(".")[0],
    resultsPerPage: "30",
  });

  const response = await fetch(`${NVD_API_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`NVD API responded with status ${response.status}`);
  }

  const data = await response.json();
  const vulnerabilities = (data.vulnerabilities || []).map(normalizeCve);

  // Sort newest first
  vulnerabilities.sort(
    (a, b) => new Date(b.publishedDate) - new Date(a.publishedDate)
  );

  return vulnerabilities;
}