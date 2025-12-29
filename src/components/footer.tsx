import Image from "next/image";
import { AlertCircle, ArrowUp, Check, Heart, Mail, MapPin, Phone, X } from "lucide-react";
import { SiInstagram, SiTiktok, SiThreads, SiYoutube } from '@icons-pack/react-simple-icons';
import { api } from '~/lib/api';
import * as z from 'zod';
import { useState } from "react";

export default function Footer() {
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
    <footer className="py-12 bg-gradient-to-b from-white to-gray-50/90 relative">
      {/* Back to Top Button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="absolute -top-9 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-lg"
      >
        <ArrowUp size={20} />
      </button>

      <div className="container mx-auto px-4">
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
            />
            <p className="text-slate-700 text-lg mb-6 max-w-md">
              Bringing a rich tapestry of stories, myths, and heroes to life through 
              breathtaking comics and authentic storytelling.
            </p>
            
            {/* Newsletter Signup */}
            <div className="max-w-md">
              <p className="text-slate-600 mb-3 font-semibold">Stay updated with new releases</p>
              <form onSubmit={handleSubscribe} className="space-y-3">
                {showNameField && (
                  <div className="animate-fadeIn">
                    <input 
                      type="text" 
                      value={name}
                      onChange={handleNameChange}
                      placeholder="Your name (optional)"
                      className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
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
                    className="flex-1 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-md"
                  >
                    {status === 'loading' ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Subscribing...
                      </>
                    ) : status === 'success' ? (
                      <>
                        <Check size={16} />
                        Subscribed!
                      </>
                    ) : (
                      'Subscribe'
                    )}
                  </button>
                </div>

                {/* Error Message */}
                {status === 'error' && (
                  <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg animate-fadeIn">
                    <AlertCircle size={16} />
                    {message}
                  </div>
                )}

                <p className="text-slate-500 text-xs">
                  By subscribing, you agree to our Privacy Policy and consent to receive 
                  updates about new comics, blog posts, and studio announcements.
                </p>  
              </form>
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
                { icon: <SiInstagram size={20} />, name: 'Instagram', url: '#' },
                { icon: <SiYoutube size={20} />, name: 'YouTube', url: '#' },
                { icon: <SiTiktok size={20} />, name: 'TikTok', url: '#' },
                { icon: <SiThreads size={20} />, name: 'Threads', url: '#' },
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
              <span>© 2025 Royalbird Studios. All rights reserved.</span>
              <div className="flex gap-4">
                <a href="/privacy" className="hover:text-blue-600 transition-colors">Privacy</a>
                <a href="/terms" className="hover:text-blue-600 transition-colors">Terms</a>
                <a href="/privacy#cookies" className="hover:text-blue-600 transition-colors">Cookies</a>
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