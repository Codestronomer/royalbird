// app/admin/blogs/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  MoreVertical,
  Calendar,
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { api } from '~/lib/api';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import type { BlogCategory, BlogPost } from '~/types/blog';
import { transformPost } from '~/lib/utils';
import Image from 'next/image';

export default function BlogsManagement() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  const limit = 9;

  useEffect(() => {
    void loadBlogs();
    void loadCategories();
  }, [page, selectedStatus, selectedCategory, searchQuery]);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const response = await api.getBlogPosts({ 
        page: page.toString(),
        limit: limit.toString(),
        ...(selectedStatus !== 'all' && { status: selectedStatus }),
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(searchQuery && { search: searchQuery })
      });
      
      if (response.success) {
        setBlogs(response.data.map(transformPost));
        setTotalPages(response.pagination?.pages || 1);
        setTotalPosts(response.pagination?.total ?? 0);
      }
    } catch (error) {
      console.error('Failed to load blogs:', error);
      toast.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await api.getBlogCategories();
      if (response.success) {
        setCategories(response.data.map((cat: BlogCategory) => cat.name));
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;
    
    try {
      await api.deleteBlogPost(id);
      setBlogs(blogs.filter(blog => blog.id !== id));
      toast.success('Blog post deleted successfully');
    } catch (error) {
      toast.error('Failed to delete blog post');
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'draft' | 'published' | 'scheduled' | 'archived') => {
    try {
      await api.updateBlogPost(id, { status: newStatus });
      setBlogs(blogs.map(blog => 
        blog.id === id ? { ...blog, status: newStatus } : blog
      ));
      toast.success('Status updated successfully');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleRefresh = () => {
    void loadBlogs();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    void loadBlogs();
  };

  const statusOptions = [
    { value: 'all', label: 'All Status', color: 'gray' },
    { value: 'published', label: 'Published', color: 'green' },
    { value: 'draft', label: 'Draft', color: 'yellow' },
    { value: 'scheduled', label: 'Scheduled', color: 'blue' },
    { value: 'archived', label: 'Archived', color: 'red' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-600">Manage your blog posts and articles ({totalPosts} total)</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <Link
            href="/admin/blogs/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 font-medium"
          >
            <Plus className="h-4 w-4" />
            Write New Post
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-sm text-gray-500 mb-1">Total Posts</div>
          <div className="text-2xl font-bold text-gray-900">{totalPosts}</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-sm text-gray-500 mb-1">Published</div>
          <div className="text-2xl font-bold text-green-600">
            {blogs.filter(b => b.status === 'published').length}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-sm text-gray-500 mb-1">Total Views</div>
          <div className="text-2xl font-bold text-blue-600">
            {blogs.reduce((sum, blog) => sum + (blog.views || 0), 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-sm text-gray-500 mb-1">Avg. Read Time</div>
          <div className="text-2xl font-bold text-purple-600">
            {Math.round(blogs.reduce((sum, blog) => sum + (blog.readingTime ?? 5), 0) / Math.max(blogs.length, 1))} min
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-6">
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search blog posts by title or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Apply Filters
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedStatus('all');
                setSelectedCategory('all');
                setPage(1);
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
            >
              Clear Filters
            </button>
            <button
              type="button"
              onClick={() => {
                // Export functionality
                toast.success('Export feature coming soon!');
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Export CSV
            </button>
          </div>
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl shadow p-12">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading blog posts...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && blogs.length === 0 && (
        <div className="bg-white rounded-xl shadow p-12">
          <div className="text-center">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No blog posts found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedStatus !== 'all' || selectedCategory !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first blog post'}
            </p>
            <Link
              href="/admin/blogs/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 font-medium"
            >
              <Plus className="h-5 w-5" />
              Create First Post
            </Link>
          </div>
        </div>
      )}

      {/* Blogs Table */}
      {!loading && blogs.length > 0 && (
        <>
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Post
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category & Tags
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stats
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Published
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {blogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                            {blog.image && (
                              <Image
                                src={blog.image}
                                alt={blog.title}
                                width={48}
                                height={48}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {blog.title}
                            </div>
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {blog.description}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {blog.slug}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {blog.category || 'Uncategorized'}
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {(blog.tags || []).slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                #{tag}
                              </span>
                            ))}
                            {(blog.tags || []).length > 2 && (
                              <span className="text-xs text-gray-500">
                                +{(blog.tags || []).length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={blog.status ?? 'draft'}
                          onChange={(e) => handleStatusChange(blog.id, e.target.value as 'draft' | 'published' | 'scheduled' | 'archived')}
                          className={
                            `
                              text-sm font-medium rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-offset-2 ${getStatusColor(blog.status ?? 'draft')} focus:ring-blue-500
                            `
                          }
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                          <option value="scheduled">Scheduled</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Eye className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{blog.views?.toLocaleString() || 0}</span>
                            <span className="text-gray-500">views</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{blog.readingTime ?? 5}</span>
                            <span className="text-gray-500">min read</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {blog.date
                          ? new Date(blog.date).toLocaleDateString()
                          : 'Not published'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/blog/${blog.slug}`}
                            target="_blank"
                            className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/admin/blogs/edit/${blog.slug}`}
                            className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(blog.id, blog.title)}
                            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white px-6 py-3 rounded-xl shadow">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
                <span className="font-medium">{Math.min(page * limit, totalPosts)}</span> of{' '}
                <span className="font-medium">{totalPosts}</span> results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="inline-flex items-center gap-1 px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-3 py-1 rounded text-sm font-medium ${page === pageNum 
                        ? 'bg-blue-600 text-white' 
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                {totalPages > 5 && page < totalPages - 2 && (
                  <>
                    <span className="px-2">...</span>
                    <button
                      onClick={() => setPage(totalPages)}
                      className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
                
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="inline-flex items-center gap-1 px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}