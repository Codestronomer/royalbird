"use client"
// import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from 'react';

// import { auth } from "~/server/better-auth";
// import { getSession } from "~/server/better-auth/server";
import Image from "next/image";
import TikTok from '../../public/tiktok.svg';
import Threads from '../../public/threads.svg';

import ComicCarousel from '../../components/carousel';
import Footer from '../../components/footer';
import { ArrowRight, BookOpen,  Globe, Heart, Play, Sparkles, Star, Users} from "lucide-react";

export default function Home() {
  // const session = await getSession();

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
      image: "https://globalcomix-comics-assets-files-desktop.nyc3.cdn.digitaloceanspaces.com/26717/7197930_8a65918365201842a63b8f1886bb639f.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=TRO77LWUBQ62LDGV44EB/20251212/us-east-1/s3/aws4_request&X-Amz-Date=20251212T011329Z&X-Amz-Expires=86430&X-Amz-SignedHeaders=host&X-Amz-Signature=58a819fd508c81b94f75b959380d8b2e83b556f86b574927b96d0ae9bb8f961e",
      rating: 4.9
    },
    {
      id: 3,
      title: "Sundiata",
      description: "The epic of the King who founded the Mali Empire",
      image: "https://velgg90lgs.ufs.sh/f/ymmBhW7qEDZC1LKjpK0Pvwy56lfshgk8Vpqr3K9ZYtuG2jzb",
      rating: 4.7
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
      content: "The quality and attention to cultural detail sets Royalbird Studios apart. Absolutely stunning work.",
      avatar: "/avatar3.jpg"
    }
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
        {/* Enhanced Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.08),rgba(255,255,255,0))]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_30%_70%,rgba(139,92,246,0.05),rgba(255,255,255,0))]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
        </div>

        <div className="relative z-20 container mx-auto px-4 text-center">
          <div className="max-w-5xl mx-auto">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-full px-6 py-3 mb-8 shadow-lg animate-fade-in">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-blue-700 font-medium">BREACH Issue #2 out now!</span>
            </div>

            {/* Enhanced Main Heading */}
            <div className="relative mb-8">
              <h1 className="text-7xl md:text-9xl font-black tracking-tight mb-4">
                <span className="bg-gradient-to-r from-gray-800 via-purple-700 to-pink-600 bg-clip-text text-transparent relative">
                  ROYALBIRD
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-purple-700 to-pink-600 bg-clip-text text-transparent blur-sm opacity-15 -z-10">
                    ROYALBIRD
                  </div>
                </span>
              </h1>
              <div className="relative">
                <h2 className="text-5xl md:text-7xl font-light text-slate-800 mb-2">
                  Studios
                </h2>
                {/* Underline Effect */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
              </div>
            </div>

            <div className="space-y-6 mb-10">
              <div className="relative inline-block">
                <p className="text-3xl md:text-4xl text-slate-800 font-light leading-tight">
                  Where{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
                      legends
                    </span>
                    <span
                      className="absolute bottom-0 left-0 w-full h-1
                                bg-gradient-to-r from-blue-500/30 to-purple-500/30
                                rounded-full transform -rotate-1"
                      aria-hidden="true"
                    />
                  </span>{" "}
                  come to life
                </p>
              </div>

              <div className="max-w-3xl mx-auto space-y-4">
                <p className="text-xl md:text-2xl text-slate-700 leading-relaxed font-light text-center">
                  Immerse yourself in breathtaking comics that push the boundaries of imagination.
                </p>
                
                <div className="flex justify-center">
                  <p className="text-slate-600 font-light text-center max-w-2xl leading-relaxed">
                    From <span className="font-semibold text-slate-800">timeless myths</span> to{" "}
                    <span className="font-semibold text-slate-800">fearless new heroes</span>. 
                    Discover stories that{" "}
                    <span className="font-semibold text-slate-800">thrill, inspire, and captivate</span>
                  </p>
                </div>
              </div>
            </div>
            
            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button className="group relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-500 transform hover:scale-105 hover:shadow-2xl flex items-center gap-3 overflow-hidden shadow-lg">
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <BookOpen className="w-6 h-6" />
                Explore Our Library
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              
              <button className="group relative border-2 border-purple-500 text-purple-600 hover:bg-purple-50 hover:border-purple-600 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-500 flex items-center gap-3 backdrop-blur-sm shadow-sm hover:shadow-md">
                Learn More
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-yellow-400 rounded-full animate-float-slow shadow-sm" />
        <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-pink-400 rounded-full animate-float-medium shadow-sm" />
        <div className="absolute bottom-1/3 left-1/5 w-4 h-4 bg-purple-400 rounded-full animate-float-fast shadow-sm" />
        <div className="absolute top-1/2 right-1/5 w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-sm" />
        <div className="absolute bottom-1/4 right-1/3 w-5 h-5 bg-orange-400 rounded-full animate-float-slow shadow-sm" />
        
        {/* Large Floating Elements */}
        <div className="absolute top-20 right-20 opacity-10 animate-float-very-slow">
          <BookOpen size={80} className="text-blue-400" />
        </div>
        <div className="absolute bottom-20 left-20 opacity-10 animate-float-very-slow" style={{ animationDelay: '-2s' }}>
          <Sparkles size={60} className="text-purple-500" />
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-blue-300 rounded-full flex justify-center shadow-sm">
            <div className="w-1 h-3 bg-blue-400 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Featured Comics */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50/80">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Featured <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Comics</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Dive into our curated selection of comics that showcase the best of storytelling and artistry.
            </p>
          </div>

          <div className="mb-16">
            <ComicCarousel />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {featuredComics.map((comic) => (
              <div key={comic.id} className="group bg-white rounded-2xl overflow-hidden border border-slate-200/60 hover:border-blue-300/60 transition-all duration-500 hover:transform hover:scale-105 shadow-sm hover:shadow-xl">
                <div className="relative h-80 bg-gradient-to-br from-blue-50/50 to-purple-50/50 overflow-hidden">
                  {comic.image ? (
                    <div className="absolute inset-0">
                      <Image
                        src={comic.image}
                        alt={comic.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent group-hover:from-slate-900/10 transition-all duration-500" />
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100/30 to-purple-100/30">
                      <div className="text-center">
                        <BookOpen className="w-16 h-16 text-blue-400/40 mb-4 group-hover:scale-110 transition-transform duration-300" />
                        <p className="text-blue-600/60 text-sm font-medium">Cover Art</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-slate-800 px-3 py-1 rounded-full text-sm font-semibold z-10 shadow-md border border-slate-200/50 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {comic.rating}
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    {/* <button className="w-full bg-white/90 backdrop-blur-sm text-slate-800 py-3 rounded-lg font-semibold transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 hover:bg-white hover:scale-105">
                      Read Preview
                    </button> */}
                    <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform shadow-md hover:shadow-lg translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 hover:bg-white hover:scale-105">
                    Read Preview
                  </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors duration-300">
                      {comic.title}
                    </h3>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-semibold">{comic.rating}</span>
                    </div>
                  </div>
                  <p className="text-slate-600 mb-4 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
                    {comic.description}
                  </p>
                  {/* <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                    Read Preview
                  </button> */}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/comics">
              <button className="group border-2 border-blue-500 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-500 flex items-center gap-3 mx-auto backdrop-blur-sm hover:shadow-lg">
                View All Comics
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              The <span className="bg-gradient-to-r from-gray-800 via-purple-700 to-pink-600 bg-clip-text text-transparent">Royalbird</span> Experience
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Where epic storytelling meets breathtaking artistry in every panel
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="text-center group hover:transform hover:scale-105 transition-all duration-500">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              What <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Readers Say</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Discover why thousands of readers love our authentic stories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border border-slate-200/60 hover:border-blue-300/60 transition-all duration-300 shadow-sm hover:shadow-lg group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition-transform duration-300">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors duration-300">
                      {testimonial.name}
                    </h4>
                    <p className="text-blue-600 text-sm font-medium">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 italic leading-relaxed">&quot;{testimonial.content}&quot;</p>
                
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-500/20 rounded-tr-2xl transition-all duration-300 group-hover:border-blue-500/40" />
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-6 bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-sm border border-slate-200/60">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800">4.9/5</div>
                <div className="text-sm text-slate-600">Average Rating</div>
              </div>
              <div className="w-px h-8 bg-slate-300/60"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800">10K+</div>
                <div className="text-sm text-slate-600">Happy Readers</div>
              </div>
              <div className="w-px h-8 bg-slate-300/60"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800">50+</div>
                <div className="text-sm text-slate-600">Stories Told</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-12 border border-blue-200/60 shadow-xl">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              Ready to Begin Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Journey</span>?
            </h2>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Join thousands of readers discovering rich storytelling heritages through our comics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                Start Reading Free
              </button>
              <button className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:shadow-lg">
                Learn Our Story
              </button>
            </div>
          </div>
        </div>
      </section>
      
          {/* <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-2xl text-white">
              {session && <span>Logged in as {session.user?.name}</span>}
            </p>
            {!session ? (
              <form>
                <button
                  className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
                  formAction={async () => {
                  "use server";
                    const res = await auth.api.signInSocial({
                      body: {
                        provider: "github",
                        callbackURL: "/",
                      },
                    });
                    if (!res.url) {
                      throw new Error("No URL returned from signInSocial");
                    }
                    redirect(res.url);
                  }}
                >
                  Sign in
                </button>
              </form> 
            ) : (
              <form>
                <button
                  className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
                  formAction={async () => {
                    // "use server";
                    await auth.api.signOut({
                      headers: await headers(),
                    });
                    redirect("/");
                  }}
                >
                  Sign out
                </button>
              </form>
            )}
          </div> */}
    </main>
  );
}
