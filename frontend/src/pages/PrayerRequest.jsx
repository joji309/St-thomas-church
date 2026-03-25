import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Send, CheckCircle, Heart, HandHeart, Loader2 } from 'lucide-react';
import { prayerAPI } from '../api';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const intentions = [
  'Healing & Health',
  'Family & Loved Ones',
  'Departed Souls',
  'Special Intentions',
  'Thanksgiving',
  'Peace & Reconciliation',
];

const PrayerRequest = () => {
  const [form, setForm] = useState({ name: '', email: '', intention: '', message: '', category: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [candles, setCandles] = useState(Array(12).fill(false));

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.name && form.intention) {
      setLoading(true);
      setError(null);
      try {
        const payload = {
          full_name: form.name,
          email: form.email,
          request: `Intention: ${form.intention}\nCategory: ${form.category}\nAdditional Details: ${form.message}`
        };
        await prayerAPI.submit(payload);
        setSubmitted(true);
      } catch (err) {
        console.error("Error submitting prayer request:", err);
        setError("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleCandle = (i) => {
    setCandles((prev) => {
      const updated = [...prev];
      updated[i] = !updated[i];
      return updated;
    });
  };

  const litCount = candles.filter(Boolean).length;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative h-64 md:h-80 bg-navy-blue overflow-hidden">
        <img src="/images/prayer-bg.jpg" alt="Prayer" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-liturgical-gold text-sm uppercase tracking-[0.3em] font-sans mb-3">Ask & Receive</p>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white">Prayer Request</h1>
            <div className="w-16 h-0.5 bg-liturgical-gold mx-auto mt-4" />
          </motion.div>
        </div>
      </div>

      <section className="py-24 bg-soft-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Prayer Form */}
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy-blue mb-2">Submit Your Intention</h2>
              <p className="text-navy-blue/60 font-sans mb-8 text-sm leading-relaxed">
                Share your prayer intention and our parish priests will include it in their daily masses. All requests are treated with complete confidentiality.
              </p>

              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-navy-blue/60 font-sans mb-2" htmlFor="name">Your Name *</label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={form.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-navy-blue/20 bg-white focus:border-liturgical-gold focus:outline-none focus:ring-2 focus:ring-liturgical-gold/20 transition-all font-sans text-navy-blue"
                          placeholder="e.g. Maria Pereira"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-navy-blue/60 font-sans mb-2" htmlFor="email">Email (Optional)</label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-navy-blue/20 bg-white focus:border-liturgical-gold focus:outline-none focus:ring-2 focus:ring-liturgical-gold/20 transition-all font-sans text-navy-blue"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-navy-blue/60 font-sans mb-2">Category</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {intentions.map((cat) => (
                          <button
                            type="button"
                            key={cat}
                            onClick={() => setForm({ ...form, category: cat })}
                            className={`px-3 py-2 text-xs rounded-lg border font-sans transition-all ${
                              form.category === cat
                                ? 'bg-navy-blue text-liturgical-gold border-navy-blue'
                                : 'bg-white text-navy-blue/60 border-navy-blue/20 hover:border-navy-blue/40'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-navy-blue/60 font-sans mb-2" htmlFor="intention">Prayer Intention *</label>
                      <input
                        id="intention"
                        name="intention"
                        type="text"
                        required
                        value={form.intention}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-navy-blue/20 bg-white focus:border-liturgical-gold focus:outline-none focus:ring-2 focus:ring-liturgical-gold/20 transition-all font-sans text-navy-blue"
                        placeholder="e.g. For the health of my mother"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-navy-blue/60 font-sans mb-2" htmlFor="message">Additional Details</label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={form.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-navy-blue/20 bg-white focus:border-liturgical-gold focus:outline-none focus:ring-2 focus:ring-liturgical-gold/20 transition-all font-sans text-navy-blue resize-none"
                        placeholder="Share any additional details for your prayer intention..."
                      />
                    </div>

                    {error && (
                      <p className="text-red-500 text-sm font-sans text-center">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center space-x-2 px-8 py-4 bg-navy-blue text-liturgical-gold rounded-xl font-sans font-bold text-sm uppercase tracking-wider hover:bg-navy-blue/90 transition-all duration-300 hover:shadow-lg group disabled:opacity-50"
                    >
                      {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <HandHeart className="h-5 w-5" />
                      )}
                      <span>{loading ? 'Submitting...' : 'Submit Prayer Request'}</span>
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-16 space-y-4"
                  >
                    <CheckCircle className="h-16 w-16 text-liturgical-gold" />
                    <h3 className="text-2xl font-serif font-bold text-navy-blue">Prayer Received</h3>
                    <p className="text-navy-blue/60 font-sans max-w-sm">
                      Thank you, <strong>{form.name}</strong>. Your intention has been submitted. Our priests will pray for you at the next Holy Mass.
                    </p>
                    <button
                      onClick={() => { setSubmitted(false); setForm({ name: '', email: '', intention: '', message: '', category: '' }); }}
                      className="mt-4 px-6 py-2 border border-navy-blue rounded-full text-navy-blue text-sm font-sans hover:bg-navy-blue hover:text-white transition-all"
                    >
                      Submit Another
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Light a Candle */}
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy-blue mb-2">Light a Candle</h2>
              <p className="text-navy-blue/60 font-sans mb-8 text-sm leading-relaxed">
                Click on a candle to light it as a symbol of your prayer and faith. You have lit{' '}
                <span className="text-liturgical-gold font-bold">{litCount}</span> {litCount === 1 ? 'candle' : 'candles'}.
              </p>

              <div className="bg-white rounded-2xl p-8 shadow-sm">
                {/* Candle Display */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                  {candles.map((lit, i) => (
                    <motion.button
                      key={i}
                      onClick={() => toggleCandle(i)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center space-y-1 group"
                      aria-label={`${lit ? 'Extinguish' : 'Light'} candle ${i + 1}`}
                    >
                      <div className="relative">
                        {/* Flame */}
                        <AnimatePresence>
                          {lit && (
                            <motion.div
                              key="flame"
                              initial={{ opacity: 0, scaleY: 0.3 }}
                              animate={{ opacity: 1, scaleY: 1 }}
                              exit={{ opacity: 0, scaleY: 0 }}
                              className="absolute -top-5 left-1/2 -translate-x-1/2 origin-bottom"
                            >
                              <motion.div
                                animate={{ scaleX: [1, 1.15, 0.9, 1.1, 1], rotate: [-3, 3, -2, 4, -1, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                              >
                                <Flame className="h-5 w-5 text-orange-400 drop-shadow-sm" />
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        {/* Candle body */}
                        <div className={`w-5 h-12 mx-auto rounded-sm transition-colors duration-300 ${
                          lit ? 'bg-amber-100 shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 'bg-gray-200 group-hover:bg-amber-50'
                        }`} />
                        {/* Wick */}
                        <div className={`w-0.5 h-2 mx-auto transition-colors duration-300 ${lit ? 'bg-amber-900' : 'bg-gray-400'}`} />
                      </div>
                    </motion.button>
                  ))}
                </div>

                {litCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center border-t border-soft-cream pt-6"
                  >
                    <Heart className="h-5 w-5 text-liturgical-gold mx-auto mb-2" />
                    <p className="text-sm text-navy-blue/60 font-sans italic">
                      "Your candle is a light of faith burning in the heart of our church."
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Quote */}
              <div className="mt-8 p-6 bg-navy-blue rounded-2xl">
                <p className="text-white/80 font-sans text-sm leading-relaxed italic">
                  "Ask and it will be given to you; seek and you will find; knock and the door will be opened to you."
                </p>
                <p className="text-liturgical-gold text-xs font-sans uppercase tracking-widest mt-3">— Matthew 7:7</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrayerRequest;
