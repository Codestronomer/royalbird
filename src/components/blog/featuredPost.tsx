import Image from "next/image";
import { ArrowRight, Calendar, Eye, Sparkles, Star } from "lucide-react";
import type { BlogPost } from "~/types/blog";
import Link from "next/link";

interface FeaturedPostProps {
  post: BlogPost
}

export default function FeaturedPost({ post }: FeaturedPostProps) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <div className="relative grid md:grid-cols-2 gap-10 items-center rounded-3xl overflow-hidden">

        <div className="relative h-[450px] md:h-full overflow-hidden rounded-3xl">
          <Image
            alt={post.title} 
            fill
            src={post.image}
            className="w-full h-full object-cover transition-transform duration-[1200ms] hover:scale-110"
          />
        </div>

        <div className="p-8 md:p-12">
          <p className="uppercase tracking-widest text-neutral-400 text-sm mb-4">
            Featured Story
          </p>

          <h2 className="text-4xl md:text-5xl font-[serif] leading-tight mb-6">
            {post.title}
          </h2>

          <p className="text-neutral-600 text-base leading-relaxed mb-6">
            {post.description}
          </p>

          <a 
            href={`/blog/${post.slug}`} 
            className="text-neutral-900 underline underline-offset-4 decoration-neutral-400 hover:decoration-black transition"
          >
            Read Full Story →
          </a>
        </div>
      </div>
    </Link>
    // <section className="relative py-20 bg-gradient-to-b from-white to-slate-50/30 overflow-hidden">
    //   {/* Background Elements */}
    //   <div className="absolute top-10 right-10 opacity-5">
    //     <Sparkles size={120} className="text-purple-400" />
    //   </div>
    //   <div className="absolute bottom-10 left-10 opacity-5">
    //     <Star size={100} className="text-blue-400" />
    //   </div>

    //   <div className="container mx-auto px-4 relative z-10">
    //     <div className="text-center mb-12">
    //       <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-full px-6 py-2 mb-4">
    //         <Eye className="w-4 h-4 text-blue-600" />
    //         <span className="text-sm font-semibold text-blue-700">FEATURED STORY</span>
    //       </div>
    //       <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-4">
    //         Spotlight On <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Excellence</span>
    //       </h2>
    //     </div>

    //     <div className="group relative max-w-6xl mx-auto">
    //       {/* Glow Effect */}
    //       <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
    //       <div className="relative bg-white rounded-3xl overflow-hidden border-2 border-slate-100 group-hover:border-blue-200/50 transition-all duration-500 group-hover:shadow-2xl">
    //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
    //           {/* Image Side - Full Height */}
    //           <div className="relative h-64 lg:h-full min-h-[400px] bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900 overflow-hidden">
    //             {post.image ? (
    //               <div className="absolute inset-0">
    //                 <Image
    //                   src={post.image}
    //                   alt={post.title}
    //                   fill
    //                   className="object-cover transition-transform duration-1000 group-hover:scale-110"
    //                   sizes="(max-width: 768px) 100vw, 50vw"
    //                   priority
    //                 />
    //                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
    //                 <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-purple-900/20" />
    //               </div>
    //             ) : (
    //               <div className="absolute inset-0 flex items-center justify-center">
    //                 <Sparkles className="w-24 h-24 text-white/20" />
    //               </div>
    //             )}

    //             {/* Category Badge */}
    //             <div className="absolute top-6 left-6">
    //               <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2">
    //                 <span className="text-sm font-black text-blue-700 tracking-wider">
    //                   {post.category}
    //                 </span>
    //               </div>
    //             </div>

    //             {/* Read Time */}
    //             <div className="absolute bottom-6 left-6">
    //               <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2">
    //                 <span className="text-sm font-semibold text-white">
    //                   📖 8 min read
    //                 </span>
    //               </div>
    //             </div>
    //           </div>

    //           {/* Content Side */}
    //           <div className="p-8 lg:p-12 flex flex-col justify-between">
    //             <div>
    //               <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
    //                 <div className="flex items-center gap-2">
    //                   <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
    //                     {post.author.charAt(0)}
    //                   </div>
    //                   <span className="font-semibold text-slate-700">{post.author}</span>
    //                 </div>
    //                 <div className="flex items-center gap-1">
    //                   <Calendar className="w-4 h-4" />
    //                   <span>{new Date(post.date).toLocaleDateString('en-US', { 
    //                     month: 'long', 
    //                     day: 'numeric', 
    //                     year: 'numeric' 
    //                   })}</span>
    //                 </div>
    //               </div>

    //               <h3 className="text-3xl lg:text-4xl font-black text-slate-800 mb-6 leading-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-500">
    //                 {post.title}
    //               </h3>

    //               <p className="text-lg text-slate-600 leading-relaxed mb-8 line-clamp-3">
    //                 {post.description}
    //               </p>

    //               {/* Tags */}
    //               <div className="flex flex-wrap gap-2 mb-8">
    //                 {post.tags.slice(0, 3).map((tag) => (
    //                   <span
    //                     key={tag}
    //                     className="inline-block bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1 rounded-full text-sm font-semibold transition-colors duration-300"
    //                   >
    //                     #{tag}
    //                   </span>
    //                 ))}
    //                 {post.tags.length > 3 && (
    //                   <span className="inline-block bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-semibold">
    //                     +{post.tags.length - 3}
    //                   </span>
    //                 )}
    //               </div>
    //             </div>

    //             {/* CTA Button */}
    //             <div className="flex items-center justify-between">
    //               <Link
    //                 href={`/blog/${post.slug}`}
    //                 className="group/btn inline-flex items-center gap-3 text-lg font-bold text-blue-600 hover:text-blue-700 transition-colors"
    //               >
    //                 Read Full Story
    //                 <div className="relative">
    //                   <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform duration-300" />
    //                   <div className="absolute -bottom-1 left-0 w-0 group-hover/btn:w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300" />
    //                 </div>
    //               </Link>

    //               {/* Social Share */}
    //               <div className="flex items-center gap-2">
    //                 <span className="text-sm text-slate-500">Share:</span>
    //                 <div className="flex gap-2">
    //                   {['twitter', 'facebook', 'linkedin'].map((platform) => (
    //                     <button
    //                       key={platform}
    //                       className="w-8 h-8 rounded-full bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-600 flex items-center justify-center transition-all duration-300 hover:scale-110"
    //                       aria-label={`Share on ${platform}`}
    //                     >
    //                       {platform === 'twitter' && '𝕏'}
    //                       {platform === 'facebook' && 'f'}
    //                       {platform === 'linkedin' && 'in'}
    //                     </button>
    //                   ))}
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </section>
  )
}