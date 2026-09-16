import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Newspaper,
  TrendingUp,
  ShieldAlert,
  Bug,
  Bookmark,
  Info,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Live News", path: "/live-news", icon: Newspaper },
  { name: "Trending", path: "/trending", icon: TrendingUp },
  { name: "Threats", path: "/threats", icon: ShieldAlert },
  { name: "Vulnerabilities", path: "/vulnerabilities", icon: Bug },
  { name: "Bookmarks", path: "/bookmarks", icon: Bookmark },
  { name: "About", path: "/about", icon: Info },
];

function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  function closeSidebar() {
    setIsOpen(false);
  }

  return (
    <>
      <button className="mobile-menu-btn" onClick={() => setIsOpen(true)}>
        <Menu size={22} />
      </button>

      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      <aside className={isOpen ? "sidebar sidebar-open" : "sidebar"}>
        <div className="sidebar-top">
          <div className="sidebar-logo">
            <h1>CyberPulse</h1>
            <p>Cyber Threat Intelligence</p>
          </div>
          <button className="sidebar-close-btn" onClick={closeSidebar}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={isActive ? "nav-link active" : "nav-link"}
                onClick={closeSidebar}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <p>CyberPulse v1.0</p>
          <p>College Mini-Project</p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;