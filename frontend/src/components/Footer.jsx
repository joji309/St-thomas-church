import { Church, Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = ({ settings, contact }) => {
  return (
    <footer className="bg-navy-blue text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Church Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              {settings?.logo_url ? (
                <img src={settings.logo_url} alt={settings.site_name} className="h-10 w-auto object-contain" />
              ) : (
                <Church className="h-8 w-8 text-liturgical-gold" />
              )}
              <span className="text-xl font-serif font-bold">{settings?.site_name || 'St. Thomas Church'}</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              {settings?.footer_mission_statement || `Serving the faithful of ${settings?.site_tagline || 'Tivim, Goa'}. A beacon of faith, hope, and community in the heart of our village.`}
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-serif font-bold mb-6 text-liturgical-gold">Quick Links</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li><Link to="/about" className="hover:text-liturgical-gold transition-colors">History & Heritage</Link></li>
              <li><Link to="/gallery" className="hover:text-liturgical-gold transition-colors">Church Gallery</Link></li>
              <li><Link to="/prayer" className="hover:text-liturgical-gold transition-colors">Prayer Requests</Link></li>
              <li><Link to="/blog" className="hover:text-liturgical-gold transition-colors">Parish News</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-serif font-bold mb-6 text-liturgical-gold">Contact Us</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-liturgical-gold shrink-0" />
                <span>{contact?.address || settings?.site_tagline || 'Tivim, Bardez, Goa - 403502, India'}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-liturgical-gold shrink-0" />
                <span>{contact?.phone || '+91 832 226 xxxx'}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-liturgical-gold shrink-0" />
                <span>{contact?.email || 'stthomas.tivim@example.com'}</span>
              </li>
            </ul>
          </div>

          {/* Social & Follow */}
          <div>
            <h4 className="text-lg font-serif font-bold mb-6 text-liturgical-gold">Follow Us</h4>
            <div className="flex space-x-4 mb-8">
              {settings?.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-liturgical-gold hover:border-liturgical-gold transition-all">
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {settings?.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-liturgical-gold hover:border-liturgical-gold transition-all">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {settings?.youtube_url && (
                <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-liturgical-gold hover:border-liturgical-gold transition-all">
                  <Youtube className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-white/50">
          <p>© {new Date().getFullYear()} {settings?.footer_copyright_text || `${settings?.site_name || 'St. Thomas Catholic Church'}. All rights reserved.`}</p>
          <div className="mt-4 md:mt-0 space-x-6">
            <a href={settings?.footer_privacy_policy_url || '#'} className="hover:text-white transition-colors">Privacy Policy</a>
            <a href={settings?.footer_terms_url || '#'} className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};


export default Footer;
