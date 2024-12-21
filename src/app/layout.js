// src/app/layout.js
// src/app/page.js
export const metadata = {
  title: 'EduMat - Comprehensive Educational Resources for All Levels',
  description: 'EduMat offers a vast range of educational resources including slides, notes, tests, and PDFs across various subjects. From school to higher education and entrance exam preparation, we provide quality content to help students succeed.',
  keywords: 'educational resources, study materials, slides, notes, tests, PDFs, entrance exam preparation, online learning, academic success, EduMat',
  author: 'EduMat Team',
  openGraph: {
      title: 'EduMat - Comprehensive Educational Resources for All Levels',
      description: 'Explore a wide array of educational resources at EduMat, including slides, notes, tests, and PDFs for all classes and entrance exam preparations.',
      url: 'https://edumat.in', // Replace with your actual website URL
      siteName: 'EduMat',
      // images: [
      //     {
      //         url: 'https://yourwebsite.com/static/homepage-image.jpg', // Replace with your actual image URL
      //         width: 1200,
      //         height: 630,
      //         alt: 'EduMat - Your Source for Educational Resources',
      //     },
      // ],
  },
};
 
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
        <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap" rel="stylesheet"/>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
