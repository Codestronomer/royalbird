'use client';

import { useState, useEffect } from 'react';
import { Heart, Bookmark, Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { api } from '~/lib/api';
import type { ApiResponse } from '~/types/api';
import type { unlikeResponse } from '~/types/blog';
import { toast } from 'react-hot-toast';

interface Props {
  postId: string;
  postSlug: string;
  initialLikes: number;
  initialViews: number;
  showBookmark?: boolean;
  showLikes?: boolean;
  variant?: 'default' | 'sidebar';
}

export default function LikeBookmarkButtons({
  postId,
  postSlug,
  initialLikes = 0,
  initialViews = 0,
  showBookmark,
  showLikes,
  variant = 'default',
 }: Props) {
  const [isMounted, setIsMounted] = useState(false);
  const [likes, setLikes] = useState<number>(initialLikes);
  const [views, setViews] = useState<number>(initialViews);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [likeLoading, setLikeLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  const getOrCreateUserId = () => {
    if (typeof window === 'undefined') return '';

    let uid: string | null = localStorage.getItem('user_id');

    if (!uid) {
      uid = uuidv4();
      localStorage.setItem('user_id', uid);
    }

    return uid;
  };

  const getSessionId = (): string => {
    if (typeof window === 'undefined') return '';
    
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = uuidv4();
      sessionStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  }

  const getDeviceFingerprint = () => {
    if (typeof window === 'undefined') return '';
    
    const fingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      cookiesEnabled: navigator.cookieEnabled,
    };
    
    return btoa(JSON.stringify(fingerprint)).substring(0, 32);
  }


  const getUserIdentifier = async () => {
    const userId = getOrCreateUserId();
    const sessionId = getSessionId();
    const fingerprint = getDeviceFingerprint();
    
    // Combine multiple identifiers for better uniqueness
    return `${userId}_${sessionId}_${fingerprint}`;
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Track view on component mount
  useEffect(() => {
    const trackView = async () => {
      const sessionKey = `viewed_${postId}`;
      const hasViewedInSession = sessionStorage.getItem(sessionKey);

      // Only increment if they haven't viewed it in this specific tab session
      if (!hasViewedInSession) {
        try {
          await api.incrementBlogViews(postId);
          sessionStorage.setItem(sessionKey, 'true');
          setViews((prev) => prev + 1);
        } catch (error) {
          console.error('Failed to track view:', error);
        }
      }
    };

    void trackView();
  }, [postId]);

  // Check like status and initialize user ID on mount
  useEffect(() => {
    const initializeUserData = async () => {
      try {
        // Initialize user ID
        const uid = getOrCreateUserId();
        setUserId(uid);

        // Check like status from API
        const identifier = await getUserIdentifier();
        const likeStatus = await api.checkLikeStatus(postId, identifier);
        
        if (likeStatus.success) {
          setIsLiked(likeStatus.data.hasLiked);
          setLikes(likeStatus.data.likes);
        }

        // Check bookmarks from localStorage
        const bookmarkedPosts: string[] = JSON.parse(localStorage.getItem('bookmarked_posts') ?? '[]') as string[];
        setIsBookmarked(bookmarkedPosts.includes(postSlug));
      } catch (error) {
        console.error('Failed to initialize user data:', error);
        
        // Fallback to localStorage for likes
        const likedPosts: string[] = JSON.parse(localStorage.getItem('liked_posts') ?? '[]') as string[];
        setIsLiked(likedPosts.includes(postSlug));
      }
    };

    initializeUserData().catch((err) => {
      console.error('Initialization error:', err);
    });
  }, [postId, postSlug]);

  const handleLike = async () => {
    if (isLiked || likeLoading) return;

    try {
      setLikeLoading(true);
      
      // Get user identifier
      const identifier = await getUserIdentifier();
      
      // Optimistic UI update
      setLikes(prev => prev + 1);
      setIsLiked(true);
      
      // Save to localStorage as backup
      const likedPosts: string[] = JSON.parse(localStorage.getItem('liked_posts') ?? '[]') as string[];
      localStorage.setItem('liked_posts', JSON.stringify([...likedPosts, postSlug]));
      
      // Call API to like the post
      const result = await api.likeBlogPost(postId, identifier);
      
      if (!result.success) {
        // Rollback on error
        setLikes(prev => prev - 1);
        setIsLiked(false);
        
        const updatedLikes = likedPosts.filter((slug: string) => slug !== postSlug);
        localStorage.setItem('liked_posts', JSON.stringify(updatedLikes));
        
        toast.error(result.message ?? 'Failed to like post');
      } else {
        // Update with actual data from server
        setLikes(result.data.likes);
        toast.success('Post liked!');
      }
    } catch (error) {
      console.error('Like error:', error);
      toast.error((error as Error).message ?? 'Failed to like post');
      
      // Rollback
      setLikes(prev => prev - 1);
      setIsLiked(false);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleUnlike = async () => {
    if (!isLiked || likeLoading) return;

    try {
      setLikeLoading(true);
      
      // Get user identifier
      const identifier = await getUserIdentifier();
      
      // Optimistic UI update
      setLikes(prev => Math.max(0, prev - 1));
      setIsLiked(false);
      
      // Remove from localStorage
      const likedPosts: string[] = JSON.parse(localStorage.getItem('liked_posts') ?? '[]') as string[];
      const updatedLikes = likedPosts.filter((slug: string) => slug !== postSlug);
      localStorage.setItem('liked_posts', JSON.stringify(updatedLikes));
      
      // Call API to unlike the post
      const result: ApiResponse<unlikeResponse> = await api.unlikeBlogPost(postId, identifier);
      
      if (!result.success) {
        // Rollback on error
        setLikes(prev => prev + 1);
        setIsLiked(true);
        localStorage.setItem('liked_posts', JSON.stringify([...updatedLikes, postSlug]));
        
        toast.error(result.message ?? 'Failed to unlike post');
      } else {
        // Update with actual data from server
        setLikes(result.data.likes);
        toast.success('Post unliked');
      }
    } catch (error) {
      console.error('Unlike error:', error);
      toast.error((error as Error).message ?? 'Failed to unlike post');
      
      // Rollback
      setLikes(prev => prev + 1);
      setIsLiked(true);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleBookmark = () => {
    const bookmarkedPosts = JSON.parse(localStorage.getItem('bookmarked_posts') ?? '[]') as string[];
    let newBookmarks;

    if (isBookmarked) {
      newBookmarks = bookmarkedPosts.filter((slug: string) => slug !== postSlug);
      toast.success('Removed from bookmarks');
    } else {
      newBookmarks = [...bookmarkedPosts, postSlug];
      toast.success('Saved to bookmarks');
    }

    localStorage.setItem('bookmarked_posts', JSON.stringify(newBookmarks));
    setIsBookmarked(!isBookmarked);
  };

  const handleToggleLike = () => {
    if (isLiked) {
      handleUnlike().then().catch((err) => {
        console.error('Unlike error:', err);
      });
    } else {
      handleLike().catch((err) => {
        console.error('Like error:', err);
      });
    }
  };

  if (!isMounted) {
    return (
      <div className="flex gap-4 opacity-50">
        <div className="h-10 w-24 bg-white/10 rounded-full animate-pulse" />
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className="flex flex-col items-center gap-4">
        {/* Sidebar Like Button */}
        <div className="bg-white rounded-2xl p-4 shadow-2xl border border-slate-200">
          <button 
            onClick={handleToggleLike}
            disabled={likeLoading}
            className="group flex flex-col items-center p-2 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
          >
            {likeLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            ) : (
              <Heart 
                className={`w-6 h-6 transition-colors ${
                  isLiked ? 'fill-current text-red-500' : 'text-slate-600'
                } group-hover:text-red-500 mb-1`} 
              />
            )}
            {/* <span className="text-xs font-semibold text-slate-600">{likes}</span> */}
          </button>
        </div>

        {/* The Share Buttons are handled in the Page.tsx, 
            so we put the Bookmark Button here */}
        <div className="bg-white rounded-2xl p-4 shadow-2xl border border-slate-200">
          <button 
            onClick={handleBookmark}
            className="group p-2 hover:bg-blue-50 rounded-xl transition-colors"
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark post'}
          >
            <Bookmark 
              className={`w-6 h-6 transition-colors ${
                isBookmarked ? 'fill-current text-blue-600' : 'text-slate-600'
              } group-hover:text-blue-600`} 
            />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3 md:gap-4">
      {/* Views Counter */}
      <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm text-white">
        <span className="font-semibold">{views.toLocaleString()}</span>
        <span className="text-white/70">views</span>
      </div>
      
      {/* Like Button */}
      <button 
        onClick={handleToggleLike}
        disabled={likeLoading}
        className={`group flex items-center gap-2 px-5 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 border ${
          isLiked
          ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/25'
          : 'bg-gradient-to-r from-blue-500/90 to-purple-600/90 text-white border-white/30 hover:shadow-lg hover:shadow-blue-500/25'
        } disabled:opacity-70 disabled:cursor-not-allowed`}
        aria-label={isLiked ? 'Unlike this post' : 'Like this post'}
      >
        {likeLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Heart className={`w-5 h-5 transition-transform ${isLiked ? 'fill-current animate-pulse' : 'group-hover:scale-110'}`} />
        )}
        
        {showLikes && (
          <span className="font-bold">
            {likes.toLocaleString()} {likes === 1 ? 'Like' : 'Likes'}
          </span>
        )}
        
        {!showLikes && isLiked && (
          <span className="font-bold">Liked</span>
        )}
        
        {!showLikes && !isLiked && (
          <span className="font-bold">Like</span>
        )}
      </button>
      
      {/* Bookmark Button */}
      {showBookmark && (
        <button 
          onClick={handleBookmark}
          className={`group flex items-center gap-2 px-5 py-3 rounded-full font-semibold transition-all duration-300 border ${
            isBookmarked 
            ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/25' 
            : 'bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20 hover:shadow-lg hover:shadow-blue-500/25'
          }`}
          aria-label={isBookmarked ? 'Remove from bookmarks' : 'Save to bookmarks'}
        >
          <Bookmark className={`w-5 h-5 transition-transform ${isBookmarked ? 'fill-current animate-bounce' : 'group-hover:scale-110'}`} />
          <span className="font-bold">
            {isBookmarked ? 'Saved' : 'Save'}
          </span>
        </button>
      )}
    </div>
  );
}