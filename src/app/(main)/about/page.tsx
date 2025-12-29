import { Star, Users, Globe, Sparkles, BookOpen, Film, Target, MapPin, Phone, Mail, Send, ArrowRight, Zap, Palette, Rocket } from 'lucide-react';

export default function AboutPage() {

  const values = [
    {
      icon: <Zap className="w-12 h-12" />,
      title: "BOLD CREATIVITY",
      description: "We embrace the unconventional. Every panel, every frame is a rebellion against the ordinary."
    },
    {
      icon: <Palette className="w-12 h-12" />,
      title: "VISUAL REVOLUTION",
      description: "Merging ancestral patterns with cyberpunk aesthetics. Creating visual languages never seen before."
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "COMMUNITY MAGIC",
      description: "Our stories are born from collective dreams. Every reader becomes part of our creative constellation."
    },
    {
      icon: <Rocket className="w-12 h-12" />,
      title: "ANCESTRY",
      description: "Honoring the past while building tomorrow. We're the bridge between ancient wisdom and future visions."
    }
  ];

  const studioStats = [
    { number: "120", label: "PAGES OF PURE MAGIC", icon: <BookOpen className="w-8 h-8" /> },
    { number: "15", label: "CHARACTERS BREATHING LIFE", icon: <Users className="w-8 h-8" /> },
    { number: "3", label: "WORLDS WAITING TO BE EXPLORED", icon: <Globe className="w-8 h-8" /> },
    { number: "∞", label: "STORIES YET UNTOLD", icon: <Sparkles className="w-8 h-8" /> }
  ];

  return (
    <main className="min-h-screen bg-blue-50/40 overflow-hidden">
      {/* Hero Section - Full Screen Art Experience */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-contain bg-center"
            style={{
              backgroundImage:
                "url('https://velgg90lgs.ufs.sh/f/ymmBhW7qEDZCirLamEpXG9cToa4EOsCnyL3BVWvR1M0ZUd7e')",
            }}
          />

          {/* Optional overlay for readability / mood */}
          {/* Readability gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />

          {/* Subtle animated glow accents (optional, toned down) */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Floating Comic Elements */}
        <div className="absolute top-20 left-20 opacity-20 animate-float-slow">
          <BookOpen size={120} className="text-blue-300" />
        </div>
        <div className="absolute bottom-32 right-32 opacity-20 animate-float-medium">
          <Film size={100} className="text-purple-300" />
        </div>
        <div className="absolute top-40 right-40 opacity-15 animate-float-fast">
          <Sparkles size={80} className="text-pink-300" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-6xl mx-auto flex flex-col gap-6">
            {/* Massive Main Title */}
            <h1 className="text-3xl md:text-6xl lg:text-7xl font-black mb-6 leading-none opacity-80">
              <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-blue-400 bg-clip-text text-transparent">
                Our story
              </span>
            </h1>
            
            {/* Subtitle with Glow */}
            {/* <div className="relative inline-block mb-10">
              <p className="text-3xl md:text-5xl text-white font-semibold tracking-widest">
                Our Story
              </p>
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-sm" />
            </div> */}

            {/* Studio Tagline */}
            <div className="max-w-4xl mx-auto ">
              <p
                className="
                  text-xl md:text-2xl
                  text-slate-100
                  font-light
                  leading-relaxed
                  drop-shadow-[0_6px_30px_rgba(0,0,0,0.25)]
                "
                style={{
                  WebkitTextStroke: '0.6px rgba(0,0,0,0.25)',
                }}
              >
                We&apos;re an animation and comic studio inspired by African storytelling. We craft universes that breathe,
                characters that feel, and stories that ignite the soul. Welcome to the revolution of African storytelling.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button className="group relative bg-white/10 backdrop-blur-md border-2 border-white/20 hover:border-white/40 text-white px-12 py-6 rounded-full font-bold text-xl transition-all duration-500 transform hover:scale-110 hover:shadow-2xl flex items-center gap-4">
                <Zap className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                EXPLORE OUR WORLDS
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Manifesto Section */}
      <section className="relative py-32 bg-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.3)_1px,transparent_0)] bg-[length:64px_64px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Section Title */}
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-8">
                OUR <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">MANIFESTO</span>
              </h2>
              <div className="w-48 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-12" />
            </div>

            {/* Vision & Mission Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32">
              {/* Vision Card */}
              <div className="group relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl" />
                <div className="relative h-[380px] bg-white rounded-2xl p-12 border-2 border-slate-100 hover:border-blue-200 transition-all duration-500 group-hover:shadow-2xl">
                  <div className="text-6xl mb-6">👁️</div>
                  <h3 className="text-4xl font-black text-slate-900 mb-5">
                    VISION
                  </h3>
                  <p className="text-xl text-slate-700 leading-relaxed font-light">
                    To use the raw power of storytelling to <span className="font-black text-blue-600">enlighten, inspire, and connect</span> souls across generations through shared experiences of pure wonder.
                  </p>
                </div>
              </div>

              {/* Mission Card */}
              <div className="group relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl" />
                <div className="relative h-[380px] bg-white rounded-2xl p-12 border-2 border-slate-100 hover:border-purple-200 transition-all duration-500 group-hover:shadow-2xl">
                  <div className="text-6xl mb-6">🎯</div>
                  <h3 className="text-4xl font-black text-slate-900 mb-5">
                    MISSION
                  </h3>
                  <p className="text-xl text-slate-700 leading-relaxed font-light">
                    We forge <span className="font-black text-purple-600">captivating comic volumes and animated films</span> that resonate with every generation, sparking insatiable curiosity and expanding the very boundaries of imagination.
                  </p>
                </div>
              </div>
            </div>

            {/* Studio Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {studioStats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="text-5xl md:text-6xl font-black text-slate-900 mb-4 group-hover:scale-110 transition-transform duration-500">
                    {stat.number}
                  </div>
                  <div className="text-sm text-slate-600 font-semibold tracking-widest uppercase">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative py-32 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 overflow-hidden">
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 opacity-5">
          <Zap size={200} className="text-blue-400" />
        </div>
        <div className="absolute bottom-10 right-10 opacity-5">
          <Palette size={180} className="text-purple-400" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-8">
              OUR <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">CREED</span>
            </h2>
            <p className="text-2xl text-slate-600 max-w-4xl mx-auto font-light">
              The uncompromising principles that guide every stroke, every word, every frame we create
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <div key={index} className="group text-center lg:text-left">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                  <div className="w-22 h-22 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-2xl">
                    {value.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-500">
                      {value.title}
                    </h3>
                    <p className="text-xl text-slate-700 leading-relaxed font-light">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-7xl md:text-8xl font-black text-white mb-8">
                LET&apos;S <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">CREATE</span>
              </h2>
              <p className="text-2xl text-white/60 max-w-4xl mx-auto font-light">
                Ready to birth new worlds together? Let&apos;s make magic happen.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-5xl max-h-3xl mx-auto">
              {/* Contact Info */}
              <div className="space-y-8">
                <div className="group flex items-center gap-7 p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-all duration-500">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                    <Phone className="w-8 h-8 text-blue-300" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white mb-2">CALL THE STUDIO</h3>
                    <p className="text-xl text-blue-200 font-semibold">0703 821 3288</p>
                  </div>
                </div>

                <div className="group flex items-center gap-7 p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-all duration-500">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-purple-300" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white mb-2">VISIT OUR SANCTUARY</h3>
                    <p className="text-lg text-purple-200">
                      21 Joseph Waku Street<br />
                      3th Avenue, gwarinpa<br />
                      Abuja, Nigeria
                    </p>
                  </div>
                </div>

                <div className="group flex items-center gap-7 p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-all duration-500">
                  <div className="w-16 h-16 bg-pink-500/20 rounded-2xl flex items-center justify-center">
                    <Mail className="w-8 h-8 text-pink-300" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white mb-2">SEND A MESSAGE</h3>
                    <p className="text-lg text-pink-200">hello@royalbirdstudios.com</p>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                <h3 className="text-2xl text-center font-black text-white mb-8">GET IN TOUCH</h3>
                <form className="space-y-6">
                  <div>
                    <input 
                      type="text" 
                      placeholder="YOUR FULL NAME"
                      className="w-full px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 font-semibold text-lg focus:outline-none focus:border-blue-400 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <input 
                      type="email" 
                      placeholder="YOUR EMAIL ADDRESS"
                      className="w-full px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 font-semibold text-lg focus:outline-none focus:border-purple-400 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <textarea 
                      placeholder="TELL US ABOUT YOUR VISION..."
                      rows={4}
                      className="w-full px-6 py-2 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 font-semibold text-lg focus:outline-none focus:border-pink-400 transition-all duration-300 resize-none"
                    />
                  </div>
                  <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-2xl font-black text-xl transition-all duration-500 transform hover:scale-105 flex items-center justify-center gap-4">
                    Send a Message
                    <Rocket className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}


      {/* Team Section */}
      {/* <section className="relative py-32 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8">
              MEET THE <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">DREAM TEAM</span>
            </h2>
            <p className="text-2xl text-slate-600 max-w-4xl mx-auto font-light">
              The mad geniuses, visual poets, and story shamans who breathe life into our worlds
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {teamMembers.map((member, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-500 blur-lg" />
                <div className="relative bg-white rounded-2xl p-8 border-2 border-slate-100 group-hover:border-blue-200 transition-all duration-500 group-hover:shadow-2xl">
                  <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                    // Avatar 
                    <div className="relative">
                      <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-black shadow-2xl">
                        {member.name.charAt(0)}
                      </div>
                      <div className="absolute -inset-4 border-2 border-transparent rounded-full group-hover:border-blue-500/30 transition-all duration-500" />
                    </div>
                    
                   // Content
                    <div className="flex-1 text-center lg:text-left">
                      <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
                        {member.name}
                      </h3>
                      <p className="text-blue-600 font-black text-lg mb-3 tracking-widest">
                        {member.role}
                      </p>
                      <p className="text-slate-700 mb-4 leading-relaxed font-light">
                        {member.bio}
                      </p>
                      <div className="inline-block bg-slate-100 rounded-full px-4 py-2">
                        <span className="text-sm text-slate-600 font-semibold">
                          {member.specialty}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}