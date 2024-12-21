"use client";

import { Metadata, ResolvingMetadata } from 'next';
import { useEffect, useState } from "react";
import { database } from "../../../../firebase"; // Adjust the path as needed
import { ref, onValue } from "firebase/database";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../components/style-home.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import "../../../style/topic-page.css";

export default function TopicPage({ params }) {
    const { category, topic: topicSlug } = params; // Extract category and topic slug
    const [topicData, setTopicData] = useState(null);
    const [tutorData, setTutorData] = useState(null); // State for tutor data

    useEffect(() => {
        const topicsRef = ref(database, "topics");
    
        onValue(topicsRef, (snapshot) => {
            const data = snapshot.val();
    
            if (data) {
                // Decode the topicSlug here
                const decodedTopicSlug = decodeURIComponent(topicSlug);
    
                // Match topic by slug
                const topic = Object.values(data).find((t) =>
                    t.topicName
                        .toLowerCase()
                        .replace(/ /g, "-")
                        .includes(decodedTopicSlug) // Use the decoded topicSlug
                );
    
                if (topic) {
                    setTopicData(topic);
    
                    // Fetch tutor data based on tutorId
                    if (topic.tutorId) {
                        const tutorRef = ref(database, `tutors/${topic.tutorId}`);
                        onValue(tutorRef, (tutorSnapshot) => {
                            setTutorData(tutorSnapshot.val());
                        });
                    }
                }
            }
        });
    }, [topicSlug]);
    

        // Speak the altText of the active slide
        const speakAltText = () => {
            const activeSlide = document.querySelector(
                `.carousel-inner .carousel-item.active img`
            );
            const altText = activeSlide?.alt || "No description available.";
            const utterance = new SpeechSynthesisUtterance(altText);
            window.speechSynthesis.speak(utterance);
        };

    if (!topicData) {
        return <div className="container my-5">Loading...</div>;
    }

    const { topicName, description, mainContent, topicImages } = topicData;

    return (
        <div>
            <Header />
            <div className="main-container">
                <div className="container my-5">
                    <div className="content-header mb-4">
                            <h1 className="content-title">{topicName}</h1>
                            <p className="content-meta text-muted small">
                                {new Date(topicData.uploadDate).toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                })} 
                                &nbsp;&bull;&nbsp; 
                                {decodeURIComponent(category)}
                            </p>
                        </div>
                        <div className="tutor-section">
                        {tutorData ? (
                            <div className="card  border-0">
                                    <div className="col-md-1">
                                        <img
                                            src={tutorData.profileImageUrl || "https://via.placeholder.com/150"}
                                            alt={tutorData.name || "Tutor Image"}
                                            className="img-fluid rounded-start"
                                        />
                                    </div>
                                    <div className="col-md-11 tutor-details-s">
                                        <div className="card-body">
                                            <h5 className="card-title text-primary">{tutorData.name}</h5>
                                            <p className="card-text text-muted">
                                                {tutorData.bio || "No biography available for this tutor."}
                                            </p>
                                            {/* <button className="tutor-follow-btn">follow</button> */}
                                        </div>
                                    </div>
                            </div>
                        ) : (
                            <p className="text-muted"></p>
                        )}
                        </div>
                        <p className="lead">{description}</p>
                        <div className="mb-5">
                            <p>{mainContent}</p>
                        </div>
                    {/* Bootstrap Carousel */}
                    <div
                        id={`carousel-${topicSlug}`}
                        className="carousel slide"
                        data-bs-ride="false"  // Stops auto sliding
                        data-bs-wrap="false"  // Disables looping
                    >
                        <div className="slides-info">
                            <div>
                                <span>{topicName}</span>
                                &nbsp;&bull;&nbsp; 
                                <span>{topicImages.length} pages</span>
                            </div>

                            <button className="spk-audio-btn" onClick={speakAltText}><i class="fi fi-sr-volume"></i></button>
                        </div>
                        <div className="carousel-inner">
                            {topicImages.map((image, index) => (
                                <div
                                    className={`carousel-item ${index === 0 ? "active" : ""}`}
                                    key={index}
                                >
                                    <img
                                        src={image.url || "https://via.placeholder.com/800x400"}
                                        className="d-block w-100"
                                        alt={image.altText || `Slide ${index + 1}`}
                                        loading='lazy'
                                    />
                                </div>
                            ))}
                            {/* Previous Button */}
                        <button
                            className="carousel-control-prev"
                            type="button"
                            data-bs-target={`#carousel-${topicSlug}`}
                            data-bs-slide="prev"
                        >
                            <span
                                className="carousel-control-prev-icon"
                                aria-hidden="true"
                            ></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        {/* Next Button */}
                        <button
                            className="carousel-control-next"
                            type="button"
                            data-bs-target={`#carousel-${topicSlug}`}
                            data-bs-slide="next"
                        >
                            <span
                                className="carousel-control-next-icon"
                                aria-hidden="true"
                            ></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                        </div>
                        
                        {/* Carousel Thumbnails */}
                        <div className="carousel-indicators-wrapper">
                            <div
                                className="carousel-indicators d-flex justify-content-start align-items-center"
                                style={{
                                    overflowX: "auto",
                                    whiteSpace: "nowrap",
                                    padding: "10px 0",
                                }}
                            >
                                {topicImages.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image.url || "https://via.placeholder.com/100x60"}
                                        alt={image.altText || `Preview of Slide ${index + 1}`}
                                        className={`img-thumbnail indicator-thumbnail ${index === 0 ? "active" : ""}`}
                                        data-bs-target={`#carousel-${topicSlug}`}
                                        data-bs-slide-to={index}
                                        aria-current={index === 0 ? "true" : "false"}
                                        style={{
                                            width: "60px",
                                            height: "40px",
                                            objectFit: "cover",
                                            cursor: "pointer",
                                            margin: "0 5px",
                                            border: index === 0 ? "2px solid #007bff" : "1px solid #ccc",
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
