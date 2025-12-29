// app/admin/comics/page.tsx
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
  Download,
  TrendingUp,
  Calendar,
  Tag,
  CheckCircle,
  XCircle,
  Clock,
  Heart
} from 'lucide-react';
import { api } from '~/lib/api';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import type { ApiGenre, Comic } from '~/types/comics';
import Image from 'next/image';
import { transformComic } from '~/lib/utils';

export default function ComicsManagement() {
  const [comics, setComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [genres, setGenres] = useState<ApiGenre[]>([]);

  useEffect(() => {
    void loadComics();
    void loadGenres();
  }, []);

  const loadComics = async () => {
    try {
      setLoading(true);
      const response = await api.getComics({ 
        limit: '50',
        ...(selectedStatus !== 'all' && { status: selectedStatus }),
        ...(selectedGenre !== 'all' && { genre: selectedGenre }),
        ...(searchQuery && { search: searchQuery })
      });
      
      if (response.success) {
        setComics(response.data.map(transformComic));
      }
    } catch (error) {
      console.error('Failed to load comics:', error);
      toast.error('Failed to load comics');
    } finally {
      setLoading(false);
    }
  };

  const loadGenres = async () => {
    try {
      const response = await api.getComicGenres();
      if (response.success) {
        setGenres(response.data);
      }
    } catch (error) {
      console.error('Failed to load Genres:', error);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    
    try {
      // In real app, call delete API
      // await api.deleteComic(id);
      setComics(comics.filter((comic: Comic) => comic.id !== id));
      toast.success('Comic deleted successfully');
    } catch (error) {
      toast.error('Failed to delete comic');
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'draft' | 'published' | 'scheduled' | 'archived') => {
    try {
      // In real app, call update API
      // await api.updateComicStatus(id, newStatus);
      setComics(comics.map((comic: Comic) => 
        comic.id === id ? { ...comic, status: newStatus } : comic
      ));
      toast.success('Status updated successfully');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const filteredComics = comics.filter((comic: Comic) => 
    searchQuery === '' || 
    comic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comic.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusOptions = [
    { value: 'all', label: 'All Status', color: 'gray' },
    { value: 'published', label: 'Published', color: 'green' },
    { value: 'draft', label: 'Draft', color: 'yellow' },
    { value: 'archived', label: 'Archived', color: 'red' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Comics Management</h1>
          <p className="text-gray-600">Manage your comic series and chapters</p>
        </div>
        <Link
          href="/admin/comics/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 font-medium"
        >
          <Plus className="h-4 w-4" />
          Add New Comic
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search comics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Status Filter */}
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

          {/* genre Filter */}
          <div>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Genres</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.name}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-4">
          <button
            onClick={loadComics}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium"
          >
            Apply Filters
          </button>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedStatus('all');
              setSelectedGenre('all');
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
          >
            Clear Filters
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-sm text-gray-500 mb-1">Total Comics</div>
          <div className="text-2xl font-bold text-gray-900">{comics.length}</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-sm text-gray-500 mb-1">Published</div>
          <div className="text-2xl font-bold text-green-600">
            {comics.filter((c: Comic) => c.status === 'published').length}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-sm text-gray-500 mb-1">Total Views</div>
          <div className="text-2xl font-bold text-blue-600">
            {comics.reduce((sum: number, comic: Comic) => sum + (comic.views ?? 0), 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-sm text-gray-500 mb-1">Total Likes</div>
          <div className="text-2xl font-bold text-red-600">
            {comics.reduce((sum: number, comic: Comic) => sum + (comic.likes ?? 0), 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Comics Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading comics...</p>
            </div>
          </div>
        ) : filteredComics.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No comics found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? 'Try adjusting your search or filters' : 'Get started by creating your first comic'}
            </p>
            <Link
              href="/admin/comics/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 font-medium"
            >
              <Plus className="h-4 w-4" />
              Create First Comic
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comic
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    genre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredComics.map((comic: Comic) => (
                  <tr key={comic.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-lg overflow-hidden">
                          <Image
                            src={comic.coverImage}
                            alt={comic.title}
                            className="h-full w-full object-cover"
                            width={100}
                            height={100}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{comic.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">{comic.description.substring(0, 50)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Tag className="h-3 w-3 mr-1" />
                        {comic.genres[0]?.name ?? 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={comic.status || 'draft'}
                        onChange={(e) => handleStatusChange(comic.id!, e.target.value as 'draft' | 'published' | 'scheduled' | 'archived')}
                        className={`text-sm font-medium rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          comic.status === 'published'
                            ? 'bg-green-100 text-green-800 focus:ring-green-500'
                            : comic.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800 focus:ring-yellow-500'
                            : 'bg-red-100 text-red-800 focus:ring-red-500'
                        }`}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Eye className="h-4 w-4" />
                          {comic.views?.toLocaleString() ?? 0}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Heart className="h-4 w-4" />
                          {comic.likes?.toLocaleString() ?? 0}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {comic.updatedAt ? new Date(comic.updatedAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/comics/${comic.slug}`}
                          target="_blank"
                          className="p-1 text-gray-400 hover:text-blue-600"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/comics/edit/${comic.slug}`}
                          className="p-1 text-gray-400 hover:text-green-600"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(comic.id!, comic.title)}
                          className="p-1 text-gray-400 hover:text-red-600"
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
        )}
      </div>

      {/* Pagination */}
      {filteredComics.length > 0 && (
        <div className="flex items-center justify-between bg-white px-6 py-3 rounded-xl shadow">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to{' '}
            <span className="font-medium">{filteredComics.length}</span> of{' '}
            <span className="font-medium">{comics.length}</span> results
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}