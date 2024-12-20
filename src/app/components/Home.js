"use client";

import { useEffect, useState } from "react";
import { database } from "../../firebase"; // Adjust the path as per your project structure
import { ref, onValue } from "firebase/database";
import "./style-home.css";

export default function Home() {
  const [topics, setTopics] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Fetch data from Firebase
  useEffect(() => {
    const topicsRef = ref(database, "topics");
    onValue(topicsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Transform the data to an array
        const topicsArray = Object.keys(data).map((key) => ({
          ...data[key],
          id: key,
        }))
        .filter((topic) => topic.status === true); 
        setTopics(topicsArray);

        // Extract unique categories
        const uniqueCategories = [
          ...new Set(topicsArray.map((topic) => topic.category.toLowerCase())),
        ];
        setCategories(uniqueCategories);
      }
    });
  }, []);

  // Group topics by category
  const groupedTopics = selectedCategory === "all" 
    ? categories.map((category) => ({
        category,
        topics: topics.filter((topic) => topic.category.toLowerCase() === category),
      }))
    : [
        {
          category: selectedCategory,
          topics: topics.filter((topic) => topic.category.toLowerCase() === selectedCategory),
        },
      ];

  return (
    <div className="container">
      {/* Filter Buttons */}
      <div className="tag-topics-ct">
        <button
          className={`btn me-2 mb-2 tag-btn-c ${selectedCategory === "all" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setSelectedCategory("all")}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={`btn me-2 mb-2 tag-btn-c ${selectedCategory === category ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Display grouped topics */}
      {groupedTopics.map(({ category, topics }) => (
        <div key={category} className="category-row mb-5">
          {/* Row Header */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="category-title text-capitalize">{category}</h3>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() =>
                window.location.href = `/category/${encodeURIComponent(
                  category.toLowerCase().replace(/ /g, "-")
                )}`
              }
            >
              More
            </button>

          </div>

          {/* Cards for Category */}
          <div className="row g-4">
            {topics.slice(0, 4).map((topic) => ( // Limit to 4 cards per row
              <div className="col-md-3 col-sm-6" key={topic.id}>
                <div className="card custom-card">
                  <img
                    src={topic.topicImages[0]?.url || "https://via.placeholder.com/300x200"}
                    className="card-img-top custom-card-img"
                    alt={topic.topicImages[0]?.altText || "Topic img"}
                  />
                  <div className="card-body">
                  <h5 className="card-title">
                  <a href={`/category/${encodeURIComponent(category)}/${encodeURIComponent(
                        topic.topicName.toLowerCase().replace(/ /g, "-")
                      )}`}
                      className="text-decoration-none text-dark">
                        {topic.topicName}
                      </a>
                    </h5>

                    <p className="card-text text-truncate">{topic.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
