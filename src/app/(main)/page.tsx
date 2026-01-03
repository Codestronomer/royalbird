"use client"
import Link from "next/link";
import Image from "next/image";
import ComicCarousel from '../../components/carousel';
import { ArrowRight, BookOpen, Globe, Heart, Sparkles, Star, Users } from "lucide-react";
import { useTheme } from "~/hooks/useTheme";

export default function Home() {
  const { theme } = useTheme();

  const featuredComics = [
    {
      id: 1,
      title: "Breach",
      description: "In a futuristic Nigeria, a young woman named Onari, scarred by a tragic past, teams up with a fellow thief, Yubanna, to challenge the oppressive Regime. They plan a daring mission to the High Rise City in Abuja, but a ruthless general is already on their trail.",
      image: "https://velgg90lgs.ufs.sh/f/ymmBhW7qEDZClft5PAGpduc014aCIU9Zn5WhQOGosiJETqfK",
      rating: 4.8
    },
    {
      id: 2,
      title: "Breach (Issue #2)",
      description: "Onari's journey continues into the Forsaken. still reluctant to join the fight, it is obvious something must be done to save the people.",
      image: "https://velgg90lgs.ufs.sh/f/ymmBhW7qEDZCwVnJbzHX8cBAhqQlatjysEH4IeYN5Vodrvxb",
      rating: 4.9
    },
    {
      id: 3,
      title: "Swapped",
      description: "Two friends wake up in each other\'s bodies—confused, panicked, and realizing someone wanted this to happen. Now they must survive each other\'s lives while uncovering who switched them… and why.",
      image: "https://velgg90lgs.ufs.sh/f/ymmBhW7qEDZCpOpQBDaFjWu0eatESN5X6Am9bofsQqiVhzHC",
      rating: 'Coming soon'
    }
  ];

  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Epic Storylines",
      description: "Gripping narratives that hook you from the first page to the last panel"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Next-Level Art",
      description: "Bold, dynamic artwork that leaps off the page and into your imagination"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Worlds Unseen",
      description: "Discover rich universes and cultures waiting to be explored"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Creator-Driven",
      description: "Passionate artists and writers bringing you stories that matter"
    }
  ];

  const testimonials = [
    {
      name: "John Doe",
      role: "Comic Enthusiast",
      content: "Finally, stories that reflect my heritage! The art is breathtaking and the storytelling is masterful.",
      avatar: "/avatar1.jpg"
    },
    {
      name: "David Mensah",
      role: "History Teacher",
      content: "My students are captivated by these comics. They make African history accessible and exciting!",
      avatar: "/avatar2.jpg"
    },
    {
      name: "Sandra Bullock",
      role: "Graphic Novel Collector",
      content: "The quality and attention to cultural detail sets Royal Bird Studios apart. Absolutely stunning work.",
      avatar: "/avatar3.jpg"
    }
  ];

  // Shared background styles for coherence
  const sectionBackgrounds = {
    light: {
      hero: 'bg-gradient-to-br from-blue-50 via-white to-purple-50',
      featured: 'bg-gradient-to-b from-white via-blue-50/30 to-white',
      features: 'bg-gradient-to-b from-white via-slate-50 to-white',
      testimonials: 'bg-gradient-to-b from-slate-50 via-white/90 to-slate-50',
      cta: 'bg-gradient-to-br from-blue-50 via-purple-50/80 to-blue-50'
    },
    dark: {
      hero: 'bg-gradient-to-br from-gray-900 via-gray-800 to-purple-950',
      featured: 'bg-gradient-to-b from-gray-900 via-gray-800/90 to-gray-900',
      features: 'bg-gradient-to-b from-gray-900 via-gray-800/95 to-gray-900',
      testimonials: 'bg-gradient-to-b from-gray-900/95 via-gray-800/90 to-gray-900/95',
      cta: 'bg-gradient-to-br from-gray-900 via-purple-950/60 to-gray-900'
    }
  };

  const currentBackgrounds = theme === 'dark' ? sectionBackgrounds.dark : sectionBackgrounds.light;

  return (
    <main className="min-h-screen transition-colors duration-500">
      {/* Hero Section */}
      <section className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-all duration-500 ${currentBackgrounds.hero}`}>
        {/* Background Pattern with Image - Consistent across sections */}
        <div className="absolute inset-0">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50 transition-all duration-500"
            style={{
              backgroundImage: theme === 'dark'
                ? "url('https://velgg90lgs.ufs.sh/f/ymmBhW7qEDZCYZH8qO4opdWL2RExlqSG7OCMBwnDgkFtraAv')"
                : "url('')"
            }}
          />
          
          {/* Color Overlay for Image */}
          <div className={`absolute inset-0 transition-all duration-500 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-gray-900/40 via-transparent to-purple-950/30'
              : 'bg-gradient-to-br from-blue-50/40 via-transparent to-purple-50/30'
          }`} />
          
          {/* Radial Gradients */}
          <div className={`absolute inset-0 transition-all duration-500 ${
            theme === 'dark' 
              ? 'bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(147,51,234,0.15),rgba(0,0,0,0))]' 
              : 'bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.08),rgba(255,255,255,0))]'
          }`} />
          
          <div className={`absolute inset-0 transition-all duration-500 ${
            theme === 'dark'
              ? 'bg-[radial-gradient(ellipse_50%_50%_at_30%_70%,rgba(168,85,247,0.1),rgba(0,0,0,0))]'
              : 'bg-[radial-gradient(ellipse_50%_50%_at_30%_70%,rgba(139,92,246,0.05),rgba(255,255,255,0))]'
          }`} />
          
          {/* Mesh Pattern */}
          <div className={`absolute inset-0 transition-all duration-500 ${
            theme === 'dark'
              ? 'bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] opacity-30'
              : 'bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-50'
          }`} />
        </div>

        <div className="relative z-20 container mx-auto px-4 text-center">
          <div className="max-w-5xl mx-auto">
            {/* Animated Badge */}
            <div className={`inline-flex items-center gap-2 backdrop-blur-sm border rounded-full px-6 py-3 mb-8 shadow-lg animate-fade-in transition-all duration-500 ${
              theme === 'dark' 
                ? 'bg-gray-800/40 border-purple-700/30' 
                : 'bg-white/80 border-blue-200'
            }`}>
              <div className={`w-2 h-2 rounded-full animate-pulse transition-all duration-500 ${
                theme === 'dark' ? 'bg-green-400' : 'bg-green-500'
              }`} />
              <span className={`text-sm font-medium transition-all duration-500 ${
                theme === 'dark' ? 'text-green-300' : 'text-blue-700'
              }`}>BREACH Issue #2 out now!</span>
            </div>

            {/* Enhanced Main Heading */}
            <div className="relative mb-8">
              <h1 className="text-7xl md:text-9xl font-black tracking-tight mb-4">
                <span className={`bg-clip-text text-transparent relative transition-all duration-500 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-gray-300 via-purple-400 to-pink-400'
                    : 'bg-gradient-to-r from-gray-800 via-purple-700 to-pink-600'
                }`}>
                  ROYAL BIRD
                  <div className={`absolute inset-0 bg-clip-text text-transparent blur-sm opacity-15 -z-10 transition-all duration-500 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-gray-300 via-purple-400 to-pink-400'
                      : 'bg-gradient-to-r from-gray-800 via-purple-700 to-pink-600'
                  }`}>
                    ROYAL BIRD
                  </div>
                </span>
              </h1>
              <div className="relative">
                <h2 className={`text-5xl md:text-7xl font-light mb-2 transition-all duration-500 ${
                  theme === 'dark' ? 'text-gray-200' : 'text-slate-800'
                }`}>
                  Studios
                </h2>
                {/* Underline Effect */}
                <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 rounded-full transition-all duration-500 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500'
                }`} />
              </div>
            </div>

            <div className="space-y-6 mb-10">
              <div className="relative inline-block">
                <p className={`text-3xl md:text-4xl font-light leading-tight transition-all duration-500 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-slate-800'
                }`}>
                  Where{" "}
                  <span className="relative inline-block">
                    <span className={`relative z-10 bg-clip-text text-transparent font-bold transition-all duration-500 ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-blue-400 to-purple-400'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600'
                    }`}>
                      legends
                    </span>
                    <span
                      className={`absolute bottom-0 left-0 w-full h-1 rounded-full transform -rotate-1 transition-all duration-500 ${
                        theme === 'dark'
                          ? 'bg-gradient-to-r from-blue-500/40 to-purple-500/40'
                          : 'bg-gradient-to-r from-blue-500/30 to-purple-500/30'
                      }`}
                      aria-hidden="true"
                    />
                  </span>{" "}
                  come to life
                </p>
              </div>

              <div className="max-w-3xl mx-auto space-y-4">
                <p className={`text-xl md:text-2xl leading-relaxed font-light text-center transition-all duration-500 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-slate-700'
                }`}>
                  Immerse yourself in breathtaking comics that push the boundaries of imagination.
                </p>
                
                <div className="flex justify-center">
                  <p className={`font-light text-center max-w-2xl leading-relaxed transition-all duration-500 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
                  }`}>
                    From <span className={`font-semibold transition-all duration-500 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-slate-800'
                    }`}>timeless myths</span> to{" "}
                    <span className={`font-semibold transition-all duration-500 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-slate-800'
                    }`}>fearless new heroes</span>. 
                    Discover stories that{" "}
                    <span className={`font-semibold transition-all duration-500 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-slate-800'
                    }`}>thrill, inspire, and captivate</span>
                  </p>
                </div>
              </div>
            </div>
            
            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link href={'/comics'}>
                <button className={`group relative px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-500 transform hover:scale-105 hover:shadow-2xl flex items-center gap-3 overflow-hidden shadow-lg ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-purple-700 to-pink-700 hover:from-purple-600 hover:to-pink-600 text-white'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                }`}>
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <BookOpen className="w-6 h-6" />
                  Explore Our Library
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </Link>
              <Link href={'/about'}>
                <button className={`group relative px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-500 flex items-center gap-3 backdrop-blur-sm shadow-sm hover:shadow-md ${
                  theme === 'dark'
                    ? 'border-2 border-purple-500 text-purple-300 hover:bg-gray-800/50'
                    : 'border-2 border-purple-500 text-purple-600 hover:bg-purple-50 hover:border-purple-600'
                }`}>
                  Learn More
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className={`absolute top-1/4 left-1/4 w-3 h-3 rounded-full animate-float-slow shadow-sm ${
          theme === 'dark' ? 'bg-yellow-500' : 'bg-yellow-400'
        }`} />
        <div className={`absolute top-1/3 right-1/4 w-6 h-6 rounded-full animate-float-medium shadow-sm ${
          theme === 'dark' ? 'bg-pink-500' : 'bg-pink-400'
        }`} />
        <div className={`absolute bottom-1/3 left-1/5 w-4 h-4 rounded-full animate-float-fast shadow-sm ${
          theme === 'dark' ? 'bg-purple-500' : 'bg-purple-400'
        }`} />
        <div className={`absolute top-1/2 right-1/5 w-2 h-2 rounded-full animate-pulse shadow-sm ${
          theme === 'dark' ? 'bg-cyan-400' : 'bg-cyan-400'
        }`} />
        <div className={`absolute bottom-1/4 right-1/3 w-5 h-5 rounded-full animate-float-slow shadow-sm ${
          theme === 'dark' ? 'bg-orange-500' : 'bg-orange-400'
        }`} />
        
        {/* Large Floating Elements */}
        <div className={`absolute top-20 right-20 opacity-10 animate-float-very-slow ${
          theme === 'dark' ? 'text-blue-300' : 'text-blue-400'
        }`}>
          <BookOpen size={80} />
        </div>
        <div className={`absolute bottom-20 left-20 opacity-10 animate-float-very-slow ${
          theme === 'dark' ? 'text-purple-400' : 'text-purple-500'
        }`} style={{ animationDelay: '-2s' }}>
          <Sparkles size={60} />
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className={`w-6 h-10 border-2 rounded-full flex justify-center shadow-sm transition-all duration-500 ${
            theme === 'dark' ? 'border-blue-400/50' : 'border-blue-300'
          }`}>
            <div className={`w-1 h-3 rounded-full mt-2 animate-pulse transition-all duration-500 ${
              theme === 'dark' ? 'bg-blue-400' : 'bg-blue-400'
            }`} />
          </div>
        </div>
      </section>

      {/* Featured Comics */}
      <section className={`py-20 transition-all duration-500 ${currentBackgrounds.featured}`}>
        {/* Consistent Background Pattern */}
        <div className="absolute inset-0">
          <div className={`absolute inset-0 transition-all duration-500 ${
            theme === 'dark'
              ? 'bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-30'
              : 'bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:64px_64px] opacity-50'
          }`} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 transition-all duration-500 ${
              theme === 'dark' ? 'text-gray-100' : 'text-slate-800'
            }`}>
              Featured <span className={`bg-clip-text text-transparent transition-all duration-500 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-400 to-purple-400'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600'
              }`}>Comics</span>
            </h2>
            <p className={`text-lg max-w-2xl mx-auto transition-all duration-500 ${
              theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
            }`}>
              Dive into our curated selection of comics that showcase the best of storytelling and artistry.
            </p>
          </div>

          <div className="mb-16">
            <ComicCarousel />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {featuredComics.map((comic) => (
              <div key={comic.id} className={`group rounded-2xl overflow-hidden border transition-all duration-500 hover:transform hover:scale-105 shadow-sm hover:shadow-xl backdrop-blur-sm ${
                theme === 'dark'
                  ? 'bg-gray-800/40 border-gray-700/50 hover:border-purple-500/30'
                  : 'bg-white/90 border-slate-200/60 hover:border-blue-300/60'
              }`}>
                <div className={`relative h-80 overflow-hidden ${
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-gray-900/50 to-purple-900/30'
                    : 'bg-gradient-to-br from-blue-50/50 to-purple-50/50'
                }`}>
                  {comic.image ? (
                    <div className="absolute inset-0">
                      <Image
                        src={comic.image}
                        alt={comic.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className={`absolute inset-0 transition-all duration-500 ${
                        theme === 'dark'
                          ? 'bg-gradient-to-t from-gray-900/40 via-transparent to-transparent group-hover:from-gray-900/20'
                          : 'bg-gradient-to-t from-slate-900/20 via-transparent to-transparent group-hover:from-slate-900/10'
                      }`} />
                    </div>
                  ) : (
                    <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                      theme === 'dark'
                        ? 'bg-gradient-to-br from-gray-800/30 to-purple-900/20'
                        : 'bg-gradient-to-br from-blue-100/30 to-purple-100/30'
                    }`}>
                      <div className="text-center">
                        <BookOpen className={`w-16 h-16 mb-4 group-hover:scale-110 transition-transform duration-300 ${
                          theme === 'dark' ? 'text-blue-400/40' : 'text-blue-400/40'
                        }`} />
                        <p className={`text-sm font-medium transition-all duration-500 ${
                          theme === 'dark' ? 'text-blue-300/60' : 'text-blue-600/60'
                        }`}>Cover Art</p>
                      </div>
                    </div>
                  )}
                  
                  <div className={`absolute inset-0 flex items-end p-6 transition-opacity duration-300 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100'
                      : 'bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100'
                  }`}>
                    <Link href="/comics" className="w-full">
                      <button 
                        className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 transform shadow-md hover:shadow-lg translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 hover:scale-105 ${
                          theme === 'dark'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white'
                            : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                        }`}
                        disabled={comic.rating === "Coming soon"}
                      >
                        {comic.rating === "Coming soon" ? comic.rating+"!" : "Read Preview"}
                      </button>
                    </Link>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={`text-xl font-bold transition-all duration-500 group-hover:text-blue-500 ${
                      theme === 'dark' ? 'text-gray-100' : 'text-slate-800'
                    }`}>
                      {comic.title}
                    </h3>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-semibold">{comic.rating}</span>
                    </div>
                  </div>
                  <p className={`mb-4 leading-relaxed transition-all duration-500 group-hover:opacity-80 ${
                    theme === 'dark' ? 'text-gray-400 group-hover:text-gray-300' : 'text-slate-600 group-hover:text-slate-700'
                  }`}>
                    {comic.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/comics">
              <button className={`group px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-500 flex items-center gap-3 mx-auto backdrop-blur-sm hover:shadow-lg ${
                theme === 'dark'
                  ? 'border-2 border-blue-500 text-blue-300 hover:bg-gray-800/50'
                  : 'border-2 border-blue-500 text-blue-600 hover:bg-blue-50'
              }`}>
                View All Comics
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-20 transition-all duration-500 ${currentBackgrounds.features}`}>
        {/* Consistent Background Pattern */}
        <div className="absolute inset-0">
          <div className={`absolute inset-0 transition-all duration-500 ${
            theme === 'dark'
              ? 'bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20'
              : 'bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:64px_64px] opacity-30'
          }`} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 transition-all duration-500 ${
              theme === 'dark' ? 'text-gray-100' : 'text-slate-800'
            }`}>
              The <span className={`bg-clip-text text-transparent transition-all duration-500 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-gray-300 via-purple-400 to-pink-400'
                  : 'bg-gradient-to-r from-gray-800 via-purple-700 to-pink-600'
              }`}>Royal Bird</span> Experience
            </h2>
            <p className={`text-lg max-w-2xl mx-auto transition-all duration-500 ${
              theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
            }`}>
              Where epic storytelling meets breathtaking artistry in every panel
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="text-center group hover:transform hover:scale-105 transition-all duration-500">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 backdrop-blur-sm ${
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-blue-600/80 to-purple-700/80 text-white group-hover:shadow-xl border border-purple-500/20'
                    : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white group-hover:shadow-xl'
                }`}>
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-bold mb-3 transition-all duration-500 group-hover:text-blue-500 ${
                  theme === 'dark' ? 'text-gray-100' : 'text-slate-800'
                }`}>
                  {feature.title}
                </h3>
                <p className={`leading-relaxed transition-all duration-500 ${
                  theme === 'dark' ? 'text-gray-400 group-hover:text-gray-300' : 'text-slate-600 group-hover:text-slate-700'
                }`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={`py-20 transition-all duration-500 ${currentBackgrounds.testimonials}`}>
        {/* Consistent Background Pattern */}
        <div className="absolute inset-0">
          <div className={`absolute inset-0 transition-all duration-500 ${
            theme === 'dark'
              ? 'bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-25'
              : 'bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:64px_64px] opacity-40'
          }`} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 transition-all duration-500 ${
              theme === 'dark' ? 'text-gray-100' : 'text-slate-800'
            }`}>
              What <span className={`bg-clip-text text-transparent transition-all duration-500 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-400 to-purple-400'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600'
              }`}>Readers Say</span>
            </h2>
            <p className={`text-lg max-w-2xl mx-auto transition-all duration-500 ${
              theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
            }`}>
              Discover why thousands of readers love our authentic stories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className={`rounded-2xl p-6 border transition-all duration-300 shadow-sm hover:shadow-lg group backdrop-blur-sm ${
                theme === 'dark'
                  ? 'bg-gray-800/40 border-gray-700/50 hover:border-purple-500/30'
                  : 'bg-white/90 border-slate-200/60 hover:border-blue-300/60'
              }`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform duration-300 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-br from-blue-600 to-purple-700 text-white'
                      : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                  }`}>
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className={`font-bold transition-all duration-500 group-hover:text-blue-400 ${
                      theme === 'dark' ? 'text-gray-100' : 'text-slate-800'
                    }`}>
                      {testimonial.name}
                    </h4>
                    <p className={`text-sm font-medium transition-all duration-500 ${
                      theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                    }`}>{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className={`italic leading-relaxed transition-all duration-500 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
                }`}>&quot;{testimonial.content}&quot;</p>
                
                <div className={`absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 rounded-tr-2xl transition-all duration-500 ${
                  theme === 'dark'
                    ? 'border-blue-500/20 group-hover:border-blue-500/40'
                    : 'border-blue-500/20 group-hover:border-blue-500/40'
                }`} />
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className={`inline-flex items-center gap-6 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-sm border transition-all duration-500 ${
              theme === 'dark'
                ? 'bg-gray-800/40 border-gray-700/50'
                : 'bg-white/80 border-slate-200/60'
            }`}>
              <div className="text-center">
                <div className={`text-2xl font-bold transition-all duration-500 ${
                  theme === 'dark' ? 'text-gray-100' : 'text-slate-800'
                }`}>4.9/5</div>
                <div className={`text-sm transition-all duration-500 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
                }`}>Average Rating</div>
              </div>
              <div className={`w-px h-8 transition-all duration-500 ${
                theme === 'dark' ? 'bg-gray-600/60' : 'bg-slate-300/60'
              }`}></div>
              <div className="text-center">
                <div className={`text-2xl font-bold transition-all duration-500 ${
                  theme === 'dark' ? 'text-gray-100' : 'text-slate-800'
                }`}>10K+</div>
                <div className={`text-sm transition-all duration-500 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
                }`}>Happy Readers</div>
              </div>
              <div className={`w-px h-8 transition-all duration-500 ${
                theme === 'dark' ? 'bg-gray-600/60' : 'bg-slate-300/60'
              }`}></div>
              <div className="text-center">
                <div className={`text-2xl font-bold transition-all duration-500 ${
                  theme === 'dark' ? 'text-gray-100' : 'text-slate-800'
                }`}>50+</div>
                <div className={`text-sm transition-all duration-500 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
                }`}>Stories Told</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 transition-all duration-500 ${currentBackgrounds.cta}`}>
        {/* Consistent Background Pattern */}
        <div className="absolute inset-0">
          <div className={`absolute inset-0 transition-all duration-500 ${
            theme === 'dark'
              ? 'bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] opacity-30'
              : 'bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-60'
          }`} />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className={`max-w-4xl mx-auto rounded-3xl p-12 border shadow-xl transition-all duration-500 backdrop-blur-sm ${
            theme === 'dark'
              ? 'bg-gray-800/40 border-gray-700/50'
              : 'bg-white/90 border-blue-200/60'
          }`}>
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 transition-all duration-500 ${
              theme === 'dark' ? 'text-gray-100' : 'text-slate-800'
            }`}>
              Ready to Begin Your <span className={`bg-clip-text text-transparent transition-all duration-500 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-400 to-purple-400'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600'
              }`}>Journey</span>?
            </h2>
            <p className={`text-xl mb-8 max-w-2xl mx-auto transition-all duration-500 ${
              theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
            }`}>
              Join thousands of readers discovering rich storytelling heritages through our comics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className={`px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-sm ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-600/90 to-purple-600/90 hover:from-blue-500 hover:to-purple-500 text-white border border-blue-500/30'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
              }`}>
                Start Reading Free
              </button>
              <button className={`border-2 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:shadow-lg backdrop-blur-sm ${
                theme === 'dark'
                  ? 'border-blue-500 text-blue-300 hover:bg-gray-800/50'
                  : 'border-blue-500 text-blue-600 hover:bg-blue-50'
              }`}>
                Learn Our Story
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}