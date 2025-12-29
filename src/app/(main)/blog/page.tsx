'use client'
import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect } from 'react';
import type { BlogPost } from '~/types/blog';
import { useBlog } from '~/hooks/useBlog';
import LoadingSpinner from '~/components/ui/loadingSpinner';
import ErrorMessage from '~/components/ui/errorMessage';
import BlogCardSkeleton from '~/components/blog/blogCardSkeleton';
import Pagination from '~/components/ui/pagination';
import SearchBar from '~/components/blog/searchBar';
import { debounce } from '~/lib/utils';


const FeaturedPost = ({ post }: { post: BlogPost }) => {
  
  return (
    <section className="relative h-[70vh] overflow-hidden bg-black">
      <div 
        className="absolute inset-0 transition-transform duration-700 ease-out scale-100 hover:scale-105"
      >
        <Image
          src={post.image} 
          alt={post.title}
          fill
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>
      
      <div className="relative h-full container mx-auto px-6 flex items-end pb-16">
        <div className="max-w-3xl">
          <div className="mb-4 flex items-center gap-4">
            <span className="px-3 py-1 bg-white text-black text-xs font-bold uppercase tracking-wider">
              Featured
            </span>
            <span className="text-white/70 text-sm uppercase tracking-wider">
              {post.category}
            </span>
          </div>
          <Link href={`/blog/${post.slug}`}>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              {post.title}
            </h2>
          </Link>
          
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            {post.description}
          </p>
          
          <div className="flex items-center gap-6 text-white/70">
            <span className="font-medium">{post.author}</span>
            <span>·</span>
            <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const BlogCard = ({ post }: { post: BlogPost }) => {
  
  return (
    <Link href={`/blog/${post.slug}`}>
      <article 
        className="group cursor-pointer"
      >
        <div className="relative overflow-hidden bg-black mb-4" style={{ aspectRatio: '3/4' }}>
          <Image
            src={post.image} 
            alt={post.title}
            fill
            className="w-full h-full object-cover transition-all duration-500 ease-out scale-100 group-hover:scale-110 group-hover:opacity-70"
          />
          
          <div 
            className="absolute inset-0 bg-black transition-opacity duration-300 opacity-0 group-hover:opacity-30"
          />
          
          <div className="absolute top-4 left-4">
            <span className="px-2 py-1 bg-white text-black text-xs font-bold uppercase tracking-wider">
              {post.category}
            </span>
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-slate-600 transition-colors duration-300">
            {post.title}
          </h3>
          
          <p className="text-slate-600 leading-relaxed">
            {post.description}
          </p>
          
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span className="font-medium text-slate-700">{post.author}</span>
            <span>·</span>
            <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [postsPerPage] = React.useState(9);

  const {
    posts,
    loading,
    error,
    featuredPost,
    categories,
    refetchPosts,
    searchPosts,
    clearSearch,
  } = useBlog();

  // calculate pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length >= 2) {
      
      debounce(() => {
        searchPosts(query).catch((err) => {
          console.error('Search error:', err);
        });
      }, 300)();
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    clearSearch();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return <ErrorMessage message={error} onRetry={refetchPosts} />;
  }
  
  return (
    <div className="min-h-screen bg-blue-50/50">

      {/* Featured Post */}
      {!searchQuery && featuredPost && !loading && (
        <FeaturedPost post={featuredPost} />
      )}

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-2xl mx-auto my-3 mb-8 px-6">
          <SearchBar
            value={searchQuery}
            onChange={handleSearch}
            onClear={handleClearSearch}
            placeholder="Search blog posts..."
          />
        </div>
        <div className="container mx-auto px-6">
          {/* Header with stats and category filter */}
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
                {searchQuery ? `Search Results for "${searchQuery}"` : 'Latest Posts'}
              </h2>
              <div className="w-20 h-1 bg-black" />
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="text-sm text-slate-500">
                Showing {posts.length} post{posts.length !== 1 ? 's' : ''}
                {searchQuery && ` matching "${searchQuery}"`}
              </div>
              
              {/* Category Filter */}
              {categories.length > 0 && !searchQuery && (
                <select
                  className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => {
                    const category = e.target.value;
                    if (category) {
                      setSearchQuery(category);
                    }
                  }}
                  value={searchQuery}
                >
                  <option value="">All Categories</option>
                  {categories.map((category, index) => (
                    <option key={category.name} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Blog Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {[1,2,3,4,5,6].map((_, i) => (
                <BlogCardSkeleton key={i} />
              ))}
            </div>
          ) : currentPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {currentPosts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                {searchQuery ? 'No matching posts found' : 'No blog posts yet'}
              </h3>
              <p className="text-slate-600 max-w-md mx-auto">
                {searchQuery 
                  ? 'Try a different search term or browse our categories below.'
                  : 'Check back soon for new articles and tutorials!'}
              </p>
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section (only show when not searching) */}
      {!searchQuery && categories.length > 0 && (
        <section className="py-12 bg-slate-50">
          <div className="container mx-auto px-6">
            <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
              Browse by Category
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(category.name)}
                  className="px-4 py-2 bg-white rounded-full border border-slate-200 hover:border-blue-500 hover:text-blue-600 transition"
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}


      {/* Minimal Header */}
      {/* <header className="border-b border-slate-200">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-black tracking-tight">ROYALBIRD</h1>
            <nav className="flex gap-8 text-sm font-medium uppercase tracking-wider">
              <a href="#" className="hover:text-slate-600 transition-colors">Stories</a>
              <a href="#" className="hover:text-slate-600 transition-colors">Archive</a>
              <a href="#" className="hover:text-slate-600 transition-colors">About</a>
            </nav>
          </div>
        </div>
      </header> */}
