const API_BASE_URL = "http://localhost:5000/api";

export async function getRecentCves() {
  const response = await fetch(`${API_BASE_URL}/cve`);

  if (!response.ok) {
    throw new Error("Failed to fetch CVE data from server");
  }

  const data = await response.json();
  return data.vulnerabilities;
}