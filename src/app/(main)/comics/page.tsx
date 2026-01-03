'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { 
  Filter, Search, Star, BookOpen, Sparkles, Zap, ChevronDown, 
  ArrowRight, Heart, Eye, Loader2, Grid, List, CheckCircle2
} from 'lucide-react'
import Image from 'next/image';

import ComicDetailModal from '~/components/comic/comicDetailPage'
import { useComicModal } from '~/hooks/useComicModal'
import { api } from '~/lib/api'
import type { ApiGenre, Comic } from '~/types/comics'
import { transformComic } from '~/lib/utils'
import toast from 'react-hot-toast';

const sortOptions = [
  { label: 'Newest First', value: '-publishedAt' },
  { label: 'Most Popular', value: '-views' },
  { label: 'Highest Rated', value: '-averageRating' },
  { label: 'A to Z', value: 'title' }
]

export default function ComicsPage() {
  const { selectedComic, isModalOpen, openModal, closeModal, navigateToComic } = useComicModal()
  
  // States
  const [comics, setComics] = useState<Comic[]>([])
  const [genres, setGenres] = useState<ApiGenre[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [sortBy, setSortBy] = useState('-publishedAt')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  // 1. Load Genres once
  useEffect(() => {
    const fetchGenres = async () => {
      const res = await api.getComicGenres()
      if (res.success) setGenres(res.data)
    }
    fetchGenres().catch(console.error)
  }, [])

  // 2. Load Comics Logic
  const fetchComics = useCallback(async (isInitial = true) => {
    try {
      if (isInitial) setLoading(true); else setLoadingMore(true)
      
      const currentPage = isInitial ? 1 : page
      const response = await api.getComics({
        page: currentPage.toString(),
        limit: '12',
        sort: sortBy,
        status: 'published',
        ...(selectedGenre && { genre: selectedGenre }),
        ...(searchQuery && { search: searchQuery })
      })
      
      if (response.success) {
        const transformed = response.data.map(transformComic)
        setComics(prev => isInitial ? transformed : [...prev, ...transformed])
        if (response.pagination) setHasMore(currentPage < response.pagination.pages)
      }
    } catch (error) {
      toast.error('Failed to load comics')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [page, sortBy, selectedGenre, searchQuery])

  useEffect(() => {
    fetchComics(true).catch(console.error)
  }, [sortBy, selectedGenre])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchComics(true).catch(console.error)
  }

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) setPage(prev => prev + 1)
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Offset by 100px to account for the sticky filter bar
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (loading && page === 1) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Entering the Library...</p>
      </main>
    )
  }

  return (
    <>
      <main className="min-h-screen bg-white overflow-hidden">
        {/* HERO SECTION (Same as Previous Version) */}
        <section className="relative py-20 overflow-hidden min-h-[80vh] flex items-center">
          <div className="absolute inset-0">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105" 
              style={{ backgroundImage: 'url("https://velgg90lgs.ufs.sh/f/ymmBhW7qEDZCLHF0mkZYQ9joXds68g5cJSwp3CuRxOf74iNz")' }} 
            />
            {/* Darkened the overlay slightly for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 via-purple-900/80 to-slate-950/90" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15)_1px,transparent_2px)] bg-[length:24px_24px] opacity-20" />
          </div>

          <div className="relative z-10 container mx-auto px-4 text-center lg:text-left">
            <div className="max-w-6xl mx-auto">
              {/* Badge: Increased contrast and border visibility */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/30 rounded-full px-6 py-3 mb-10 animate-fade-in-up shadow-2xl">
                <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-xs md:text-sm text-white font-bold tracking-[0.2em] uppercase">
                  Africa&apos;s Digital Comic Hub
                </span>
              </div>

              {/* Heading: Used higher-stop gradients and drop shadows */}
              <h1 className="text-7xl md:text-8xl lg:text-[11rem] font-black mb-8 leading-[0.85] tracking-tighter">
                <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-[0_5px_15px_rgba(0,0,0,0.3)]">
                  COMIC
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-100 via-white to-pink-100 bg-clip-text text-transparent drop-shadow-[0_5px_15px_rgba(0,0,0,0.3)]">
                  LIBRARY
                </span>
              </h1>

              {/* Description: Switched from white/80 to gray-100 for crispness */}
              <p className="text-md md:text-xl text-gray-100 max-w-2xl leading-relaxed mb-12 font-medium drop-shadow-md">
                Dive into cyberpunk futures and ancient myths.  
                <span className="text-blue-300 mt-2"> Discover stories that push the boundaries of imagination.</span>
              </p>

              {/* Button: More vibrant gradient and glow */}
              <button className="group relative px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 rounded-full font-bold text-white transition-all duration-300 shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)]">
                <span className="relative flex items-center gap-3 text-lg">
                  Explore Stories 
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* STICKY FILTER BAR (Merged Look) */}
        <section id="genres" className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/60 py-4 shadow-sm">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={() => setSelectedGenre('')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${!selectedGenre ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-100 border-slate-200 text-slate-700 hover:border-blue-200'}`}
              >
                All
              </button>
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => setSelectedGenre(genre.slug)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${selectedGenre === genre.slug ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-100 border-slate-200 text-slate-700 hover:border-blue-200'}`}
                >
                  <span className="font-semibold text-sm">{genre.name}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search comics..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-full focus:ring-2 focus:ring-blue-200 outline-none"
                />
              </form>
              <div className="relative">
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 bg-white border border-slate-300 rounded-full text-sm font-semibold outline-none"
                >
                  {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED SECTION */}
        {comics.some(c => c.featured) && !selectedGenre && !searchQuery && (
          <section className="py-20 bg-gradient-to-b from-white to-slate-50/50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-black text-slate-800">
                  Featured <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Series</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-7xl mx-auto">
                {comics.filter(c => c.featured).slice(0, 2).map((comic) => (
                  <button key={comic.id} onClick={() => openModal(comic)} className="group text-left focus:outline-none">
                    {/* Increased min-height to 450px and added a subtle scale effect */}
                    <div className="relative bg-white rounded-[2rem] overflow-hidden border border-slate-200 hover:border-blue-300/50 transition-all duration-500 hover:shadow-2xl flex flex-col md:flex-row min-h-[450px]">
                      
                      {/* Left/Top: Image Side - Increased mobile height and set width to 45% on desktop */}
                      <div className="relative h-80 md:h-auto md:w-[45%] overflow-hidden bg-slate-100">
                        <Image 
                          src={comic.coverImage} 
                          alt={comic.title} 
                          fill 
                          className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                        <div className="absolute top-6 left-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full px-5 py-2.5 shadow-lg">
                          <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase">FEATURED</span>
                        </div>
                      </div>

                      {/* Right/Bottom: Content Side - Added more padding for the taller layout */}
                      <div className="p-10 md:w-[55%] flex flex-col justify-between bg-white relative">
                        {/* Background Accent */}
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                          <Sparkles size={120} className="text-purple-600" />
                        </div>

                        <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-6">
                            <span className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border border-blue-100">
                              {comic.genres[0]?.name ?? 'Story'}
                            </span>
                            <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                              <Star className="w-4 h-4 fill-current" /> 
                              <span className="font-black text-sm">{comic.rating}</span>
                            </div>
                          </div>

                          <h3 className="text-3xl font-black text-slate-800 mb-6 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                            {comic.title}
                          </h3>
                          
                          <p className="text-slate-500 text-base leading-relaxed mb-8 line-clamp-4 font-medium">
                            {comic.description}
                          </p>
                        </div>

                        <div className="relative z-10 flex items-center justify-between pt-6 border-t border-slate-50">
                          <div className="flex items-center gap-4 text-slate-400">
                            <span className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
                              <BookOpen className="w-4 h-4 text-blue-500" /> 
                              {comic.totalPages} Pages
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-[0.15em] group-hover:gap-4 transition-all">
                            Read Preview 
                            <ArrowRight className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ALL COMICS GRID (Merged Aesthetic) */}
        <section className="py-20 bg-white" id="comics">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-slate-800">All <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Comics</span></h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 max-w-7xl mx-auto">
              {comics.map((comic) => (
                <button key={comic.id} onClick={() => openModal(comic)} className="group text-left focus:outline-none">
                  <div className="relative bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-400/50 transition-all duration-500 hover:transform hover:scale-[1.02] hover:shadow-xl">
                    <div className="relative h-80 overflow-hidden">
                      <Image src={comic.coverImage} alt={comic.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      {/* Status Tag */}
                      <div className="absolute top-4 left-4 bg-blue-600/90 backdrop-blur-sm rounded-full px-3 py-1">
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">{comic.availability}</span>
                      </div>
                      
                      {/* Rating Overlay */}
                      <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md rounded-full px-2 py-1 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-bold text-white">{comic.rating}</span>
                      </div>

                      {/* Stats Overlay */}
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between text-white/90 text-[10px] font-bold">
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-blue-400" /> {comic.views?.toLocaleString()}</span>
                        <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-red-400" /> {comic.readers?.toLocaleString()}</span>
                        <span className="flex items-center gap-1"><BookOpen className="w-3 h-3 text-green-400" /> {comic.totalPages} PGS</span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 block">{comic.genres[0]?.name}</span>
                     <h3 className="text-3xl font-black text-slate-800 mb-6 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">{comic.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-4">{comic.description}</p>
                      <div className="h-px bg-slate-100 w-full mb-4" />
                      <div className="flex items-center justify-between">
                         <div className="flex gap-1">
                            {comic.tags?.slice(0, 2).map(tag => (
                              <span key={tag} className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">#{tag}</span>
                            ))}
                         </div>
                         <div>
                         <span className="font-black text-slate-800 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                          Read
                         </span>
                          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                         </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-16">
                <button 
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="group relative bg-slate-900 hover:bg-blue-600 text-white px-12 py-5 rounded-2xl font-bold text-sm transition-all flex items-center gap-3 mx-auto disabled:bg-slate-300"
                >
                  {loadingMore ? <Loader2 className="w-5 h-5 animate-spin" /> : 'LOAD MORE COMICS'}
                  {!loadingMore && <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />}
                </button>
              </div>
            )}
          </div>
        </section>
        {/* CTA Section */}
        <section className="py-18 relative overflow-hidden">
          {/* Background with Brand Gradient */}
          <div className="absolute inset-0 bg-[#0f172a]" />
          
          {/* Animated Decorative Circles */}
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto bg-white/(0.03) backdrop-blur-xl border border-white/10 rounded-[3rem] p-6 md:p-12 text-center">
              
                {/* Icon Badge */}
                {/* <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 mb-8 shadow-2xl shadow-blue-500/20">
                  <Sparkles className="w-10 h-10 text-white" />
                </div> */}

              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                Ready to start your <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  next adventure?
                </span>
              </h2>

              <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-8 font-medium leading-relaxed">
                Join thousands of readers discovering the best in African-inspired digital comics. 
                New issues and series added regularly.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                {/* Primary Action */}

                <button 
                  onClick={() => scrollToSection('comics')}
                  className="group relative px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Start Reading Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>

                {/* View All Genres -> Goes to Genre Filter Bar */}
                <button 
                  onClick={() => scrollToSection('genres')}
                  className="px-10 py-5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-black text-sm uppercase tracking-widest transition-all"
                >
                  View All Genres
                </button>
              </div>

              {/* Trust Badges / Stats */}
              <div className="mt-16 pt-8 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <p className="text-2xl font-black text-white mb-1">1k+</p>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Active Readers</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-white mb-1">3+</p>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Comics</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-white mb-1">4.9/5</p>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Avg Rating</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-white mb-1">100+</p>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Pages</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Subtle Bottom Glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        </section>
      </main>

      {selectedComic && (
        <ComicDetailModal
          comic={selectedComic}
          isOpen={isModalOpen}
          onClose={closeModal}
          onNavigate={(direction) => navigateToComic(direction, comics)}
          hasPrevious={comics.findIndex(c => c.id === selectedComic.id) > 0}
          hasNext={comics.findIndex(c => c.id === selectedComic.id) < comics.length - 1}
        />
      )}
    </>
  )
}