import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Gallery from './pages/Gallery';
import PrayerRequest from './pages/PrayerRequest';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Contact from './pages/Contact';
import News from './pages/News';
import PageTransition from './components/PageTransition';

import { siteSettingsAPI, contactInfoAPI } from './api';
function App() {
  const [settings, setSettings] = useState(null);
  const [contact, setContact] = useState(null);

  useEffect(() => {
    siteSettingsAPI.get()
      .then(res => {
        if (res.data && res.data.length > 0) {
          setSettings(res.data[0]);
        }
      })
      .catch(err => console.error("Error fetching site settings:", err));

    contactInfoAPI.get()
      .then(res => {
        if (res.data && res.data.length > 0) {
          setContact(res.data[0]);
        }
      })
      .catch(err => console.error("Error fetching contact info:", err));
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar settings={settings} />
          <main className="flex-grow">
            <PageTransition>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/prayer" element={<PrayerRequest />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/news" element={<News />} />
                <Route path="/contact" element={<Contact />} />

              </Routes>

            </PageTransition>
          </main>
          <Footer settings={settings} contact={contact} />
        </div>
      </Router>
    </ErrorBoundary>
  );
}


export default App;
