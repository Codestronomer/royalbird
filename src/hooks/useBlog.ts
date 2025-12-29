'use client'
import { useState, useEffect } from 'react';
import { api } from '~/lib/api';
import { transformPost } from '~/lib/utils';
import type { ApiResponse } from '~/types/api';
import type { ApiBlogPostResponse, BlogCategory, BlogPost } from '~/types/blog';

export function   useBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchResults, setSearchResults] = useState<BlogPost[] | null>(null);

  const searchPosts = async (query: string) => {
    if (query.trim().length < 2) {
      setSearchResults(null);
      return;
    }

    try {
      const response: ApiResponse<ApiBlogPostResponse[]> = await api.searchBlogPosts(query);
      if (response.success) {
        const transformed = response.data.map(transformPost);
        setSearchResults(transformed);
      }
    } catch {
      // Fallback to client-side filtering
      const filtered = posts.filter(post => 
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.description.toLowerCase().includes(query.toLowerCase()) ||
        post.category.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [featuredResponse, regularResponse]: [ApiResponse<ApiBlogPostResponse[]>, ApiResponse<ApiBlogPostResponse[]>] = await Promise.all([
        api.getFeaturedBlogPosts(1),
        api.getBlogPosts({ status: 'published', limit: '12' })
      ]);

      let featuredPost: BlogPost | null = null;

      if (featuredResponse.success && featuredResponse.data[0]) {
        featuredPost = transformPost(featuredResponse.data[0]);
        setFeaturedPost(featuredPost);
      }

      if (regularResponse.success) {
        const transformedPosts: BlogPost[] = regularResponse.data.map((apiPost: ApiBlogPostResponse) => transformPost(apiPost));
        const filteredPosts: BlogPost[] = featuredPost
          ? transformedPosts.filter((post: BlogPost) => post.slug !== featuredPost?.slug)
          : transformedPosts;
        setPosts(filteredPosts);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load blog posts';
      setError(errorMessage);
      console.error('Error:', err); 
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response: ApiResponse<BlogCategory[]> = await api.getBlogCategories();
      if (response.success) {
        setCategories(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  useEffect(() => {

    const loadData = async () => {
      try {
        await Promise.all([fetchPosts(), fetchCategories()]);
      } catch (err) {
        console.error('Error loading blog data:', err);
      }
    }
    void loadData();
  }, []);

  return {
    posts: searchResults ?? posts,
    isSearching: searchResults !== null,
    featuredPost,
    categories,
    loading,
    error,
    searchPosts,
    clearSearch: () => setSearchResults(null),
    refetchPosts: fetchPosts,
    refetchCategories: fetchCategories
  };
}