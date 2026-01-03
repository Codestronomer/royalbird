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
import { useTheme } from '~/hooks/useTheme';

const FeaturedPost = ({ post }: { post: BlogPost }) => {
  const { theme } = useTheme();
  
  return (
    <section className="relative h-[70vh] overflow-hidden transition-all duration-500">
      <div className="absolute inset-0">
        <Image
          src={post.image} 
          alt={post.title}
          fill
          className="w-full h-full object-cover opacity-60 transition-all duration-500"
        />
        <div className={`absolute inset-0 transition-all duration-500 ${
          theme === 'dark' 
            ? 'bg-gradient-to-t from-black via-black/70 to-transparent' 
            : 'bg-gradient-to-t from-black via-black/50 to-transparent'
        }`} />
      </div>
      
      <div className="relative h-full container mx-auto px-6 flex items-end pb-16">
        <div className="max-w-3xl">
          <div className="mb-4 flex items-center gap-4">
            <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider transition-all duration-500 ${
              theme === 'dark'
                ? 'bg-[var(--primary)] text-white'
                : 'bg-white text-black'
            }`}>
              Featured
            </span>
            <span className={`text-sm uppercase tracking-wider transition-all duration-500 ${
              theme === 'dark' ? 'text-gray-300' : 'text-white/70'
            }`}>
              {post.category}
            </span>
          </div>
          <Link href={`/blog/${post.slug}`}>
            <h2 className={`text-5xl md:text-7xl font-black mb-6 leading-tight transition-all duration-500 ${
              theme === 'dark' ? 'text-white' : 'text-white'
            }`}>
              {post.title}
            </h2>
          </Link>
          
          <p className={`text-xl mb-8 leading-relaxed transition-all duration-500 ${
            theme === 'dark' ? 'text-gray-200' : 'text-white/90'
          }`}>
            {post.description}
          </p>
          
          <div className={`flex items-center gap-6 transition-all duration-500 ${
            theme === 'dark' ? 'text-gray-300' : 'text-white/70'
          }`}>
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
  const { theme } = useTheme();
  
  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="group cursor-pointer transition-all duration-500">
        <div className="relative overflow-hidden mb-4 transition-all duration-500" style={{ aspectRatio: '3/4' }}>
          <Image
            src={post.image} 
            alt={post.title}
            fill
            className="w-full h-full object-cover transition-all duration-500 ease-out scale-100 group-hover:scale-110 group-hover:opacity-70"
          />
          
          <div className={`absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-30 ${
            theme === 'dark' ? 'bg-white' : 'bg-black'
          }`} />
          
          <div className="absolute top-4 left-4">
            <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wider transition-all duration-500 ${
              theme === 'dark'
                ? 'bg-[var(--primary)] text-white'
                : 'bg-white text-black'
            }`}>
              {post.category}
            </span>
          </div>
        </div>
        
        <div className="space-y-3 transition-all duration-500">
          <h3 className={`text-2xl font-black leading-tight transition-all duration-500 group-hover:text-[var(--primary)] ${
            theme === 'dark' ? 'text-[var(--foreground)]' : 'text-slate-900'
          }`}>
            {post.title}
          </h3>
          
          <p className={`leading-relaxed transition-all duration-500 ${
            theme === 'dark' ? 'text-[var(--muted-foreground)]' : 'text-slate-600'
          }`}>
            {post.description}
          </p>
          
          <div className={`flex items-center gap-3 text-sm transition-all duration-500 ${
            theme === 'dark' ? 'text-[var(--muted-foreground)]' : 'text-slate-500'
          }`}>
            <span className={`font-medium transition-all duration-500 ${
              theme === 'dark' ? 'text-[var(--foreground)]' : 'text-slate-700'
            }`}>{post.author}</span>
            <span>·</span>
            <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default function BlogPage() {
  const { theme } = useTheme();
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
    <div className={`min-h-screen transition-all duration-500 ${
      theme === 'dark' ? 'bg-[var(--background)]' : 'bg-blue-50/50'
    }`}>
      {/* Featured Post */}
      {!searchQuery && featuredPost && !loading && (
        <FeaturedPost post={featuredPost} />
      )}

      {/* Main Content */}
      <section className="py-12 transition-all duration-500">
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
              <h2 className={`text-3xl md:text-4xl font-black mb-2 transition-all duration-500 ${
                theme === 'dark' ? 'text-[var(--foreground)]' : 'text-slate-900'
              }`}>
                {searchQuery ? `Search Results for "${searchQuery}"` : 'Latest Posts'}
              </h2>
              <div className={`w-20 h-1 transition-all duration-500 ${
                theme === 'dark' ? 'bg-[var(--primary)]' : 'bg-black'
              }`} />
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className={`text-sm transition-all duration-500 ${
                theme === 'dark' ? 'text-[var(--muted-foreground)]' : 'text-slate-500'
              }`}>
                Showing {posts.length} post{posts.length !== 1 ? 's' : ''}
                {searchQuery && ` matching "${searchQuery}"`}
              </div>
              
              {/* Category Filter */}
              {categories.length > 0 && !searchQuery && (
                <select
                  className={`px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all duration-500 ${
                    theme === 'dark'
                      ? 'bg-[var(--input)] border-[var(--border)] text-[var(--foreground)] focus:ring-[var(--primary)]'
                      : 'bg-white border-slate-300 text-slate-800 focus:ring-blue-500'
                  }`}
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
              <h3 className={`text-2xl font-bold mb-3 transition-all duration-500 ${
                theme === 'dark' ? 'text-[var(--foreground)]' : 'text-slate-900'
              }`}>
                {searchQuery ? 'No matching posts found' : 'No blog posts yet'}
              </h3>
              <p className={`max-w-md mx-auto transition-all duration-500 ${
                theme === 'dark' ? 'text-[var(--muted-foreground)]' : 'text-slate-600'
              }`}>
                {searchQuery 
                  ? 'Try a different search term or browse our categories below.'
                  : 'Check back soon for new articles and tutorials!'}
              </p>
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className={`mt-6 px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all duration-300 ${
                    theme === 'dark'
                      ? 'bg-[var(--primary)] text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
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
        <section className={`py-12 transition-all duration-500 ${
          theme === 'dark' ? 'bg-[var(--muted)]/30' : 'bg-slate-50'
        }`}>
          <div className="container mx-auto px-6">
            <h3 className={`text-2xl font-bold mb-8 text-center transition-all duration-500 ${
              theme === 'dark' ? 'text-[var(--foreground)]' : 'text-slate-900'
            }`}>
              Browse by Category
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(category.name)}
                  className={`px-4 py-2 rounded-full border transition-all duration-300 ${
                    theme === 'dark'
                      ? 'bg-[var(--input)] border-[var(--border)] text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]'
                      : 'bg-white border-slate-200 hover:border-blue-500 hover:text-blue-600'
                  }`}
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