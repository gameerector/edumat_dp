"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { database } from "../../../firebase"; // Adjust the path as needed
import { ref, onValue } from "firebase/database";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../components/style-home.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Image from 'next/image';

// Utility function to convert slugs back to readable text
const deslugify = (slug) => slug.replace(/-/g, " ");

export default function CategoryPage({ params }) {
  const { category } = params; // Get the category slug from the dynamic route
  const [topics, setTopics] = useState([]);

  // Convert the slug to its original format
  const decodedCategory = deslugify(category);

  // Fetch topics based on the category
  useEffect(() => {
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
  }, [decodedCategory]);

  return (
    <div className="site">
      <Header />
      <div className="container my-5">
        <h1 className="text-capitalize mb-4">{decodedCategory} Topics</h1>
        <div className="row g-4">
          {topics.map((topic) => (
            <div className="col-md-3 col-sm-6" key={topic.id}>
              <div className="card custom-card">
                <Image
                  src={
                    topic.topicImages[0]?.url || "https://via.placeholder.com/300x200"
                  }
                  className="card-img-top custom-card-img"
                  alt={topic.topicImages[0]?.altText || "Topic Image"}
                />
                <div className="card-body">
                  <h5 className="card-title">
                    <a
                      href={`/category/${encodeURIComponent(
                        category
                      )}/${encodeURIComponent(
                        topic.topicName.toLowerCase().replace(/ /g, "-")
                      )}`}
                      className="text-decoration-none text-dark"
                    >
                      {topic.topicName}
                    </a>
                  </h5>
                  <p className="card-text text-truncate">
                    {topic.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
