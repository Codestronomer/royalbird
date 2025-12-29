// app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  BookOpen,
  FileText,
  Eye,
  Heart,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { api } from '~/lib/api';
import Link from 'next/link';
import type { ApiComicResponse, Comic } from '~/types/comics';
import type { ApiBlogPostResponse, BlogPost } from '~/types/blog';
import type { ApiResponse } from '~/types/api';
import { transformComic, transformPost } from '~/lib/utils';
import Image from 'next/image';
import type { Url } from 'next/dist/shared/lib/router/router';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalComics: 0,
    totalBlogs: 0,
    totalSubscribers: 0,
    totalViews: 0,
    totalLikes: 0,
    growthRate: 0,
    comicTrend: 0,
    blogTrend: 0,
    subscriberTrend: 0,
    viewsTrend: 0,
    likesTrend: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentComics, setRecentComics] = useState<Comic[]>([]);
  const [recentBlogs, setRecentBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    loadDashboardData().catch(console.error);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load stats
      const response = await api.getAdminStats()
      const data = response.data;
      // Get featured comics and blogs
      const [featuredComics, featuredBlogs] = await Promise.all([
        api.getFeaturedComics(),
        api.getFeaturedBlogPosts(5)
      ]);

      setStats({
        totalComics: data.totalComics,
        comicTrend: data.comicTrend,
        totalBlogs: data.totalBlogs,
        blogTrend: data.blogTrend,
        totalSubscribers: data.totalSubscribers,
        subscriberTrend: data.subscriberTrend,
        totalViews: data.totalViews,
        viewsTrend: data.viewsTrend,
        totalLikes: data.totalLikes,
        likesTrend: data.likesTrend,
        growthRate: data.growthRate,
      });

      setRecentComics(featuredComics.data.map(transformComic) || []);
      setRecentBlogs(featuredBlogs.data.map(transformPost) || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Welcome back, Admin!</h2>
        <p className="text-blue-100">Here&apos;s what&apos;s happening with your platform today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Comics"
          value={stats.totalComics}
          icon={BookOpen}
          trend={stats.comicTrend}
          color="blue"
          href="/admin/comics"
        />
        <StatCard
          title="Total Blog Posts"
          value={stats.totalBlogs}
          icon={FileText}
          trend={stats.blogTrend}
          color="purple"
          href="/admin/blogs"
        />
        <StatCard
          title="Subscribers"
          value={stats.totalSubscribers}
          icon={Users}
          trend={stats.subscriberTrend}
          color="green"
          href="/admin/subscribers"
        />
        <StatCard
          title="Total Views"
          value={stats.totalViews.toLocaleString()}
          icon={Eye}
          trend={stats.viewsTrend}
          color="orange"
        />
        <StatCard
          title="Total Likes"
          value={stats.totalLikes.toLocaleString()}
          icon={Heart}
          trend={stats.likesTrend}
          color="red"
        />
        <StatCard
          title="Growth Rate"
          value={`${stats.growthRate}%`}
          icon={TrendingUp}
          trend={stats.growthRate}
          color="indigo"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/comics/new"
            className="group bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5 hover:shadow-lg transition-shadow"
          >
            <BookOpen className="h-8 w-8 text-blue-600 mb-3" />
            <h4 className="font-bold text-gray-900 mb-1">Add New Comic</h4>
            <p className="text-sm text-gray-600">Create a new comic series</p>
          </Link>
          <Link
            href="/admin/blogs/new"
            className="group bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-5 hover:shadow-lg transition-shadow"
          >
            <FileText className="h-8 w-8 text-purple-600 mb-3" />
            <h4 className="font-bold text-gray-900 mb-1">Write Blog Post</h4>
            <p className="text-sm text-gray-600">Create a new blog article</p>
          </Link>
          <Link
            href="/admin/upload"
            className="group bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-5 hover:shadow-lg transition-shadow"
          >
            <Download className="h-8 w-8 text-green-600 mb-3" />
            <h4 className="font-bold text-gray-900 mb-1">Upload Media</h4>
            <p className="text-sm text-gray-600">Upload images and files</p>
          </Link>
          <Link
            href="/admin/analytics"
            className="group bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-5 hover:shadow-lg transition-shadow"
          >
            <TrendingUp className="h-8 w-8 text-orange-600 mb-3" />
            <h4 className="font-bold text-gray-900 mb-1">View Analytics</h4>
            <p className="text-sm text-gray-600">Check platform analytics</p>
          </Link>
        </div>
      </div>

      {/* Recent Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Comics */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Recent Comics</h3>
            <Link href="/admin/comics" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {recentComics.map((comic) => (
              <div key={comic.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 overflow-hidden">
                    {comic.coverImage && (
                      <Image
                        src={comic.coverImage}
                        alt={comic.title}
                        className="h-full w-full object-cover"
                        width={100}
                        height={100}
                      />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{comic.title}</h4>
                    <p className="text-sm text-gray-500">{comic.genres[0]?.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-sm">
                    <Eye className="h-4 w-4 text-gray-400" />
                    <span>{comic.views?.toLocaleString() ?? 0}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {comic.status || 'Draft'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Blog Posts */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Recent Blog Posts</h3>
            <Link href="/admin/blogs" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {recentBlogs.map((blog) => (
              <div key={blog.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 overflow-hidden">
                    {blog.image && (
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        className="h-full w-full object-cover"
                        height={100}
                        width={100}
                      />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 line-clamp-1">{blog.title}</h4>
                    <p className="text-sm text-gray-500">{blog.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {blog.views?.toLocaleString() || 0} views
                  </div>
                  <div className="text-xs text-gray-500">
                    {blog.status ?? 'Draft'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard(
  {
    title,
    value,
    icon: Icon,
    trend,
    color,
    href 
  } : {
    title: string; 
    value: string | number;
    trend: number;
    href?: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    color: 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'indigo';
  }
) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  };

  const Wrapper = href ? Link : 'div';

  return (
    <Wrapper
      href={href as Url}
      className={`border rounded-2xl p-6 hover:shadow-lg transition-shadow ${colorClasses[color]}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color].split(' ')[0]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex items-center text-sm">
          {trend > 0 ? (
            <>
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">+{trend}%</span>
            </>
          ) : (
            <>
              <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-red-600 font-medium">{trend}%</span>
            </>
          )}
        </div>
      </div>
      <div className="text-3xl font-bold mb-2">{value}</div>
      <div className="text-sm font-medium opacity-80">{title}</div>
    </Wrapper>
  );
}