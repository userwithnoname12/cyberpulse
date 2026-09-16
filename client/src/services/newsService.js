const API_BASE_URL = "http://localhost:5000/api";

export async function getAllNews() {
  const response = await fetch(`${API_BASE_URL}/news`);

  if (!response.ok) {
    throw new Error("Failed to fetch news from server");
  }

  const data = await response.json();
  return data.articles;
}