import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Bell, Info, Megaphone } from 'lucide-react';
import { announcementAPI, noticeAPI } from '../api';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const News = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [annRes, noticeRes] = await Promise.all([
          announcementAPI.getAll(),
          noticeAPI.getAll()
        ]);
        setAnnouncements(annRes.data);
        setNotices(noticeRes.data.filter(n => n.is_active));
      } catch (error) {
        console.error("Error fetching news/notices:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-soft-cream/30">
      {/* Header */}
      <div className="relative h-64 md:h-80 bg-navy-blue overflow-hidden">
        <img src="/images/news-hero.jpg" alt="News" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-liturgical-gold text-sm uppercase tracking-[0.3em] font-sans mb-3">Community Updates</p>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white">Parish News & Notices</h1>
            <div className="w-16 h-0.5 bg-liturgical-gold mx-auto mt-4" />
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main News Content (Announcements) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center space-x-3 mb-8">
              <Megaphone className="h-6 w-6 text-liturgical-gold" />
              <h2 className="text-3xl font-serif font-bold text-navy-blue">Latest Announcements</h2>
            </div>
            
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-40 bg-white rounded-2xl border border-navy-blue/5" />)}
              </div>
            ) : (
              <div className="space-y-6">
                {announcements.map((item, i) => (
                  <motion.div
                    key={i}
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl p-8 border border-navy-blue/5 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <span className="text-liturgical-gold text-xs uppercase tracking-widest font-sans font-bold bg-liturgical-gold/10 px-3 py-1 rounded-full">
                        {item.tag}
                      </span>
                      <div className="flex items-center text-navy-blue/40 text-xs font-sans">
                        <CalendarDays className="h-4 w-4 mr-2" />
                        {item.date_text}
                      </div>
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-navy-blue mb-4 group-hover:text-liturgical-gold transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-navy-blue/70 font-sans leading-relaxed">
                      {item.description || "Join us for this upcoming event. Visit the parish office for more details."}
                    </p>

                  </motion.div>
                ))}
                {announcements.length === 0 && <p className="text-navy-blue/40 italic">No announcements at this time.</p>}
              </div>
            )}
          </div>

          {/* Sidebar (Important Notices) */}
          <div className="space-y-8">
            <div className="sticky top-24">
              <div className="flex items-center space-x-3 mb-8">
                <Bell className="h-6 w-6 text-liturgical-gold" />
                <h2 className="text-2xl font-serif font-bold text-navy-blue">Important Notices</h2>
              </div>
              
              <div className="space-y-6">
                {loading ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2].map(i => <div key={i} className="h-32 bg-navy-blue/5 rounded-2xl" />)}
                  </div>
                ) : (
                  <>
                    {notices.map((notice, i) => (
                      <motion.div
                        key={i}
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        className="bg-navy-blue rounded-2xl p-6 border-l-4 border-liturgical-gold shadow-lg"
                      >
                        <div className="flex items-center space-x-2 mb-3">
                          <Info className="h-4 w-4 text-liturgical-gold" />
                          <span className="text-liturgical-gold text-xs uppercase tracking-widest font-sans font-bold">Priority</span>
                        </div>
                        <h4 className="text-white font-serif font-bold text-lg mb-2">{notice.title}</h4>
                        <p className="text-white/70 text-sm font-sans leading-relaxed">{notice.content}</p>
                      </motion.div>
                    ))}
                    {notices.length === 0 && (
                      <div className="bg-white rounded-2xl p-8 border border-navy-blue/5 text-center">
                        <p className="text-navy-blue/40 text-sm italic">No active notices.</p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Weekly Quote / Side Decoration */}
              <div className="mt-12 p-8 bg-liturgical-gold rounded-2xl text-navy-blue">
                <p className="font-serif italic font-bold text-lg mb-2">"Faith is the realization of what is hoped for and evidence of things not seen."</p>
                <p className="text-xs uppercase tracking-widest font-sans font-bold opacity-60">— Hebrews 11:1</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default News;
