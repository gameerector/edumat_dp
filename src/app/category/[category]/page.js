"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { database } from "../../../firebase"; // Adjust the path as needed
import { ref, onValue, get } from "firebase/database";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../components/style-home.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

// Utility function to convert slugs back to readable text
const deslugify = (slug) => slug.replace(/-/g, " ");

export default function CategoryPage({ params }) {
  const { category } = params; // Get the category slug from the dynamic route
  const [topics, setTopics] = useState([]);
  const [tutors, setTutors] = useState({});
  
  // Convert the slug to its original format
  const decodedCategory = deslugify(category);

  // Fetch topics and tutors based on the category
  useEffect(() => {
    const fetchTutors = async () => {
      const tutorsRef = ref(database, "tutors");
      const snapshot = await get(tutorsRef);
      setTutors(snapshot.val() || {});
    };

    const topicsRef = ref(database, "topics");
    onValue(topicsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const topicsArray = Object.keys(data)
          .map((key) => ({
            ...data[key],
            id: key,
          }))
          .filter(
            (topic) =>
              topic.category.toLowerCase() === decodedCategory.toLowerCase()
          );
        setTopics(topicsArray);
      }
    });

    fetchTutors();
  }, [decodedCategory]);

  return (
    <div className="site">
      <Header />
      <div className="container my-5">
        <h1 className="text-capitalize mb-4">{decodedCategory} Topics</h1>
        <div className="cards-container">
          {topics.map((topic) => {
            const tutorName = tutors[topic.tutorId]?.name || "Unknown Tutor";
            return (
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
                    topic.topicImages[0]?.url ||
                    "https://via.placeholder.com/360x210"
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
                  <p className="card-text">{tutorName}</p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}
