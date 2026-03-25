import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, ArrowRight, BookOpen, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { blogAPI } from '../api';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

// Initial static data as fallback or while loading
const initialPosts = [
  {
    id: 1,
    type: 'Parish News',
    title: 'Holy Week Schedule 2025 Announced',
    excerpt: 'Our parish has published the complete schedule for Holy Week services, including Palm Sunday, the Triduum, and the Easter Vigil. Join us as we journey through the most sacred days of our faith.',
    date: 'March 20, 2025',
    image: '/images/blog1.jpg',
    tag: 'Liturgy',
    readTime: '3 min read',
  },
];

const tagColors = {
  Liturgy: 'bg-purple-50 text-purple-700',
  Spirituality: 'bg-blue-50 text-blue-700',
  Youth: 'bg-green-50 text-green-700',
  Music: 'bg-amber-50 text-amber-700',
  Prayer: 'bg-rose-50 text-rose-700',
};

const allTags = ['All', 'Parish News', 'Sunday Reflection'];

const Blog = () => {
  const [filter, setFilter] = useState('All');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await blogAPI.getAll();
        // Transform backend data to match UI expectations if needed
        const formattedPosts = response.data.map(post => ({
          id: post.id,
          type: 'Parish News', // Default or could come from backend
          title: post.title,
          excerpt: post.content.substring(0, 150) + '...',
          date: new Date(post.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          image: post.image_url || '/images/blog-placeholder.jpg',
          tag: 'General',
          readTime: '5 min read',
          slug: post.slug
        }));
        setPosts(formattedPosts.length > 0 ? formattedPosts : initialPosts);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setPosts(initialPosts);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filtered = filter === 'All' ? posts : posts.filter((p) => p.type === filter);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative h-64 md:h-80 bg-navy-blue overflow-hidden">
        <img src="/images/blog-hero.jpg" alt="Blog" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-liturgical-gold text-sm uppercase tracking-[0.3em] font-sans mb-3">Words of Faith</p>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white">Parish Blogs</h1>
            <div className="w-16 h-0.5 bg-liturgical-gold mx-auto mt-4" />
          </motion.div>
        </div>
      </div>

      {/* Filter */}
      <section className="py-8 bg-soft-cream border-b border-navy-blue/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center gap-3">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setFilter(tag)}
                className={`px-6 py-2.5 rounded-full text-sm font-sans font-semibold transition-all duration-300 ${
                  filter === tag
                    ? 'bg-navy-blue text-liturgical-gold shadow-md'
                    : 'bg-white text-navy-blue hover:bg-navy-blue/10'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {filter === 'All' && posts[0] && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-2xl group cursor-pointer"
            >
              <div className="relative overflow-hidden h-72 lg:h-auto">
                <img src={posts[0].image} alt={posts[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 bg-soft-cream" />
                <div className="absolute inset-0 bg-navy-blue/20" />
                <span className="absolute top-4 left-4 bg-liturgical-gold text-navy-blue text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Featured
                </span>
              </div>
              <div className="bg-navy-blue p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center space-x-2 mb-4">
                  <BookOpen className="h-4 w-4 text-liturgical-gold" />
                  <span className="text-liturgical-gold text-xs uppercase tracking-widest font-sans">{posts[0].type}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4 leading-tight">{posts[0].title}</h2>
                <p className="text-white/60 font-sans text-sm leading-relaxed mb-6">{posts[0].excerpt}</p>
                <div className="flex items-center space-x-4 text-white/40 text-xs font-sans mb-8">
                  <span className="flex items-center space-x-1"><CalendarDays className="h-3.5 w-3.5" /><span>{posts[0].date}</span></span>
                  <span>{posts[0].readTime}</span>
                </div>
                <Link to={`/blog/${posts[0].slug}`} className="inline-flex items-center space-x-2 text-liturgical-gold font-sans font-semibold text-sm hover:text-yellow-300 transition-colors group">
                  <span>Read Article</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>

              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Posts Grid */}
      <section className={`py-16 ${filter === 'All' ? 'bg-soft-cream' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filter === 'All' && (
            <h2 className="text-2xl font-serif font-bold text-navy-blue mb-10">All Articles</h2>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {(filter === 'All' ? filtered.slice(1) : filtered).map((post, i) => (
              <motion.Link
                to={`/blog/${post.slug}`}
                key={post.id}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col"
              >

                <div className="relative overflow-hidden h-52">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 bg-soft-cream"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs font-sans font-semibold px-3 py-1 rounded-full ${tagColors[post.tag] || 'bg-gray-100 text-gray-600'}`}>
                      {post.tag}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <p className="text-liturgical-gold text-xs uppercase tracking-widest font-sans mb-2">{post.type}</p>
                  <h3 className="text-xl font-serif font-bold text-navy-blue mb-3 leading-snug">{post.title}</h3>
                  <p className="text-navy-blue/60 font-sans text-sm leading-relaxed flex-grow">{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-soft-cream">
                    <div className="flex items-center space-x-2 text-navy-blue/40 text-xs font-sans">
                      <CalendarDays className="h-3.5 w-3.5" />
                      <span>{post.date}</span>
                      <span>·</span>
                      <span>{post.readTime}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-liturgical-gold group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.Link>
            ))}

          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
