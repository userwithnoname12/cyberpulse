import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import LiveNews from "./pages/LiveNews";
import NewsDetail from "./pages/NewsDetail";
import Trending from "./pages/Trending";
import Threats from "./pages/Threats";
import Vulnerabilities from "./pages/Vulnerabilities";
import Bookmarks from "./pages/Bookmarks";
import About from "./pages/About";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/live-news" element={<LiveNews />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/threats" element={<Threats />} />
            <Route path="/vulnerabilities" element={<Vulnerabilities />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;