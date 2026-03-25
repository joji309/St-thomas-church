import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Church } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { siteSettingsAPI } from '../api';

const Navbar = ({ settings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Prayer Request', path: '/prayer' },
    { name: 'News', path: '/news' },
    { name: 'Blogs', path: '/blog' },
    { name: 'Contact', path: '/contact' },

  ];

  return (
    <nav className={`glass-nav transition-all duration-300 ${isScrolled ? 'py-2 shadow-md' : 'py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            {settings?.logo_url ? (
              <img 
                src={settings.logo_url} 
                alt={settings.site_name} 
                className="h-10 w-auto object-contain group-hover:scale-105 transition-transform" 
              />
            ) : (
              <Church className="h-8 w-8 text-liturgical-gold group-hover:scale-110 transition-transform" />
            )}
            <div className="flex flex-col">
              <span className="text-xl font-serif font-bold text-navy-blue tracking-tight">
                {settings?.site_name || 'St. Thomas Church'}
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-liturgical-gold leading-none">
                {settings?.site_tagline || 'Tivim, Goa'}
              </span>
            </div>
          </Link>


          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-liturgical-gold relative ${
                  location.pathname === link.path ? 'text-liturgical-gold' : 'text-navy-blue/80'
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-liturgical-gold"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-navy-blue p-2 hover:bg-soft-cream rounded-md transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-soft-cream/50 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-4 text-base font-medium rounded-md ${
                    location.pathname === link.path
                      ? 'bg-soft-cream text-liturgical-gold'
                      : 'text-navy-blue hover:bg-soft-cream hover:text-liturgical-gold'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
