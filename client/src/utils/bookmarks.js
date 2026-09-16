const STORAGE_KEY = "cyberpulse_bookmarks";

export function getBookmarks() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error("Failed to read bookmarks:", err);
    return [];
  }
}

export function isBookmarked(articleId) {
  const bookmarks = getBookmarks();
  return bookmarks.some((b) => b.id === articleId);
}

export function addBookmark(article) {
  const bookmarks = getBookmarks();
  if (bookmarks.some((b) => b.id === article.id)) return; // already saved

  const updated = [...bookmarks, article];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function removeBookmark(articleId) {
  const bookmarks = getBookmarks();
  const updated = bookmarks.filter((b) => b.id !== articleId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function toggleBookmark(article) {
  if (isBookmarked(article.id)) {
    removeBookmark(article.id);
    return false; // now unbookmarked
  } else {
    addBookmark(article);
    return true; // now bookmarked
  }
}