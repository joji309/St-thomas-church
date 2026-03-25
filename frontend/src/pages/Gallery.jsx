import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { galleryAPI, galleryCategoryAPI } from '../api';

const initialImages = [
  { src: '/images/gallery1.jpg', title: 'Feast of St. Thomas', category: 'Feasts' },
  { src: '/images/gallery2.jpg', title: 'Christmas Midnight Mass', category: 'Liturgy' },
  { src: '/images/gallery3.jpg', title: 'Church Facade', category: 'Architecture' },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const Gallery = () => {

  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, imgRes] = await Promise.all([
          galleryCategoryAPI.getAll(),
          galleryAPI.getAll()
        ]);
        
        // Formatted categories
        const fetchedCats = catRes.data.map(c => c.name);
        setCategories(['All', ...fetchedCats]);

        // Formatted images
        const formattedImgs = imgRes.data.map(img => ({
          src: img.image_url,
          title: img.title,
          category: img.category_name // Use the category_name from serializer
        }));
        
        setImages(formattedImgs.length > 0 ? formattedImgs : initialImages);
      } catch (error) {
        console.error("Error fetching gallery data:", error);
        setImages(initialImages);
        setCategories(['All', 'Feasts', 'Liturgy', 'Architecture', 'Music', 'Youth', 'Sacraments']);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  const filtered = activeCategory === 'All'
    ? images
    : images.filter((img) => img.category === activeCategory);

  const openLightbox = (i) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);

  const prevImage = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
  }, [filtered.length]);

  const nextImage = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % filtered.length);
  }, [filtered.length]);

  useEffect(() => {
    const handleKey = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, prevImage, nextImage]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative h-64 md:h-80 bg-navy-blue overflow-hidden">
        <img src="/images/gallery-hero.jpg" alt="Gallery" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-liturgical-gold text-sm uppercase tracking-[0.3em] font-sans mb-3">Memories & Moments</p>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white">Gallery</h1>
            <div className="w-16 h-0.5 bg-liturgical-gold mx-auto mt-4" />
          </motion.div>
        </div>
      </div>

      {/* Filter Tabs */}
      <section className="py-10 bg-soft-cream border-b border-navy-blue/10 sticky top-16 z-30 backdrop-blur-sm bg-soft-cream/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-sans font-semibold transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-navy-blue text-liturgical-gold shadow-md'
                    : 'bg-white text-navy-blue hover:bg-navy-blue/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Masonry Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            <AnimatePresence>
              {filtered.map((img, i) => (
                <motion.div
                  layout
                  key={img.src}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative overflow-hidden rounded-xl cursor-pointer group break-inside-avoid"
                  onClick={() => openLightbox(i)}
                >
                  <img
                    src={img.src}
                    alt={img.title}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-500 bg-soft-cream min-h-[200px]"
                  />
                  <div className="absolute inset-0 bg-navy-blue/0 group-hover:bg-navy-blue/60 transition-all duration-300 flex items-end p-4">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-xs text-liturgical-gold uppercase tracking-widest font-sans">{img.category}</span>
                      <h3 className="text-white font-serif font-bold text-lg">{img.title}</h3>
                    </div>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ZoomIn className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white/70 hover:text-white z-10 p-2"
              aria-label="Close lightbox"
            >
              <X className="h-8 w-8" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 text-white/70 hover:text-white z-10 p-2"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-10 w-10" />
            </button>
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl max-h-[85vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={filtered[lightboxIndex].src}
                alt={filtered[lightboxIndex].title}
                className="w-full max-h-[75vh] object-contain rounded-lg"
              />
              <div className="text-center mt-4">
                <p className="text-liturgical-gold text-xs uppercase tracking-widest font-sans">{filtered[lightboxIndex].category}</p>
                <p className="text-white font-serif text-xl font-bold mt-1">{filtered[lightboxIndex].title}</p>
                <p className="text-white/40 text-sm mt-2 font-sans">{lightboxIndex + 1} / {filtered.length}</p>
              </div>
            </motion.div>
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 text-white/70 hover:text-white z-10 p-2"
              aria-label="Next image"
            >
              <ChevronRight className="h-10 w-10" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
