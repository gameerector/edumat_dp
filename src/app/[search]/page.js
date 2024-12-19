"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { database } from "../../firebase"; // Adjust the path as needed
import { ref, onValue } from "firebase/database";
import "bootstrap/dist/css/bootstrap.min.css";
import "../components/style-home.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Image from 'next/image';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [topics, setTopics] = useState([]);

  // Fetch topics based on the search query
  useEffect(() => {
    if (query) {
      const topicsRef = ref(database, "topics");
      onValue(topicsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const topicsArray = Object.keys(data)
            .map((key) => ({
              ...data[key],
              id: key,
            }))
            .filter((topic) =>
              topic.topicName.toLowerCase().includes(query.toLowerCase())
            );
          setTopics(topicsArray);
        }
      });
    }
  }, [query]);

  return (
    <div className="site">
      <Header />
      <div className="container my-3">
        <h3 className="text-capitalize mb-4">
          Search Results for &quot;{query.replace(/-/g, " ")}&quot;
        </h3>
        {topics.length > 0 ? (
          <div className="row g-4">
            {topics.map((topic) => (
              <div className="col-md-3 col-sm-6" key={topic.id}>
                <div className="card custom-card">
                  <Image
                    src={topic.topicImages?.[0]?.url || "https://via.placeholder.com/300x200"}
                    className="card-img-top custom-card-img"
                    alt={topic.topicImages?.[0]?.altText || "Topic Image"}
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      <a
                        href={`/category/${encodeURIComponent(
                          topic.category.toLowerCase().replace(/ /g, "-")
                        )}/${encodeURIComponent(
                          topic.topicName.toLowerCase().replace(/ /g, "-")
                        )}`}
                        className="text-decoration-none text-dark"
                        >
                        {topic.topicName}
                      </a>
                    </h5>
                    <p className="card-text text-truncate">{topic.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-danger">No results found for &quot;{query.replace(/-/g, " ")}&quot;</p>
        )}
      </div>
      <Footer />
    </div>
  );
}
