'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Heart, 
  Bookmark, 
  Eye, 
  Users, 
  Star, 
  BookOpen, 
  Clock, 
  Calendar,
  Sparkles
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import ShareButtons from '~/components/blog/shareButtons'
import { useTheme } from '~/hooks/useTheme'
import type { ApiGenre, Comic } from '~/types/comics'

interface ComicDetailModalProps {
  comic: Comic
  isOpen: boolean
  onClose: () => void
  onNavigate?: (direction: 'prev' | 'next') => void
  hasPrevious?: boolean
  hasNext?: boolean
}

export default function ComicDetailModal({
  comic,
  isOpen,
  onClose,
  onNavigate,
  hasPrevious = false,
  hasNext = false
}: ComicDetailModalProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [isReading, setIsReading] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [readProgress, setReadProgress] = useState(0)
  const { theme } = useTheme()

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Navigation between comics
  const handleNavigation = (direction: 'prev' | 'next') => {
    if (onNavigate) {
      onNavigate(direction)
      setCurrentPage(0)
      setIsReading(false)
      setReadProgress(0)
    }
  }

  if (!isOpen) return null

  // Theme-aware colors
  const bgColor = theme === 'dark' 
    ? 'bg-[var(--background)]' 
    : 'bg-white'
  
  const textColor = theme === 'dark' 
    ? 'text-[var(--foreground)]' 
    : 'text-slate-800'
  
  const textMutedColor = theme === 'dark' 
    ? 'text-[var(--muted-foreground)]' 
    : 'text-slate-600'
  
  const cardBgColor = theme === 'dark' 
    ? 'bg-[var(--card)]' 
    : 'bg-slate-100'
  
  const borderColor = theme === 'dark' 
    ? 'border-[var(--border)]' 
    : 'border-slate-200'
  
  const buttonHoverBg = theme === 'dark' 
    ? 'hover:bg-[var(--card)]' 
    : 'hover:bg-slate-100'
  
  const badgeOutline = theme === 'dark'
    ? 'border-[var(--border)] bg-[var(--card)]'
    : 'border-blue-200 bg-blue-50'
  
  const badgeSecondary = theme === 'dark'
    ? 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]/80'
    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 ${theme === 'dark' ? 'bg-black/90' : 'bg-black/80'} backdrop-blur-sm z-50 animate-in fade-in duration-300`}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 overflow-y-auto">
        <div className={`relative w-full max-w-5xl max-h-[65vh] ${bgColor} rounded-3xl overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-8 duration-300 ${borderColor} border`}>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className={`absolute top-6 right-6 z-50 w-10 h-10 ${theme === 'dark' ? 'bg-[var(--card)]/90' : 'bg-white/90'} backdrop-blur-sm rounded-full flex items-center justify-center ${theme === 'dark' ? 'text-[var(--foreground)]' : 'text-slate-800'} hover:${theme === 'dark' ? 'bg-[var(--card)]' : 'bg-white'} hover:scale-110 transition-all duration-300 shadow-lg`}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Navigation Arrows (Between Comics) */}
          {onNavigate && (
            <>
              {hasPrevious && (
                <button
                  onClick={() => handleNavigation('prev')}
                  className={`absolute left-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 ${theme === 'dark' ? 'bg-[var(--card)]/90' : 'bg-white/90'} backdrop-blur-sm rounded-full flex items-center justify-center ${theme === 'dark' ? 'text-[var(--foreground)]' : 'text-slate-800'} hover:${theme === 'dark' ? 'bg-[var(--card)]' : 'bg-white'} hover:scale-110 transition-all duration-300 shadow-lg`}
                  aria-label="Previous comic"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              
              {hasNext && (
                <button
                  onClick={() => handleNavigation('next')}
                  className={`absolute right-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 ${theme === 'dark' ? 'bg-[var(--card)]/90' : 'bg-white/90'} backdrop-blur-sm rounded-full flex items-center justify-center ${theme === 'dark' ? 'text-[var(--foreground)]' : 'text-slate-800'} hover:${theme === 'dark' ? 'bg-[var(--card)]' : 'bg-white'} hover:scale-110 transition-all duration-300 shadow-lg`}
                  aria-label="Next comic"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </>
          )}

          <div className="h-full overflow-y-auto">
            {/* Hero Section */}
            <div className="relative">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Left: Comic Cover */}
                <div className="relative h-97 lg:h-[600px] bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900 overflow-hidden">
                  <Image
                    src={comic.coverImage}
                    alt={comic.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                  <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-black/70' : 'bg-black/60'} via-black/20 to-transparent`} />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-transparent to-purple-900/30" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-6 left-6">
                    <Badge className={`${comic.availability === 'Completed' ? 'bg-green-500 hover:bg-green-600' : comic.availability === 'Ongoing' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-amber-500 hover:bg-amber-600'} text-white font-bold`}>
                      {comic.availability}
                    </Badge>
                  </div>

                  {/* Featured Badge */}
                  {comic.featured && (
                    <div className="absolute top-6 right-6">
                      <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold">
                        <Sparkles className="w-3 h-3 mr-1" />
                        FEATURED
                      </Badge>
                    </div>
                  )}

                  {/* Quick Stats */}
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between text-white/90">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-semibold">{comic.views?.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span className="text-sm font-semibold">{comic.readers?.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">{comic.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Comic Details */}
                <div className="p-5 lg:p-8 flex flex-col">
                  {/* Category & Rating */}
                  <div className="flex items-center gap-4 mb-4">
                    <Badge variant="outline" className={`${badgeOutline} ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                      {comic?.genres[0]?.name}
                    </Badge>
                    <div className="flex items-center gap-1">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(comic.rating ?? 0) 
                            ? 'fill-amber-400 text-amber-400' 
                            : theme === 'dark' 
                              ? 'text-[var(--muted-foreground)]/50' 
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                      <span className={`ml-2 ${theme === 'dark' ? 'text-[var(--muted-foreground)]' : 'text-slate-600'} font-semibold`}>
                        {comic.rating}/5
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h1 className={`text-4xl lg:text-5xl font-black ${textColor} mb-3 leading-tight`}>
                    {comic.title}
                  </h1>

                  {/* Description */}
                  <p className={`text-lg ${textMutedColor} mb-6 leading-relaxed`}>
                    {comic.description}
                  </p>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <BookOpen className={`w-5 h-5 ${theme === 'dark' ? 'text-[var(--muted-foreground)]' : 'text-slate-400'}`} />
                      <div>
                        <div className={`text-sm ${theme === 'dark' ? 'text-[var(--muted-foreground)]' : 'text-slate-500'}`}>Pages</div>
                        <div className={`font-semibold ${textColor}`}>{comic.totalPages}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Clock className={`w-5 h-5 ${theme === 'dark' ? 'text-[var(--muted-foreground)]' : 'text-slate-400'}`} />
                      <div>
                        <div className={`text-sm ${theme === 'dark' ? 'text-[var(--muted-foreground)]' : 'text-slate-500'}`}>Read Time</div>
                        <div className={`font-semibold ${textColor}`}>{comic.readTime}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Calendar className={`w-5 h-5 ${theme === 'dark' ? 'text-[var(--muted-foreground)]' : 'text-slate-400'}`} />
                      <div>
                        <div className={`text-sm ${theme === 'dark' ? 'text-[var(--muted-foreground)]' : 'text-slate-500'}`}>Published</div>
                        <div className={`font-semibold ${textColor}`}>
                          {new Date(comic.publishedAt!).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Users className={`w-5 h-5 ${theme === 'dark' ? 'text-[var(--muted-foreground)]' : 'text-slate-400'}`} />
                      <div>
                        <div className={`text-sm ${theme === 'dark' ? 'text-[var(--muted-foreground)]' : 'text-slate-500'}`}>Readers</div>
                        <div className={`font-semibold ${textColor}`}>{comic.readers?.toLocaleString()}+</div>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mb-8 grid grid-cols-2 gap-8 space-between">
                    <div>
                      <h3 className={`text-lg font-bold ${textColor} mb-3`}>Genres & Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {comic.genres.map((genre: ApiGenre) => (
                          <Badge
                            key={genre.id ?? genre._id}
                            variant="secondary"
                            className={badgeSecondary}
                          >
                            #{genre.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className={`text-lg font-bold ${textColor} mb-3`}>Age rating</h3>
                      {comic.ageRating && (
                        <Badge className={theme === 'dark' 
                          ? 'bg-amber-900/30 text-amber-400 border-amber-800/30' 
                          : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }>
                          {comic.ageRating === 'ALL' ? 'All Ages' : comic.ageRating}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                    <Link href={`/comics/${comic.slug}`}>
                      <Button
                        size="lg"
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Read
                      </Button>
                    </Link>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className={`${theme === 'dark' ? 'border-[var(--border)] hover:bg-[var(--card)]' : 'border-slate-200 hover:bg-slate-100'} ${isLiked ? (theme === 'dark' ? 'text-red-400 border-red-400/30 bg-red-400/10' : 'text-red-500 border-red-200 bg-red-50') : ''}`}
                        onClick={() => setIsLiked(!isLiked)}
                      >
                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        className={`${theme === 'dark' ? 'border-[var(--border)] hover:bg-[var(--card)]' : 'border-slate-200 hover:bg-slate-100'} ${isBookmarked ? (theme === 'dark' ? 'text-blue-400 border-blue-400/30 bg-blue-400/10' : 'text-blue-500 border-blue-200 bg-blue-50') : ''}`}
                        onClick={() => setIsBookmarked(!isBookmarked)}
                      >
                        <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                      </Button>
                      
                      <ShareButtons
                        url={`/comics/${comic.slug}`}
                        title={comic.title}
                        // theme={theme}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

{/* Creative Team */}
                    {/* <div className="mb-8">
                      <h3 className="text-lg font-bold text-slate-800 mb-3">Creative Team</h3>
                      <div className="flex flex-wrap gap-4">
                        <div>
                          <div className="text-sm text-slate-500">Artist</div>
                          <div className="font-semibold text-slate-800">{comic.artist}</div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-500">Writer</div>
                          <div className="font-semibold text-slate-800">{comic.writer}</div>
                        </div>
                        {comic.colorist && (
                          <div>
                            <div className="text-sm text-slate-500">Colorist</div>
                            <div className="font-semibold text-slate-800">{comic.colorist}</div>
                          </div>
                        )}
                      </div>
                    </div> */}

// : (
            //   /* Reading Mode */
            //   <div className="relative bg-black">
            //     {/* Reading Controls */}
            //     <div className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10">
            //       <div className="container mx-auto px-4 py-3">
            //         <div className="flex items-center justify-between">
            //           <div className="flex items-center gap-4">
            //             <Button
            //               variant="ghost"
            //               size="sm"
            //               onClick={() => setIsReading(false)}
            //               className="text-white hover:bg-white/10"
            //             >
            //               <X className="w-4 h-4 mr-2" />
            //               Exit Preview
            //             </Button>
                        
            //             <div className="text-white text-sm">
            //               Page {currentPage + 1} of {previewPages.length}
            //             </div>
            //           </div>
                      
            //           <div className="flex items-center gap-4">
            //             <div className="w-32">
            //               <Progress value={readProgress} className="h-2" />
            //             </div>
                        
            //             <div className="flex items-center gap-2">
            //               <Button
            //                 variant="ghost"
            //                 size="icon"
            //                 onClick={handlePreviousPage}
            //                 disabled={currentPage === 0}
            //                 className="text-white hover:bg-white/10 disabled:opacity-50"
            //               >
            //                 <ChevronLeft className="w-5 h-5" />
            //               </Button>
                          
            //               <Button
            //                 variant="ghost"
            //                 size="icon"
            //                 onClick={handleNextPage}
            //                 disabled={currentPage === previewPages.length - 1}
            //                 className="text-white hover:bg-white/10 disabled:opacity-50"
            //               >
            //                 <ChevronRight className="w-5 h-5" />
            //               </Button>
            //             </div>
            //           </div>
            //         </div>
            //       </div>
            //     </div>

            //     {/* Comic Pages */}
            //     <div className="pt-16">
            //       <div className="flex justify-center items-center min-h-[calc(90vh-4rem)]">
            //         <div className="relative w-full max-w-4xl mx-auto">
            //           <div className="relative aspect-[3/4] max-h-[80vh] overflow-hidden rounded-lg shadow-2xl">
            //             {previewPages[currentPage] && (
            //               <Image
            //                 src={previewPages[currentPage] ?? previewPages[0] ?? '/placeholder.jpg'}
            //                 alt={`Page ${currentPage + 1} - ${comic.title}`}
            //                 fill
            //                 className="object-contain"
            //                 sizes="100vw"
            //                 priority
            //               />
            //             )}
            //           </div>
                      
            //           {/* Navigation Overlay */}
            //           <div className="absolute inset-0 flex items-center justify-between px-4">
            //             <button
            //               onClick={handlePreviousPage}
            //               disabled={currentPage === 0}
            //               className="w-1/4 h-full opacity-0 hover:opacity-100 transition-opacity disabled:opacity-0"
            //               aria-label="Previous page"
            //             >
            //               <div className="flex items-center justify-start h-full">
            //                 <div className="bg-black/50 text-white p-3 rounded-full">
            //                   <ChevronLeft className="w-8 h-8" />
            //                 </div>
            //               </div>
            //             </button>
                        
            //             <button
            //               onClick={handleNextPage}
            //               disabled={currentPage === previewPages.length - 1}
            //               className="w-1/4 h-full opacity-0 hover:opacity-100 transition-opacity disabled:opacity-0"
            //               aria-label="Next page"
            //             >
            //               <div className="flex items-center justify-end h-full">
            //                 <div className="bg-black/50 text-white p-3 rounded-full">
            //                   <ChevronRight className="w-8 h-8" />
            //                 </div>
            //               </div>
            //             </button>
            //           </div>
            //         </div>
            //       </div>
            //     </div>
            //   </div>
            // )}

{/* Preview Pages Grid (Non-Reading Mode) */}
            {/* {!isReading && (
              <div className="p-8 lg:p-12 border-t border-slate-200">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-800 mb-4">Preview Pages</h2>
                  <p className="text-slate-600 mb-6">
                    Get a taste of the art and storytelling. Click any page to enter reading mode.
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {previewPages.map((page, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentPage(index)
                          setIsReading(true)
                        }}
                        className="group relative aspect-[3/4] overflow-hidden rounded-lg border border-slate-200 hover:border-blue-300 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                      >
                        <Image
                          src={page}
                          alt={`Preview page ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                          {index + 1}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* CTA Section */}
          //       <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
          //         <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          //           <div>
          //             <h3 className="text-2xl font-bold text-slate-800 mb-2">
          //               Want to read the full story?
          //             </h3>
          //             <p className="text-slate-600">
          //               Get access to the complete comic and support independent African storytelling.
          //             </p>
          //           </div>
                    
          //           <div className="flex flex-col sm:flex-row gap-3">
          //             <Button size="lg" variant="outline" className="border-blue-300 text-blue-600">
          //               <BookOpen className="w-5 h-5 mr-2" />
          //               Read Free Sample
          //             </Button>
                      
          //             <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          //               Get Full Access
          //             </Button>
          //           </div>
          //         </div>
          //       </div>
          //     </div>
          //   )}
          // </div>