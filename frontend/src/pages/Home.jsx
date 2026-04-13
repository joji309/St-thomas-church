import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Quote, ArrowRight, Church } from 'lucide-react';
import { Link } from 'react-router-dom';
import { heroAPI, massTimingAPI, welcomeAPI, announcementAPI, noticeAPI, bibleVerseAPI } from '../api';
import { AlertTriangle, Info, Bell } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

// ═══════════════════════════════════════════════════════════════
// IMPORTANT NOTICES (BANNER)
// ═══════════════════════════════════════════════════════════════

const ImportantNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await noticeAPI.getAll();
        setNotices(res.data.filter(n => n.is_active));
      } catch (err) {
        console.error("Error fetching notices:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  if (loading || notices.length === 0) return null;

  return (
    <section className="py-16 bg-soft-cream/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-liturgical-gold/20 rounded-full mb-4">
            <Bell className="h-6 w-6 text-liturgical-gold" />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy-blue">Important Notices</h2>
          <div className="w-16 h-0.5 bg-liturgical-gold mx-auto mt-4" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {notices.map((notice, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border-2 border-navy-blue/5 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:border-liturgical-gold/30 transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-liturgical-gold/40 group-hover:bg-liturgical-gold transition-colors" />
              <div className="flex flex-col h-full">
                <h3 className="text-xl font-serif font-bold text-navy-blue mb-4 group-hover:text-liturgical-gold transition-colors tracking-tight">
                  {notice.title}
                </h3>
                <p className="text-navy-blue/70 font-sans leading-relaxed flex-grow">
                  {notice.content}
                </p>
                <div className="mt-6 pt-6 border-t border-navy-blue/5 flex items-center text-xs font-sans uppercase tracking-[0.2em] text-navy-blue/40 font-bold">
                  <Info className="h-3 w-3 mr-2 text-navy-blue/30" />
                  Parish Advisory
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};


// ═══════════════════════════════════════════════════════════════
// HERO CAROUSEL

// ═══════════════════════════════════════════════════════════════

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await heroAPI.getAll();
        const formatted = response.data.map(slide => ({
          image: slide.image_url,
          title: slide.title,
          subtitle: slide.subtitle,
          button_text: slide.button_text,
          button_link: slide.button_link
        }));
        setSlides(formatted.length > 0 ? formatted : [
          { image: '/images/hero1.jpg', title: 'Welcome to St. Thomas', subtitle: 'Catholic Church, Tivim, Goa', button_text: 'Discover Our Story', button_link: '/about' },
        ]);
      } catch {
        setSlides([
          { image: '/images/hero1.jpg', title: 'Welcome to St. Thomas', subtitle: 'Catholic Church, Tivim, Goa', button_text: 'Discover Our Story', button_link: '/about' },
        ]);
      } finally { setLoading(false); }
    };
    fetchSlides();
  }, []);

  const next = useCallback(() => {
    if (slides.length <= 1) return;
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    if (slides.length <= 1) return;
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  if (loading || slides.length === 0) {
    return (
      <div className="h-screen max-h-[800px] bg-navy-blue flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-liturgical-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const variants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60, transition: { duration: 0.5, ease: 'easeIn' } }),
  };

  return (
    <div className="relative h-screen max-h-[800px] overflow-hidden bg-navy-blue">
      <AnimatePresence custom={direction} initial={false}>
        <motion.div key={current} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" className="absolute inset-0">
          <img src={slides[current].image} alt={slides[current].title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-blue/60 via-navy-blue/30 to-navy-blue/80" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <AnimatePresence mode="wait">
          <motion.div key={`text-${current}`} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6 }}>
            <p className="text-liturgical-gold text-sm md:text-base uppercase tracking-[0.3em] mb-4 font-sans">
              {slides[current].button_text || "St. Thomas Church"}
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-4 leading-tight">{slides[current].title}</h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 font-sans font-light">{slides[current].subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={slides[current].button_link || "/about"} className="px-8 py-3 bg-liturgical-gold text-navy-blue font-bold rounded-full hover:bg-yellow-400 transition-all duration-300 hover:shadow-lg hover:shadow-liturgical-gold/30 text-sm uppercase tracking-wider">
                {slides[current].button_text || "Learn More"}
              </Link>
              <Link to="/prayer" className="px-8 py-3 border border-white/50 text-white rounded-full hover:bg-white/10 transition-all duration-300 backdrop-blur-sm text-sm uppercase tracking-wider">
                Submit Prayer Request
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <button onClick={prev} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm transition-all text-white" aria-label="Previous slide">
        <ChevronLeft className="h-7 w-7" />
      </button>
      <button onClick={next} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm transition-all text-white" aria-label="Next slide">
        <ChevronRight className="h-7 w-7" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
            className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'bg-liturgical-gold w-8' : 'bg-white/50 w-2'}`}
            aria-label={`Go to slide ${i + 1}`} />
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MASS TIMINGS
// ═══════════════════════════════════════════════════════════════

const defaultMassTimings = [];

const MassTimings = () => {
  const [timings, setTimings] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await massTimingAPI.getAll();
        setTimings(res.data.length > 0 ? res.data : defaultMassTimings);
      } catch { setTimings(defaultMassTimings); }
    };
    fetch();
  }, []);

  if (timings.length === 0) return null;

  return (
    <section className="py-20 bg-white">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="text-center mb-14">
          <p className="text-liturgical-gold text-sm uppercase tracking-[0.3em] font-sans mb-2">Worship With Us</p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy-blue">Mass Timings</h2>
          <div className="w-16 h-0.5 bg-liturgical-gold mx-auto mt-5" />
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {timings.map((m, i) => (
            <motion.div key={i} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} transition={{ delay: i * 0.1 }}
              className="flex items-start space-x-4 p-6 rounded-2xl bg-soft-cream hover:shadow-lg transition-all duration-300 group">
              <div className="p-3 bg-navy-blue rounded-xl text-liturgical-gold shrink-0 group-hover:scale-110 transition-transform">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-navy-blue/50 font-sans uppercase tracking-wider mb-1">{m.day}</p>
                <p className="text-2xl font-serif font-bold text-navy-blue">{m.time}</p>
                <p className="text-sm font-semibold text-navy-blue/80 mt-0.5">{m.label}</p>
                <p className="text-xs text-navy-blue/50 mt-1">{m.language}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════
// WELCOME MESSAGE
// ═══════════════════════════════════════════════════════════════

const defaultWelcome = {
  priest_name: "Fr. John D'Souza",
  priest_title: 'Parish Priest',
  priest_image_url: '/images/parish-priest.jpg',
  heading: 'A Warm Welcome',
  quote_text: '"Dear Parishioners and Friends, on behalf of our faith community, I extend to you a warm and heartfelt welcome. Since our founding in 1581, St. Thomas Church has stood as a sanctuary of God\'s grace, peace, and love."',
  body_text: 'Whether you are a long-time parishioner, a visitor, or someone searching for faith, you have found a home here. Our doors, hearts, and community are always open to you.',
};

const WelcomeMessage = () => {
  const [data, setData] = useState(defaultWelcome);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await welcomeAPI.get();
        if (res.data.length > 0) setData(res.data[0]);
      } catch { /* use default */ }
    };
    fetchData();
  }, []);

  return (
    <section className="py-24 bg-soft-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
            <div className="relative">
              <img src={data.priest_image_url || '/images/parish-priest.jpg'} alt={data.priest_name} className="w-full aspect-[4/5] object-cover rounded-2xl shadow-2xl" />
              <div className="absolute -bottom-5 -right-5 hidden lg:block bg-navy-blue text-white p-5 rounded-xl shadow-xl">
                <p className="text-xs uppercase tracking-widest text-liturgical-gold font-sans">{data.priest_title}</p>
                <p className="text-lg font-serif font-bold mt-1">{data.priest_name}</p>
              </div>
            </div>
          </motion.div>
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
            <p className="text-liturgical-gold text-sm uppercase tracking-[0.3em] font-sans mb-4">Message from the {data.priest_title}</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy-blue mb-6 leading-tight">{data.heading}</h2>
            <div className="w-16 h-0.5 bg-liturgical-gold mb-8" />
            <div className="relative pl-6 border-l-2 border-liturgical-gold mb-6">
              <Quote className="absolute -left-3.5 -top-1 h-6 w-6 bg-soft-cream text-liturgical-gold" />
              <p className="text-navy-blue/70 text-lg leading-relaxed font-sans italic">{data.quote_text}</p>
            </div>
            <p className="text-navy-blue/70 leading-relaxed font-sans">{data.body_text}</p>
            <div className="mt-8 flex items-center space-x-4">
              <div className="h-16 w-16 bg-navy-blue rounded-full flex items-center justify-center font-serif text-2xl font-bold text-liturgical-gold">
                {data.priest_name.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p className="font-serif text-xl font-bold text-navy-blue">{data.priest_name}</p>
                <p className="text-sm text-navy-blue/60 font-sans">{data.priest_title}, St. Thomas Church</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════
// ANNOUNCEMENTS
// ═══════════════════════════════════════════════════════════════

const defaultAnnouncements = [];

const Announcements = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await announcementAPI.getAll();
        setItems(res.data.length > 0 ? res.data : defaultAnnouncements);
      } catch { setItems(defaultAnnouncements); }
    };
    fetch();
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="py-20 bg-navy-blue">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="text-center mb-14">
          <p className="text-liturgical-gold text-sm uppercase tracking-[0.3em] font-sans mb-2">Stay Updated</p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white">Announcements</h2>
          <div className="w-16 h-0.5 bg-liturgical-gold mx-auto mt-5" />
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {items.map((a, i) => (
            <motion.div key={i} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group">
              <p className="text-liturgical-gold text-xs uppercase tracking-widest font-sans mb-3">{a.date_text}</p>
              <h3 className="text-xl font-serif font-bold text-white mb-3">{a.title}</h3>
              {a.description && <p className="text-white/60 text-sm font-sans mb-4 line-clamp-2">{a.description}</p>}
              <span className="inline-block px-3 py-1 bg-liturgical-gold/20 text-liturgical-gold text-xs rounded-full font-sans">{a.tag}</span>

            </motion.div>
          ))}
        </div>
        <div className="text-center">
          <Link to="/news" className="inline-flex items-center space-x-2 text-liturgical-gold font-sans font-semibold hover:text-yellow-300 transition-colors group">
            <span>View All Parish News</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════
// DAILY BIBLE VERSE
// ═══════════════════════════════════════════════════════════════

const DailyVerse = () => {
  const [verse, setVerse] = useState(null);

  useEffect(() => {
    const fetchVerse = async () => {
      try {
        const res = await bibleVerseAPI.getAll();
        if (res.data.length > 0) setVerse(res.data[0]);
      } catch (err) { console.error("Error fetching bible verse:", err); }
    };
    fetchVerse();
  }, []);

  if (!verse) return null;

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative religious symbol watermark */}
      <div className="absolute -right-20 -top-20 opacity-5 pointer-events-none select-none">
        <Church className="w-96 h-96 text-navy-blue" />
      </div>

      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
          <Quote className="h-10 w-10 text-liturgical-gold mx-auto mb-8 opacity-40" />
          <h2 className="text-liturgical-gold text-xs uppercase tracking-[0.4em] font-sans mb-6">Daily Scripture</h2>
          
          <p className="text-2xl md:text-4xl font-serif font-bold text-navy-blue leading-relaxed mb-8 italic">
            "{verse.verse_text}"
          </p>
          
          <div className="w-12 h-1 bg-liturgical-gold mx-auto mb-6" />
          
          <p className="text-lg font-serif font-bold text-navy-blue uppercase tracking-widest">
            — {verse.reference} —
          </p>
        </motion.div>
      </div>
    </section>
  );
};

const Home = () => (
  <div>
    <HeroCarousel />
    <ImportantNotices />
    <MassTimings />
    <DailyVerse />
    <WelcomeMessage />
    <Announcements />
  </div>
);



export default Home;
