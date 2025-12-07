import Image from "next/image";
import TikTok from '../../public/tiktok.svg';
import Threads from '../../public/threads.svg';

import { ArrowUp, Heart, Instagram, Mail, MapPin, Phone, X, Youtube } from "lucide-react";

export default function Footer() {
  const logoUrl = "https://velgg90lgs.ufs.sh/f/ymmBhW7qEDZCbp9r9zwTjwQiehyaprgucNE83TskxCXJonmI";

  return (
    <footer className="border-t border-slate-200/50 py-12 bg-white relative">
      {/* Back to Top Button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-lg"
      >
        <ArrowUp size={20} />
      </button>

      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <Image 
              src={logoUrl}
              style={{objectFit: "cover"}} 
              alt="royal bird studio"
              width={120}
              height={100}
            />
            <p className="text-slate-700 text-lg mb-6 max-w-md">
              Bringing a rich tapestry of stories, myths, and heroes to life through 
              breathtaking comics and authentic storytelling.
            </p>
            
            {/* Newsletter Signup */}
            <div className="max-w-md">
              <p className="text-slate-600 mb-3 font-semibold">Stay updated with new releases</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                />
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-md">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-slate-800 font-bold text-lg mb-4">Explore</h4>
            <ol className="space-y-3">
              {['Featured Comics', 'New Releases', 'Popular Series', 'Free Reads', 'Behind the Scenes'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors duration-200 flex items-center gap-2 group">
                    <div className="w-1 h-1 bg-blue-500 rounded-full opacity-20 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </a>
                </li>
              ))}
            </ol>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-slate-800 font-bold text-lg mb-4">Contact</h4>
            <div className="space-y-3 text-slate-600">
              <div className="flex items-center gap-3 hover:text-blue-600 transition-colors cursor-pointer group">
                <Mail size={22} className="text-blue-500 group-hover:text-blue-600 transition-colors" />
                <span>hello@royalbirdstudios.com</span>
              </div>
              <div className="flex items-center gap-3 hover:text-blue-600 transition-colors cursor-pointer group">
                <Phone size={16} className="text-blue-500 group-hover:text-blue-600 transition-colors" />
                <span>+234 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 hover:text-blue-600 transition-colors cursor-pointer group">
                <MapPin size={20} className="text-blue-500 group-hover:text-blue-600 transition-colors" />
                <span>Abuja, Nigeria</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Bottom Section */}
        <div className="border-t border-slate-200/50 pt-8">
          {/* Social Media Links */}
          <div className="flex flex-col items-center mb-6">
            <p className="text-slate-600 mb-4 font-semibold">Follow our journey</p>
            <div className="flex justify-center gap-4">
              {[
                { icon: <X size={20} />, name: 'Twitter', url: '#' },
                { icon: <Instagram size={20} />, name: 'Instagram', url: '#' },
                { icon: <Youtube size={20} />, name: 'YouTube', url: '#' },
                { icon: <Image src={TikTok} alt="tiktok" height={20} width={20} className="text-slate-600" />, name: 'TikTok', url: '#' },
                { icon: <Image src={Threads} alt="threads" height={20} width={20} className="text-slate-600" />, name: 'Threads', url: '#' },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="group bg-slate-100 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 p-3 rounded-xl transition-all duration-300 transform hover:scale-110 hover:shadow-lg border border-slate-200"
                  aria-label={social.name}
                >
                  <div className="text-slate-600 group-hover:text-white transition-colors">
                    {social.icon}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500">
            <div className="flex flex-col items-center gap-2 text-sm">
              <span>© 2024 Royalbird Studios. All rights reserved.</span>
              <div className="flex gap-4">
                <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
                <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
                <a href="#" className="hover:text-blue-600 transition-colors">Cookies</a>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <span>Made with</span>
              <Heart size={14} className="text-purple-500 fill-current" />
              <span>for storytelling enthusiasts</span>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-4 right-4 opacity-20">
          <div className="flex gap-1">
            {Array.from([1,2,3]).map((_, i) => (
              <div key={i} className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}