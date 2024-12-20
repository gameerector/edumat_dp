"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./header.css";

export default function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <header className="custom-header">
      <div className="container header-content">
        {/* Brand Section */}
        <a href="/" className="brand">
          <img src="/edumatlogo.png" alt="Edumat Logo"  />
          <h1 className="brand-name">
            EduMat<span className="highlight">.in</span>
          </h1>
        </a>

        {/* Search Section */}
        <div className="search-container">
          <div className="search-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Search topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              className="search-btn"
              type="button"
              onClick={handleSearch}
            >
              <i className="bi bi-search"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
