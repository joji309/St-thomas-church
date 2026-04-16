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

  // Dynamic Favicon Update
  useEffect(() => {
    if (settings && settings.favicon_url) {
      let faviconUrl = settings.favicon_url;
      
      // Handle relative paths from Django (ensure they point to the backend)
      if (faviconUrl.startsWith('/media')) {
        const backendBase = import.meta.env.VITE_API_BASE_URL 
          ? import.meta.env.VITE_API_BASE_URL.replace('/api', '') 
          : '';
        // Only prepend if backendBase is an absolute URL
        if (backendBase.startsWith('http')) {
          faviconUrl = `${backendBase}${faviconUrl}`;
        }
      }

      const updateFavicon = (url) => {
        // Remove existing favicon links to avoid conflicts
        const links = document.querySelectorAll("link[rel~='icon']");
        links.forEach(link => link.parentNode.removeChild(link));

        // Create new favicon link
        const link = document.createElement('link');
        link.rel = 'icon';
        
        // Infer MIME type from file extension
        const extension = url.split('.').pop().split(/[?#]/)[0].toLowerCase();
        switch (extension) {
          case 'svg': link.type = 'image/svg+xml'; break;
          case 'png': link.type = 'image/png'; break;
          case 'ico': link.type = 'image/x-icon'; break;
          case 'gif': link.type = 'image/gif'; break;
          default: link.type = 'image/x-icon';
        }
        
        link.href = url;
        document.getElementsByTagName('head')[0].appendChild(link);
      };

      updateFavicon(faviconUrl);
    }
  }, [settings]);

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
