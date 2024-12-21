// src/app/page.js
"use client";

import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import Home from './components/Home';
import Footer from './components/Footer';

export default function MainPage() {
  return (
    <div className='site'>
      <Header />
      <main className="container-main-home">
        <Home />
      </main>
      <Footer />
    </div>
  );
}
