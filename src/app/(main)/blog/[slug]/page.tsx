import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Calendar, 
  ArrowLeft, 
  Share2, 
  Bookmark, 
  Eye, 
  Clock, 
  Tag,
  MessageCircle,
  Heart,
  Send,
  ChevronRight,
  Sparkles,
  PenTool,
  Hash,
} from 'lucide-react'
import ShareButtons from '~/components/blog/shareButtons';
import TableOfContents from '~/components/blog/tableOfContents';
import { api } from '~/lib/api'
import type { ApiResponse } from '~/types/api'
import type { ApiBlogPostResponse, BlogPost } from '~/types/blog'
import { transformPost } from '~/lib/utils'
import LikeBookmarkButtons from '~/components/blog/likeBookmarksButton'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const response: ApiResponse<ApiBlogPostResponse> = await api.getBlogPost(slug);
  const post = response.success ? transformPost(response.data) : null;
  
  if (!post) {
    notFound()
  }

  return (
    <main>
        {/* Hero Section with Featured Image */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Featured Image */}
        {post.image && (
          <div className="absolute inset-0">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        )}

        {/* Dynamic Gradient Based on Image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-transparent to-purple-900/30" />

        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Text Container with Background Blur */}
            <div className="relative ">
              {/* Blurred background for text */}
              <div className="absolute -inset-8 my-auto h-[100%] md:max-h-[90%] bg-black/10 backdrop-blur-sm rounded-3xl -z-10" />
              
              {/* Content */}
              <div className="relative py-15 px-10  md:py-15 md:px-15 lg:p-15">
                <div className="flex gap-5">
                  <Link 
                    href="/blog"
                    className="group inline-flex items-center gap-2 text-white hover:text-white/90 mb-8 transition-colors duration-300"
                  >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-semibold">Back to Posts</span>
                  </Link>

                  {/* Category Badge */}
                  <div className="inline-flex items-center gap-2 bg-white/30 backdrop-blur-md border border-white/30 rounded-full px-4 py-2 mb-6">
                    <Tag className="w-4 h-4 text-white" />
                    <span className="text-sm font-bold text-white tracking-wider">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight">
                  {post.title}
                </h1>

                {/* Description */}
                <p className="text-xl text-white/95 mb-12 leading-relaxed max-w-3xl">
                  {post.description}
                </p>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-6 text-white/90 mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      {post.author.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-white">{post.author}</div>
                      <div className="text-sm text-white/80">Creator & Storyteller</div>
                    </div>
                  </div>

                  <div className="h-6 w-px bg-white/40" />

                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-white" />
                    <span className="font-semibold text-white">
                      {new Date(post.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className="h-6 w-px bg-white/40" />

                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-white" />
                    <span className="font-semibold text-white" id="readtime">{post.readingTime} min read</span>
                  </div>

                  <div className="h-6 w-px bg-white/40" />

                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-white" />
                    <span className="font-semibold text-white">
                      {Math.floor(Math.random() * 5000) + 1000} views
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-4">
                  <ShareButtons url={`/blog/${post.slug}`} title={post.title} />
                  
                  <LikeBookmarkButtons
                    postId={post.id}
                    postSlug={post.slug}
                    initialLikes={post.likes ?? 0}
                    initialViews={post.views ?? 0}
                    showLikes
                    showBookmark
                    variant='default'
                   />
                </div>
           </div>
          </div>
        </div>
      </div>
    </section>
      <div className="relative">
        {/* Sticky Sidebar */}
        <div className="hidden lg:block fixed left-8 top-1/2 transform -translate-y-1/2 z-10">
          <div className="flex flex-col items-center gap-4">
              <LikeBookmarkButtons
                postId={post.id}
                postSlug={post.slug}
                initialLikes={post.likes ?? 0}
                initialViews={post.views ?? 0}
                variant='sidebar'
              />
            
            <ShareButtons 
              url={`/blog/${post.slug}`} 
              title={post.title}
              vertical 
            />
            {/* <div className="bg-white rounded-2xl p-4 shadow-2xl border border-slate-200">
              <button 
                // onClick={handleBookmark}
                className="group p-2 hover:bg-blue-50 rounded-xl transition-colors"
              >
                <Bookmark className="w-6 h-6 text-slate-600 group-hover:text-blue-600" />
              </button>
            </div> */}
          </div>
        </div>

        {/* Content Container */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Table of Contents (Desktop) */}
            <div className="hidden lg:block mb-12">
              <TableOfContents />
            </div>

            {/* Article Content */}
            <article className="prose prose-lg lg:prose-xl max-w-none">
              {/* Introduction */}
              <div className="relative mb-12">
                <div className="absolute -left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                <p className="text-2xl text-slate-700 leading-relaxed font-light italic pl-8">
                  {post.description}
                </p>
              </div>

              {/* Main Content */}
              <div 
                className="prose-headings:font-black prose-headings:text-slate-900 
                          prose-p:text-slate-700 prose-p:leading-relaxed prose-p:font-light
                          prose-a:text-blue-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                          prose-strong:text-slate-900 prose-strong:font-black
                          prose-blockquote:border-l-4 prose-blockquote:border-blue-500 
                          prose-blockquote:bg-blue-50/50 prose-blockquote:py-4 prose-blockquote:px-8
                          prose-blockquote:italic prose-blockquote:text-slate-700
                          prose-img:rounded-2xl prose-img:shadow-lg prose-img:border prose-img:border-slate-200
                          prose-hr:border-slate-200
                          prose-ul:list-none prose-ul:space-y-2
                          prose-li:flex prose-li:items-start prose-li:gap-3
                          prose-li:before:content-['✦'] prose-li:before:text-blue-500 prose-li:before:font-bold"
              >
                {post.content}
              </div>

              {/* Tags */}
              <div className="mt-16 pt-8 border-t border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <Hash className="w-6 h-6 text-slate-600" />
                  <h3 className="text-xl font-black text-slate-900">Story Tags</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                      className="group inline-flex items-center gap-2 bg-slate-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 text-slate-700 hover:text-blue-700 px-4 py-2 rounded-full font-semibold transition-all duration-300 border border-slate-200 hover:border-blue-200"
                    >
                      <span>#{tag}</span>
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

                {/* Author Card */}
                {/* <div className="mt-16">
                  <BlogAuthor 
                    author={post.author}
                    bio="Creator & Storyteller at Royalbird Studios"
                    postCount={Math.floor(Math.random() * 50) + 10}
                    joinDate={new Date('2020-01-01').toISOString()}
                  />
                </div> */}

              {/* Engagement Actions */}
              <div className="mt-12 p-8 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-3xl border border-slate-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">
                      Enjoyed this story?
                    </h3>
                    <p className="text-slate-600">
                      Share your thoughts with the Royalbird community
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <button 
                      // onClick={handleLike}
                      className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-bold transition-all duration-300 transform hover:scale-105"
                    >
                      <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      Like this Story
                    </button>
                    {/* <button className="group flex items-center gap-2 border-2 border-blue-500 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-full font-bold transition-all duration-300">
                      <MessageCircle className="w-5 h-5" />
                      Add Comment
                    </button> */}
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>

        {/* Newsletter CTA */}
        <section className="py-20 bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <span className="text-sm text-white font-semibold tracking-wider">
                  NEVER MISS A STORY
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-black text-white mb-8">
                Join The <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">Creative Circle</span>
              </h2>

              <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
                Get exclusive behind-the-scenes content, art tutorials, and new story releases delivered straight to your inbox.
              </p>

              <div className="max-w-2xl mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/40 font-semibold text-lg focus:outline-none focus:border-blue-400 transition-all duration-300"
                  />
                  <button className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-500 transform hover:scale-105 flex items-center justify-center gap-3">
                    <span>Subscribe Now</span>
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                <p className="text-sm text-white/60 mt-4">
                  Join 1000+ creators and storytellers. No spam, ever.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Table of Contents (Mobile) */}
        <div className="lg:hidden fixed bottom-6 right-6 z-20">
          <button
            className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-110"
            // onClick={() => {
            //   const toc = document.getElementById('mobile-toc');
            //   toc?.classList.toggle('hidden');
            // }}
            aria-label="Table of Contents"
          >
            <span className="text-lg font-bold">📖</span>
          </button>
          <div id="mobile-toc" className="hidden absolute bottom-full right-0 mb-2 w-64">
            <TableOfContents mobile />
          </div>
        </div>
      </div>
    </main>
  )

  // return (
  //   <main className="min-h-screen bg-white overflow-hidden">
  //     {/* Hero Section with Featured Image */}
  //     <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
  //       {/* Featured Image */}
  //       {post.image && (
  //         <div className="absolute inset-0">
  //           <Image
  //             src={post.image}
  //             alt={post.title}
  //             fill
  //             className="object-cover"
  //             sizes="100vw"
  //             priority
  //           />
  //         </div>
  //       )}

  //       {/* Dynamic Gradient Based on Image */}
  //       <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
  //       <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-transparent to-purple-900/30" />

  //       <div className="relative z-10 container mx-auto px-4">
  //         <div className="max-w-4xl mx-auto">
  //           {/* Text Container with Background Blur */}
  //           <div className="relative ">
  //             {/* Blurred background for text */}
  //             <div className="absolute -inset-8 my-auto max-h-[90%] bg-black/10 backdrop-blur-sm rounded-3xl -z-10" />
              
  //             {/* Content */}
  //             <div className="relative py-15 px-10  md:py-15 md:px-15 lg:p-15">
  //               <div className="flex gap-5">
  //                 <Link 
  //                   href="/blog"
  //                   className="group inline-flex items-center gap-2 text-white hover:text-white/90 mb-8 transition-colors duration-300"
  //                 >
  //                   <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
  //                   <span className="font-semibold">Back to Posts</span>
  //                 </Link>

  //                 {/* Category Badge */}
  //                 <div className="inline-flex items-center gap-2 bg-white/30 backdrop-blur-md border border-white/30 rounded-full px-4 py-2 mb-6">
  //                   <Tag className="w-4 h-4 text-white" />
  //                   <span className="text-sm font-bold text-white tracking-wider">
  //                     {post.category}
  //                   </span>
  //                 </div>
  //               </div>

  //               {/* Title */}
  //               <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight">
  //                 {post.title}
  //               </h1>

  //               {/* Description */}
  //               <p className="text-xl text-white/95 mb-12 leading-relaxed max-w-3xl">
  //                 {post.description}
  //               </p>

  //               {/* Meta Information */}
  //               <div className="flex flex-wrap items-center gap-6 text-white/90 mb-8">
  //                 <div className="flex items-center gap-2">
  //                   <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
  //                     {post.author.charAt(0)}
  //                   </div>
  //                   <div>
  //                     <div className="font-bold text-white">{post.author}</div>
  //                     <div className="text-sm text-white/80">Creator & Storyteller</div>
  //                   </div>
  //                 </div>

  //                 <div className="h-6 w-px bg-white/40" />

  //                 <div className="flex items-center gap-2">
  //                   <Calendar className="w-5 h-5 text-white" />
  //                   <span className="font-semibold text-white">
  //                     {new Date(post.date).toLocaleDateString('en-US', {
  //                       month: 'long',
  //                       day: 'numeric',
  //                       year: 'numeric'
  //                     })}
  //                   </span>
  //                 </div>

  //                 <div className="h-6 w-px bg-white/40" />

  //                 <div className="flex items-center gap-2">
  //                   <Clock className="w-5 h-5 text-white" />
  //                   <span className="font-semibold text-white">{post.readingTime} min read</span>
  //                 </div>

  //                 <div className="h-6 w-px bg-white/40" />

  //                 <div className="flex items-center gap-2">
  //                   <Eye className="w-5 h-5 text-white" />
  //                   <span className="font-semibold text-white">
  //                     {Math.floor(Math.random() * 5000) + 1000} views
  //                   </span>
  //                 </div>
  //               </div>

  //               {/* Action Buttons */}
  //               <div className="flex flex-wrap items-center gap-4">
  //                 <ShareButtons url={`/blog/${post.slug}`} title={post.title} />
                  
  //                 <button className="group flex items-center gap-2 bg-white/30 hover:bg-white/40 backdrop-blur-md text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 border border-white/30 hover:border-white/50">
  //                   <Bookmark className="w-5 h-5 group-hover:scale-110 transition-transform" />
  //                   Save for Later
  //                 </button>
                  
  //                 <button className="group flex items-center gap-2 bg-gradient-to-r from-blue-500/90 to-purple-600/90 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 border border-white/30">
  //                   <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
  //                   248 Likes
  //                 </button>
  //               </div>
  //          </div>
  //         </div>
  //       </div>
  //     </div>
  //   </section>

  //     {/* Main Content Area */}
  //     <div className="relative">
  //       {/* Sticky Sidebar */}
  //       <div className="hidden lg:block fixed left-8 top-1/2 transform -translate-y-1/2 z-10">
  //         <div className="flex flex-col items-center gap-4">
  //           <div className="bg-white rounded-2xl p-4 shadow-2xl border border-slate-200">
  //             <button className="group flex flex-col items-center p-2 hover:bg-blue-50 rounded-xl transition-colors">
  //               <Heart className="w-6 h-6 text-slate-600 group-hover:text-red-500 mb-1" />
  //               <span className="text-xs font-semibold text-slate-600">248</span>
  //             </button>
  //           </div>
            
  //           <ShareButtons url={`/blog/${post.slug}`} title={post.title} vertical />
            
  //           <div className="bg-white rounded-2xl p-4 shadow-2xl border border-slate-200">
  //             <button className="group p-2 hover:bg-blue-50 rounded-xl transition-colors">
  //               <Bookmark className="w-6 h-6 text-slate-600 group-hover:text-blue-600" />
  //             </button>
  //           </div>
  //         </div>
  //       </div>

  //       {/* Content Container */}
  //       <div className="container mx-auto px-4 py-16">
  //         <div className="max-w-4xl mx-auto">
  //           {/* Table of Contents (Desktop) */}
  //           <div className="hidden lg:block mb-12">
  //             <TableOfContents />
  //           </div>

  //           {/* Article Content */}
  //           <article className="prose prose-lg lg:prose-xl max-w-none">
  //             {/* Introduction */}
  //             <div className="relative mb-12">
  //               <div className="absolute -left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
  //               <p className="text-2xl text-slate-700 leading-relaxed font-light italic pl-8">
  //                 {post.description}
  //               </p>
  //             </div>

  //             {/* Main Content */}
  //             <div className="prose-headings:font-black prose-headings:text-slate-900 
  //                          prose-p:text-slate-700 prose-p:leading-relaxed prose-p:font-light
  //                          prose-a:text-blue-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
  //                          prose-strong:text-slate-900 prose-strong:font-black
  //                          prose-blockquote:border-l-4 prose-blockquote:border-blue-500 
  //                          prose-blockquote:bg-blue-50/50 prose-blockquote:py-4 prose-blockquote:px-8
  //                          prose-blockquote:italic prose-blockquote:text-slate-700
  //                          prose-img:rounded-2xl prose-img:shadow-lg prose-img:border prose-img:border-slate-200
  //                          prose-hr:border-slate-200
  //                          prose-ul:list-none prose-ul:space-y-2
  //                          prose-li:flex prose-li:items-start prose-li:gap-3
  //                          prose-li:before:content-['✦'] prose-li:before:text-blue-500 prose-li:before:font-bold">
  //               {post.content}
  //             </div>

  //             {/* Tags */}
  //             <div className="mt-16 pt-8 border-t border-slate-200">
  //               <div className="flex items-center gap-3 mb-4">
  //                 <Tag className="w-6 h-6 text-slate-600" />
  //                 <h3 className="text-xl font-black text-slate-900">Story Tags</h3>
  //               </div>
  //               <div className="flex flex-wrap gap-3">
  //                 {post.tags.map((tag) => (
  //                   <Link
  //                     key={tag}
  //                     href={`/blog?tag=${tag}`}
  //                     className="group inline-flex items-center gap-2 bg-slate-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 text-slate-700 hover:text-blue-700 px-4 py-2 rounded-full font-semibold transition-all duration-300 border border-slate-200 hover:border-blue-200"
  //                   >
  //                     <span>#{tag}</span>
  //                     <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
  //                   </Link>
  //                 ))}
  //               </div>
  //             </div>

  //             {/* Author Card */}
  //             <div className="mt-16">
  //               {/* <BlogAuthor author={post.author} /> */}
  //             </div>

  //             {/* Engagement Actions */}
  //             <div className="mt-12 p-8 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-3xl border border-slate-200">
  //               <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
  //                 <div>
  //                   <h3 className="text-2xl font-black text-slate-900 mb-2">
  //                     Enjoyed this story?
  //                   </h3>
  //                   <p className="text-slate-600">
  //                     Share your thoughts with the Royalbird community
  //                   </p>
  //                 </div>
  //                 <div className="flex flex-wrap gap-4">
  //                   <button className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-bold transition-all duration-300 transform hover:scale-105">
  //                     <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
  //                     Like this Story
  //                   </button>
  //                   {/* <button className="group flex items-center gap-2 border-2 border-blue-500 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-full font-bold transition-all duration-300">
  //                     <MessageCircle className="w-5 h-5" />
  //                     Add Comment
  //                   </button> */}
  //                 </div>
  //               </div>
  //             </div>
  //           </article>
  //         </div>
  //       </div>
  //     </div>

  //     {/* Related Posts */}
  //     {/* {relatedPosts.length > 0 && (
  //       <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
  //         <div className="container mx-auto px-4">
  //           <div className="text-center mb-12">
  //             <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
  //               Continue Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Journey</span>
  //             </h2>
  //             <p className="text-lg text-slate-600 max-w-2xl mx-auto">
  //               Dive deeper into stories that share the same creative spirit
  //             </p>
  //           </div>
  //           <RelatedPosts posts={relatedPosts} />
  //         </div>
  //       </section>
  //     )} */}

  //     {/* Newsletter CTA */}
  //     <section className="py-20 bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900">
  //       <div className="container mx-auto px-4">
  //         <div className="max-w-4xl mx-auto text-center">
  //           <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8">
  //             <Sparkles className="w-5 h-5 text-yellow-300" />
  //             <span className="text-sm text-white font-semibold tracking-wider">
  //               NEVER MISS A STORY
  //             </span>
  //           </div>

  //           <h2 className="text-4xl md:text-5xl font-black text-white mb-8">
  //             Join The <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">Creative Circle</span>
  //           </h2>

  //           <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
  //             Get exclusive behind-the-scenes content, art tutorials, and new story releases delivered straight to your inbox.
  //           </p>

  //           <form className="max-w-2xl mx-auto">
  //             <div className="flex flex-col sm:flex-row gap-4">
  //               <input
  //                 type="email"
  //                 placeholder="Enter your email address"
  //                 className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/40 font-semibold text-lg focus:outline-none focus:border-blue-400 transition-all duration-300"
  //               />
  //               <button className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-500 transform hover:scale-105 flex items-center justify-center gap-3">
  //                 <span>Subscribe Now</span>
  //                 <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
  //               </button>
  //             </div>
  //             <p className="text-sm text-white/60 mt-4">
  //               Join 1000+ creators and storytellers. No spam, ever.
  //             </p>
  //           </form>
  //         </div>
  //       </div>
  //     </section>

  //     {/* Table of Contents (Mobile) */}
  //     <div className="lg:hidden fixed bottom-6 right-6 z-20">
  //       <button
  //         className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-110"
  //         // onClick={() => {
  //         //   // Toggle table of contents
  //         //   document.getElementById('mobile-toc')?.classList.toggle('hidden')
  //         // }}
  //         aria-label="Table of Contents"
  //       >
  //         <span className="text-lg font-bold">📖</span>
  //       </button>
  //       <div id="mobile-toc" className="hidden absolute bottom-full right-0 mb-2 w-64">
  //         <TableOfContents mobile />
  //       </div>
  //     </div>
  //   </main>
  // )
}