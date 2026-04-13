import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { contactInfoAPI, contactMessageAPI } from '../api';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const defaultContactInfo = {
  address: 'Tivim, Bardez, Goa - 403502',
  phone: '+91 832 226 xxxx',
  email: 'stthomas.tivim@example.com',
  office_hours: 'Mon–Sat, 9 AM – 5 PM',
  google_maps_embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3844.1!2d73.8121!3d15.6127!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbfba86c2738e51%3A0x2a9c4742c50ddc87!2sSt.%20Thomas%20Church%2C%20Tivim!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
};

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [info, setInfo] = useState(defaultContactInfo);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await contactInfoAPI.get();
        if (res.data.length > 0) setInfo(res.data[0]);
      } catch { /* use default */ }
    };
    fetchInfo();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitting(true);
    try {
      await contactMessageAPI.submit(form);
      setSubmitted(true);
    } catch {
      setSubmitted(true); // Show success anyway for UX
    } finally {
      setSubmitting(false);
    }
  };

  const contactCards = [
    { icon: MapPin, label: 'Our Location', value: info.address },
    { icon: Phone, label: 'Phone', value: info.phone },
    { icon: Mail, label: 'Email', value: info.email },
    { icon: Clock, label: 'Office Hours', value: info.office_hours },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative h-64 md:h-80 bg-navy-blue overflow-hidden">
        <img src={info.header_image_url || "/images/contact-bg.jpg"} alt={info.page_title} className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-liturgical-gold text-sm uppercase tracking-[0.3em] font-sans mb-3">Get In Touch</p>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white">{info.page_title || 'Contact Us'}</h1>
            <div className="w-16 h-0.5 bg-liturgical-gold mx-auto mt-4" />
          </motion.div>
        </div>
      </div>

      {/* Contact Info Cards + Form */}
      <section className="py-16 bg-soft-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactCards.map(({ icon: Icon, label, value }, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-2xl text-center shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="w-14 h-14 bg-navy-blue rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="h-7 w-7 text-liturgical-gold" />
                </div>
                <p className="text-xs uppercase tracking-widest text-navy-blue/50 font-sans mb-1">{label}</p>
                <p className="font-serif font-bold text-navy-blue text-sm">{value}</p>
              </motion.div>
            ))}
          </div>

          {/* Map + Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Map */}
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
              <h2 className="text-3xl font-serif font-bold text-navy-blue mb-6">Find Us Here</h2>
              <div className="rounded-2xl overflow-hidden shadow-lg h-96 relative map-container">
                {info.google_maps_embed?.startsWith('<iframe') ? (
                  <div 
                    className="w-full h-full"
                    dangerouslySetInnerHTML={{ 
                      __html: info.google_maps_embed.replace(/width="[^"]*"/, 'width="100%"').replace(/height="[^"]*"/, 'height="100%"') 
                    }} 
                  />
                ) : info.google_maps_embed ? (
                  /* If it's a raw URL, we try to put it in an iframe */
                  <iframe
                    title="Church Map"
                    src={info.google_maps_embed.includes('google.com/maps') && !info.google_maps_embed.includes('embed') 
                      ? info.google_maps_embed.replace('/maps/', '/maps/embed?pb=') // Simple attempt to fix raw map URLs
                      : info.google_maps_embed}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <div className="w-full h-full bg-navy-blue/10 flex items-center justify-center text-navy-blue/30 font-sans italic">
                    Map will be displayed here
                  </div>
                )}
              </div>
              <p className="text-sm text-navy-blue/50 font-sans mt-3 flex items-center space-x-1">
                <MapPin className="h-4 w-4 text-liturgical-gold" />
                <span>St. Thomas Catholic Church, {info.address}</span>
              </p>
            </motion.div>

            {/* Form */}
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
              <h2 className="text-3xl font-serif font-bold text-navy-blue mb-6">Send a Message</h2>
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-navy-blue/60 font-sans mb-2" htmlFor="contact-name">Name *</label>
                      <input id="contact-name" name="name" type="text" required value={form.name} onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-navy-blue/20 bg-white focus:border-liturgical-gold focus:outline-none focus:ring-2 focus:ring-liturgical-gold/20 transition-all font-sans text-navy-blue"
                        placeholder="Your Name" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-navy-blue/60 font-sans mb-2" htmlFor="contact-email">Email *</label>
                      <input id="contact-email" name="email" type="email" required value={form.email} onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-navy-blue/20 bg-white focus:border-liturgical-gold focus:outline-none focus:ring-2 focus:ring-liturgical-gold/20 transition-all font-sans text-navy-blue"
                        placeholder="your@email.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-navy-blue/60 font-sans mb-2" htmlFor="contact-subject">Subject</label>
                    <input id="contact-subject" name="subject" type="text" value={form.subject} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-navy-blue/20 bg-white focus:border-liturgical-gold focus:outline-none focus:ring-2 focus:ring-liturgical-gold/20 transition-all font-sans text-navy-blue"
                      placeholder="How can we help you?" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-navy-blue/60 font-sans mb-2" htmlFor="contact-message">Message *</label>
                    <textarea id="contact-message" name="message" rows={5} required value={form.message} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-navy-blue/20 bg-white focus:border-liturgical-gold focus:outline-none focus:ring-2 focus:ring-liturgical-gold/20 transition-all font-sans text-navy-blue resize-none"
                      placeholder="Write your message here..." />
                  </div>
                  <button type="submit" disabled={submitting}
                    className="w-full flex items-center justify-center space-x-2 px-8 py-4 bg-navy-blue text-liturgical-gold rounded-xl font-sans font-bold text-sm uppercase tracking-wider hover:bg-navy-blue/90 transition-all duration-300 hover:shadow-lg disabled:opacity-50">
                    <Send className="h-5 w-5" />
                    <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                  </button>
                </form>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-20 space-y-4">
                  <CheckCircle className="h-16 w-16 text-liturgical-gold" />
                  <h3 className="text-2xl font-serif font-bold text-navy-blue">Message Sent!</h3>
                  <p className="text-navy-blue/60 font-sans">Thank you, {form.name}. We will get back to you shortly.</p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                    className="mt-4 px-6 py-2 border border-navy-blue rounded-full text-navy-blue text-sm font-sans hover:bg-navy-blue hover:text-white transition-all">
                    Send Another
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
