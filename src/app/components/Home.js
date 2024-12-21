"use client";

import { useEffect, useState } from "react";
import { database } from "../../firebase"; // Adjust the path as per your project structure
import { ref, onValue, get } from "firebase/database";
import "./style-home.css";

export default function Home() {
  const [topics, setTopics] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [tutors, setTutors] = useState({});

  useEffect(() => {
    const fetchTutors = async () => {
      const tutorsRef = ref(database, "tutors");
      const snapshot = await get(tutorsRef);
      setTutors(snapshot.val() || {});
    };

    const fetchTopics = () => {
      const topicsRef = ref(database, "topics");
      onValue(topicsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const topicsArray = Object.keys(data)
            .map((key) => ({
              ...data[key],
              id: key,
            }))
            .filter((topic) => topic.status === true);
          setTopics(topicsArray);

          const uniqueCategories = [
            ...new Set(
              topicsArray.map((topic) => topic.category.toLowerCase())
            ),
          ];
          setCategories(uniqueCategories);
        }
      });
    };

    fetchTutors();
    fetchTopics();
  }, []);

  const groupedTopics =
    selectedCategory === "all"
      ? categories.map((category) => ({
          category,
          topics: topics.filter(
            (topic) => topic.category.toLowerCase() === category
          ),
        }))
      : [
          {
            category: selectedCategory,
            topics: topics.filter(
              (topic) => topic.category.toLowerCase() === selectedCategory
            ),
          },
        ];

  return (
    <div className="container-main-home">
      <div className="tag-topics-ct">
        <button
          className={`btn tag-btn-c ${
            selectedCategory === "all" ? "selected" : ""
          }`}
          onClick={() => setSelectedCategory("all")}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={`btn tag-btn-c ${
              selectedCategory === category ? "selected" : ""
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {groupedTopics.map(({ category, topics }) => (
        <div key={category} className="category-row">
          <div className="category-header">
            <h3 className="category-title">{category}</h3>
            <button
              className="btn view-more"
              onClick={() =>
                (window.location.href = `/category/${encodeURIComponent(
                  category.toLowerCase().replace(/ /g, "-")
                )}`)
              }
            >
              More
            </button>
          </div>
          <div className="cards-container">
            {topics.slice(0, 4).map((topic) => (
                <a
                  href={`/category/${encodeURIComponent(
                    category
                  )}/${encodeURIComponent(
                    topic.topicName.toLowerCase().replace(/ /g, "-")
                  )}`}
                  key={topic.id}
                  className="card"
                  style={{
                    backgroundImage: `url(${
                      topic.topicImages[0]?.url || "https://via.placeholder.com/360x210"
                    })`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                <img
                  src={
                    topic.topicImages[0]?.url ||
                    "https://via.placeholder.com/360x210"
                  }
                  alt={topic.topicImages[0]?.altText || "Topic img"}
                  className="card-img"
                  
                />
                <div className="card-content">
                  <h5 className="card-title">{topic.topicName}</h5>
                  <p className="card-text">
                    {tutors[topic.tutorId]?.name || "Unknown Tutor"}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
