// src/app/category/[category]/[topic]/page.js
import { ref, get } from "firebase/database";
import { database } from "../../../../firebase"; // Adjust the path as needed
import TopicPageClient from './TopicPageClient';

// Implement dynamic metadata using generateMetadata
export async function generateMetadata({ params }) {
    const { topic: topicSlug } = params;

    // Fetch the topic data from Firebase
    const topicsRef = ref(database, "topics");
    const snapshot = await get(topicsRef);
    const data = snapshot.val();

    if (data) {
        // Find the topic by slug
        const topic = Object.values(data).find((t) =>
            t.topicName.toLowerCase().replace(/ /g, "-").includes(topicSlug)
        );

        if (topic) {
            // Fetch the tutor data based on tutorId
            let tutorName = "Unknown Tutor"; // Default value
            if (topic.tutorId) {
                const tutorRef = ref(database, `tutors/${topic.tutorId}`);
                const tutorSnapshot = await get(tutorRef);
                const tutorData = tutorSnapshot.val();

                if (tutorData) {
                    tutorName = tutorData.name; // Get the tutor's name
                }
            }

            // Use the first image from topicImages for og:image
            const imageUrl = topic.topicImages && topic.topicImages.length > 0 ? topic.topicImages[0].url : "https://via.placeholder.com/800x400"; // Fallback image

            return {
                title: `${topic.topicName} by ${tutorName} on Edumat`,
                description: topic.description,
                keywords: `${topic.topicName}, ${tutorName}, Edumat`,
                author: tutorName,
                openGraph: {
                    title: `${topic.topicName} by ${tutorName} on Edumat`,
                    description: topic.description,
                    url: `https://edumat.in/category/${params.category}/${topicSlug}`, // Update with your actual URL
                    siteName: "Edumat",
                    images: [
                        {
                            url: imageUrl,
                            width: 800,
                            height: 600,
                            alt: topic.topicName,
                        },
                    ],
                },
            };
        }
    }

    // Fallback title if topic is not found
    return {
        title: "Topic not found",
        description: "The requested topic could not be found.",
    };
}

export default function TopicPage({ params }) {
    return <TopicPageClient params={params} />;
}