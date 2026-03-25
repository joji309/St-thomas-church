import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Star, Heart } from 'lucide-react';
import { timelineAPI, teamAPI, aboutPageAPI } from '../api';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

const defaultTimeline = [
  { year: '1581', title: 'Church Founded', description: 'St. Thomas Church was established by Portuguese missionaries.' },
  { year: '1981', title: '400 Years of Faith', description: 'The church celebrated four centuries of continuous ministry.' },
  { year: 'Today', title: 'Vibrant Parish', description: 'A thriving community of over 5,000 faithful.' },
];

const defaultTeam = [
  { name: "Fr. John D'Souza", role: 'Parish Priest', avatar: 'JD', image_url: '/images/priest1.jpg' },
  { name: 'Fr. Anthony Pereira', role: 'Associate Priest', avatar: 'AP', image_url: '/images/priest2.jpg' },
];

const About = () => {
  const [timeline, setTimeline] = useState([]);
  const [team, setTeam] = useState([]);
  const [aboutContent, setAboutContent] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [tlRes, tmRes, apRes] = await Promise.all([
          timelineAPI.getAll(),
          teamAPI.getAll(),
          aboutPageAPI.get(),
        ]);
        setTimeline(tlRes.data.length > 0 ? tlRes.data : defaultTimeline);
        setTeam(tmRes.data.length > 0 ? tmRes.data : defaultTeam);
        if (apRes.data.length > 0) setAboutContent(apRes.data[0]);
      } catch {
        setTimeline(defaultTimeline);
        setTeam(defaultTeam);
      }
    };
    fetchAll();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 bg-navy-blue overflow-hidden">
        <img
          src={aboutContent?.hero_image_url || '/images/church-exterior.jpg'}
          alt="Church Exterior"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-liturgical-gold text-sm uppercase tracking-[0.3em] font-sans mb-3">Our Story</p>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white">About Us</h1>
            <div className="w-16 h-0.5 bg-liturgical-gold mx-auto mt-4" />
          </motion.div>
        </div>
      </div>

      {/* History Section */}
      <section className="py-24 bg-soft-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="text-center mb-16">
            <p className="text-liturgical-gold text-sm uppercase tracking-[0.3em] font-sans mb-2">Est. 1581</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy-blue">Our Rich History</h2>
            <div className="w-16 h-0.5 bg-liturgical-gold mx-auto mt-5" />
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-liturgical-gold/30 hidden md:block" />
            <div className="space-y-12">
              {timeline.map((event, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                      <p className="text-liturgical-gold font-serif font-bold text-2xl mb-2">{event.year}</p>
                      <h3 className="text-xl font-serif font-bold text-navy-blue mb-2">{event.title}</h3>
                      <p className="text-navy-blue/60 text-sm leading-relaxed font-sans">{event.description}</p>
                    </div>
                  </div>
                  <div className="relative z-10 h-5 w-5 rounded-full bg-liturgical-gold border-4 border-soft-cream shadow-md shrink-0 hidden md:block" />
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Patron Saint Section */}
      <section className="py-24 bg-navy-blue text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
              <p className="text-liturgical-gold text-sm uppercase tracking-[0.3em] font-sans mb-4">Our Patron</p>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                {aboutContent?.patron_title || 'St. Thomas, The Apostle'}
              </h2>
              <div className="w-16 h-0.5 bg-liturgical-gold mb-8" />
              <p className="text-white/70 leading-relaxed font-sans mb-5">
                {aboutContent?.patron_description_1 ||
                  'St. Thomas, also known as "Doubting Thomas," was one of the twelve Apostles of Jesus Christ. His feast day is celebrated on July 3rd.'}
              </p>
              <p className="text-white/70 leading-relaxed font-sans mb-5">
                {aboutContent?.patron_description_2 ||
                  'According to tradition, St. Thomas traveled to India to proclaim the Gospel, founding the Christian community that continues to this day.'}
              </p>
              <div className="grid grid-cols-3 gap-5 mt-10">
                {[
                  { icon: BookOpen, label: 'Feast Day', value: 'July 3rd' },
                  { icon: Star, label: 'Patron of', value: 'India & Builders' },
                  { icon: Heart, label: 'Known For', value: 'His Faith' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                    <Icon className="h-6 w-6 text-liturgical-gold mx-auto mb-2" />
                    <p className="text-xs text-white/50 font-sans uppercase tracking-wider">{label}</p>
                    <p className="font-serif font-bold text-white mt-1">{value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
              <div className="relative">
                <img
                  src={aboutContent?.patron_image_url || '/images/st-thomas.jpg'}
                  alt="St. Thomas the Apostle"
                  className="w-full rounded-2xl shadow-2xl aspect-[3/4] object-cover"
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-liturgical-gold/30" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Parish Team */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="text-center mb-16">
            <p className="text-liturgical-gold text-sm uppercase tracking-[0.3em] font-sans mb-2">Meet The Team</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy-blue">Parish Community</h2>
            <div className="w-16 h-0.5 bg-liturgical-gold mx-auto mt-5" />
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                transition={{ delay: i * 0.1 }}
                className="group text-center"
              >
                <div className="relative w-48 h-48 mx-auto mb-5 overflow-hidden rounded-2xl shadow-md group-hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={member.image_url}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="absolute inset-0 bg-navy-blue items-center justify-center text-4xl font-serif font-bold text-liturgical-gold" style={{ display: 'none' }}>
                    {member.avatar}
                  </div>
                </div>
                <h3 className="text-xl font-serif font-bold text-navy-blue">{member.name}</h3>
                <p className="text-liturgical-gold text-sm font-sans uppercase tracking-wider mt-1">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
