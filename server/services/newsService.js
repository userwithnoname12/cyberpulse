import Parser from "rss-parser";

const parser = new Parser();

// Trusted cybersecurity RSS feeds
const FEEDS = [
  {
    url: "https://feeds.feedburner.com/TheHackersNews",
    sourceName: "The Hacker News",
  },
  {
    url: "https://www.bleepingcomputer.com/feed/",
    sourceName: "BleepingComputer",
  },
];

// Turns one RSS item into a clean, consistent object our app can use
function normalizeItem(item, sourceName) {
  return {
    id: item.guid || item.link,
    title: item.title || "Untitled",
    description: item.contentSnippet
      ? item.contentSnippet.slice(0, 200)
      : "",
    link: item.link,
    source: sourceName,
    publishedAt: item.pubDate || item.isoDate || null,
    image: item.enclosure?.url || null,
  };
}

// Fetches and combines news from all feeds
export async function fetchAllNews() {
  const allArticles = [];

  for (const feed of FEEDS) {
    try {
      const parsedFeed = await parser.parseURL(feed.url);
      const items = parsedFeed.items.map((item) =>
        normalizeItem(item, feed.sourceName)
      );
      allArticles.push(...items);
    } catch (error) {
      console.error(`Failed to fetch feed: ${feed.sourceName}`, error.message);
    }
  }

  // Sort newest first
  allArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  return allArticles;
}