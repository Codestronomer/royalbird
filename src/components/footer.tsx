"use client"
import Image from "next/image";
import { AlertCircle, ArrowUp, Check, Heart, Mail, MapPin, Phone, X } from "lucide-react";
import { SiInstagram, SiTiktok, SiYoutube } from '@icons-pack/react-simple-icons';
import { api } from '~/lib/api';
import * as z from 'zod';
import { useState } from "react";
import { useTheme } from "~/hooks/useTheme";
import SiLinkedin from "./icons/linkedin";

export default function Footer() {
  const { theme } = useTheme();
  const logoUrl = "https://velgg90lgs.ufs.sh/f/ymmBhW7qEDZCbp9r9zwTjwQiehyaprgucNE83TskxCXJonmI";

  const emailSchema = z.string().email("Please enter a valid email address");

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [showNameField, setShowNameField] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      emailSchema.parse(email)
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        setStatus('error');
        setMessage(error.issues?.[0]?.message ?? 'Please enter a valid email address');
        setTimeout(() => setStatus('idle'), 3000);
      }

      return;
    }

    setStatus('loading');

    try {
      await api.subscribe(email, name)

      setStatus('success');
      setEmail('');

      setTimeout(() => {
        setStatus('idle');
      }, 5000);
    } catch (error: unknown) {
      setStatus('error');
      
      let errorMessage: string;

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else {
        errorMessage = 'Failed to subscribe. Please try again.';
      }
      setMessage(errorMessage);

      setTimeout(() => setStatus('idle'), 5000);;
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setMessage('');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  return (
    <footer
      className={`py-12 relative transition-all duration-500 ${
        theme === 'dark'
          ? 'bg-[var(--card)]'  // Changed to use CSS custom property
          : 'bg-gradient-to-b from-white to-gray-50/90'
      }`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className={`absolute inset-0 transition-all duration-500 ${
          theme === 'dark'
            ? 'bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20'
            : 'bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:64px_64px] opacity-40'
        }`} />
        
        {/* Optional subtle gradient overlay for depth */}
        {theme === 'dark' && (
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--card)]/50 to-[var(--card)] opacity-30" />
        )}
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`absolute -top-9 left-1/2 transform -translate-x-1/2 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-lg ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] hover:from-[var(--secondary)] hover:to-pink-600'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
        }`}
      >
        <ArrowUp size={20} />
      </button>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-2 mx-auto">
            <Image 
              src={logoUrl}
              style={{objectFit: "cover"}} 
              alt="royal bird studios"
              width={120}
              height={100}
              className={`transition-all duration-500 ${
                theme === 'dark' ? 'brightness-110' : ''
              }`}
            />
            <p className={`text-lg mb-6 max-w-md transition-all duration-500 ${
              theme === 'dark' ? 'text-white' : 'text-slate-700'
            }`}>
              Bringing a rich tapestry of stories, myths, and heroes to life through 
              breathtaking comics and authentic storytelling.
            </p>
            
            {/* Newsletter Signup */}
            <div className="max-w-md">
              <p className={`mb-3 font-semibold transition-all duration-500 ${
                theme === 'dark' ? 'text-white' : 'text-slate-600'
              }`}>Stay updated with new releases</p>
              <form onSubmit={handleSubscribe} className="space-y-3">
                {showNameField && (
                  <div className="animate-fadeIn">
                    <input 
                      type="text" 
                      value={name}
                      onChange={handleNameChange}
                      placeholder="Your name (optional)"
                      className={`w-full px-4 py-2 border rounded-lg placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-300 disabled:opacity-60 ${
                        theme === 'dark'
                          ? 'bg-[var(--input)] border-[var(--border)] text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-[var(--primary)]/20 placeholder-gray-400'
                          : 'bg-white border-slate-300 text-slate-800 focus:border-blue-500 focus:ring-blue-200'
                      }`}
                      disabled={status === "loading"}
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <input 
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    onFocus={() => setShowNameField(true)}
                    placeholder="Enter your email"
                    disabled={status == "loading"}
                    className={`flex-1 px-4 py-2 border rounded-lg placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-300 disabled:opacity-60 ${
                      theme === 'dark'
                        ? 'bg-[var(--input)] border-[var(--border)] text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-[var(--primary)]/20 placeholder-gray-400'
                        : 'bg-white border-slate-300 text-slate-800 focus:border-blue-500 focus:ring-blue-200'
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-md disabled:opacity-60 ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-[var(--primary)] to-pink-600 hover:from-[var(--secondary)] hover:to-pink-700 text-white border border-[var(--primary)]/30'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                    }`}
                  >
                    {status === 'loading' ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Subscribing...
                      </div>
                    ) : status === 'success' ? (
                      <div className="flex items-center gap-2">
                        <Check size={16} />
                        Subscribed!
                      </div>
                    ) : (
                      'Subscribe'
                    )}
                  </button>
                </div>

                {/* Error Message */}
                {status === 'error' && (
                  <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg animate-fadeIn transition-all duration-500 ${
                    theme === 'dark'
                      ? 'text-red-300 bg-red-900/30'
                      : 'text-red-600 bg-red-50'
                  }`}>
                    <AlertCircle size={16} />
                    {message}
                  </div>
                )}

                <p className={`text-xs transition-all duration-500 ${
                  theme === 'dark' ? 'text-white/80' : 'text-slate-500'
                }`}>
                  By subscribing, you agree to our Privacy Policy and consent to receive 
                  updates about new comics, blog posts, and studio announcements.
                </p>  
              </form>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`font-bold text-lg mb-4 transition-all duration-500 ${
              theme === 'dark' ? 'text-white' : 'text-slate-800'
            }`}>Explore</h4>
            <ol className="space-y-3">
              {['Featured Comics', 'New Releases', 'Popular Series', 'Free Reads', 'Behind the Scenes'].map((item) => (
                <li key={item}>
                  <a href="#" className={`transition-colors duration-200 flex items-center gap-2 group ${
                    theme === 'dark'
                      ? 'text-white hover:text-[var(--primary)]'
                      : 'text-slate-600 hover:text-blue-600'
                  }`}>
                    <div className={`w-1 h-1 rounded-full transition-all duration-500 group-hover:opacity-100 ${
                      theme === 'dark'
                        ? 'bg-[var(--primary)] opacity-60'
                        : 'bg-blue-500 opacity-20'
                    }`} />
                    {item}
                  </a>
                </li>
              ))}
            </ol>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className={`font-bold text-lg mb-4 transition-all duration-500 ${
              theme === 'dark' ? 'text-white' : 'text-slate-800'
            }`}>Contact</h4>
            <div className={`space-y-3 transition-all duration-500 ${
              theme === 'dark' ? 'text-white' : 'text-slate-600'
            }`}>
              <div className={`flex items-center gap-3 transition-colors cursor-pointer group ${
                theme === 'dark' ? 'hover:text-white' : 'hover:text-blue-600'
              }`}>
                <Mail size={22} className={`transition-colors ${
                  theme === 'dark' ? 'text-[var(--primary)] group-hover:text-[var(--primary)]/80' : 'text-blue-500 group-hover:text-blue-600'
                }`} />
                <span className={`${theme === 'dark' ? 'text-white' : 'text-slate-600'}`}>hello@royalbirdstudios.com</span>
              </div>
              <div className={`flex items-center gap-3 transition-colors cursor-pointer group ${
                theme === 'dark' ? 'hover:text-[var(--primary)]' : 'hover:text-blue-600'
              }`}>
                <Phone size={16} className={`transition-colors ${
                  theme === 'dark' ? 'text-[var(--primary)] group-hover:text-[var(--primary)]/80' : 'text-blue-500 group-hover:text-blue-600'
                }`} />
                <span className={`${theme === 'dark' ? 'text-white' : 'text-slate-600'}`}>+234 (555) 123-4567</span>
              </div>
              <div className={`flex items-center gap-3 transition-colors cursor-pointer group ${
                theme === 'dark' ? 'hover:text-[var(--primary)]' : 'hover:text-blue-600'
              }`}>
                <MapPin size={20} className={`transition-colors ${
                  theme === 'dark' ? 'text-[var(--primary)] group-hover:text-[var(--primary)]/80' : 'text-blue-500 group-hover:text-blue-600'
                }`} />
                <span className={`${theme === 'dark' ? 'text-white' : 'text-slate-600'}`}>Abuja, Nigeria</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Bottom Section */}
        <div className={`border-t pt-8 transition-all duration-500 ${
          theme === 'dark' ? 'border-[var(--border)]' : 'border-slate-200/50'
        }`}>
          {/* Social Media Links */}
          <div className="flex flex-col items-center mb-6">
            <p className={`mb-4 font-semibold transition-all duration-500 ${
              theme === 'dark' ? 'text-white/80' : 'text-slate-600'
            }`}>Follow our journey</p>
            <div className="flex justify-center gap-4">
              {[
                { icon: <X size={20} />, name: 'Twitter', url: 'https://x.com/royalbirdcomics?s=21' },
                { icon: <SiInstagram size={20} />, name: 'Instagram', url: 'https://www.instagram.com/royalbird_studios?igsh=OWIwZWZkMTliMjNv&utm_source=qr' },
                { icon: <SiYoutube size={20} />, name: 'YouTube', url: 'https://youtube.com/@royalbirdstudios?si=IVK9PqKD_ylLOhTn' },
                { icon: <SiTiktok size={20} />, name: 'TikTok', url: 'https://www.tiktok.com/@royalbirdcomics?_r=1&_t=ZS-92lrpSQclwF' },
                { icon: <SiLinkedin size={20} />, name: 'Linkedin', url: 'https://www.linkedin.com/company/royal-bird-studios/' },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className={`group p-3 rounded-xl transition-all duration-300 transform hover:scale-110 hover:shadow-lg border ${
                    theme === 'dark'
                      ? 'bg-[var(--muted)]/50 border-[var(--border)] hover:bg-gradient-to-r hover:from-[var(--primary)] hover:to-pink-600'
                      : 'bg-slate-100 border-slate-200 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600'
                  }`}
                  aria-label={social.name}
                >
                  <div className={`transition-colors ${
                    theme === 'dark'
                      ? 'text-[var(--muted-foreground)] group-hover:text-white'
                      : 'text-slate-600 group-hover:text-white'
                  }`}>
                    {social.icon}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col items-center gap-2 text-sm">
              <span className={`transition-all duration-500 ${
                theme === 'dark' ? 'text-white/60' : 'text-slate-500'
              }`}>© 2025 Royalbird Studios. All rights reserved.</span>
              <div className="flex gap-4">
                <a 
                  href="/privacy" 
                  className={`transition-colors ${
                    theme === 'dark' ? 'text-white/80 hover:text-[var(--primary)]' : 'hover:text-blue-600'
                  }`}
                >
                  Privacy
                </a>
                <a 
                  href="/terms" 
                  className={`transition-colors ${
                    theme === 'dark' ? 'text-white/80 hover:text-[var(--primary)]' : 'hover:text-blue-600'
                  }`}
                >
                  Terms
                </a>
                <a 
                  href="/privacy#cookies" 
                  className={`transition-colors ${
                    theme === 'dark' ? 'text-white/80 hover:text-[var(--primary)]' : 'hover:text-blue-600'
                  }`}
                >
                  Cookies
                </a>
              </div>
            </div>
            
            <div className={`flex items-center gap-2 text-sm transition-all duration-500 ${
              theme === 'dark' ? 'text-white/80' : 'text-slate-500'
            }`}>
              <span>Made with</span>
              <Heart size={14} className={`${theme === 'dark' ? 'text-[var(--primary)]' : 'text-purple-500'} fill-current`} />
              <span>for storytelling enthusiasts</span>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-4 right-4 opacity-30">
          <div className="flex gap-1">
            {Array.from([1,2,3]).map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full animate-pulse transition-all duration-500 ${
                  theme === 'dark' ? 'bg-[var(--primary)]' : 'bg-blue-400'
                }`} 
                style={{ animationDelay: `${i * 0.2}s` }} 
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}