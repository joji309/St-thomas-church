import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, ArrowLeft, BookOpen, User, Share2 } from 'lucide-react';
import { blogAPI } from '../api';

const BlogDetail = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await blogAPI.getBySlug(slug);
                setPost(response.data);
            } catch (error) {
                console.error("Error fetching blog detail:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-soft-cream">
                <div className="w-12 h-12 border-4 border-liturgical-gold border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-soft-cream px-4">
                <h2 className="text-3xl font-serif font-bold text-navy-blue mb-4">Post Not Found</h2>
                <Link to="/blog" className="flex items-center space-x-2 text-liturgical-gold font-sans font-bold hover:underline">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Blogs</span>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section with Image */}
            <div className="relative h-[50vh] min-h-[400px] bg-navy-blue overflow-hidden">
                <img 
                    src={post.image_url || '/images/blog-placeholder.jpg'} 
                    alt={post.title} 
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-blue via-navy-blue/20 to-transparent" />
                
                <div className="absolute inset-0 flex flex-col items-center justify-end text-center pb-16 px-4">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl"
                    >
                        <Link to="/blog" className="inline-flex items-center space-x-2 text-liturgical-gold font-sans text-xs uppercase tracking-[0.3em] mb-6 hover:text-yellow-400 transition-colors">
                            <ArrowLeft className="h-3 w-3" />
                            <span>Parish Blogs</span>
                        </Link>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center gap-6 text-white/70 text-sm font-sans">
                            <span className="flex items-center space-x-2">
                                <User className="h-4 w-4 text-liturgical-gold" />
                                <span>{post.author || 'St. Thomas Parish'}</span>
                            </span>
                            <span className="flex items-center space-x-2">
                                <CalendarDays className="h-4 w-4 text-liturgical-gold" />
                                <span>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Content Section */}
            <article className="max-w-4xl mx-auto px-4 py-20">
                <div className="prose prose-lg prose-slate max-w-none">
                    {/* Render content with line breaks */}
                    <div className="text-navy-blue/80 font-sans leading-relaxed space-y-6 text-lg">
                        {post.content.split('\n').map((paragraph, index) => (
                            paragraph.trim() && <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                </div>

                {/* Footer of the article */}
                <div className="mt-16 pt-8 border-t border-navy-blue/10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex items-center space-x-4">
                        <span className="text-navy-blue/40 text-sm font-sans font-bold uppercase tracking-widest">Share:</span>
                        <div className="flex items-center space-x-2">
                             <button className="p-2 rounded-full bg-soft-cream text-navy-blue hover:bg-liturgical-gold hover:text-white transition-all shadow-sm">
                                <Share2 className="h-4 w-4" />
                             </button>
                        </div>
                    </div>
                    
                    <Link to="/blog" className="inline-flex items-center space-x-2 bg-navy-blue text-liturgical-gold px-6 py-3 rounded-full font-serif font-bold shadow-lg hover:shadow-xl hover:bg-navy-blue/90 transition-all">
                        <BookOpen className="h-4 w-4" />
                        <span>Read More Articles</span>
                    </Link>
                </div>
            </article>
        </div>
    );
};

export default BlogDetail;
