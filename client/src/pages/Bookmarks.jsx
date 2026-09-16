import { useState, useEffect } from "react";
import NewsCard from "../components/NewsCard";
import { getBookmarks } from "../utils/bookmarks";

function Bookmarks() {
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);

  useEffect(() => {
    setBookmarkedArticles(getBookmarks());
  }, []);

  return (
    <div className="page">
      <h2>Bookmarks</h2>
      <p>Articles you've saved for later. Stored locally in this browser.</p>

      {bookmarkedArticles.length === 0 ? (
        <p className="status-message">
          You haven't bookmarked any articles yet. Click the bookmark icon on
          any news card to save it here.
        </p>
      ) : (
        <div className="news-grid">
          {bookmarkedArticles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Bookmarks;