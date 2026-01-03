'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Save, Upload, BookOpen,
  User, FileText, Loader2
} from 'lucide-react';
import { api } from '~/lib/api';
import { toast } from 'react-hot-toast';
import type { ApiGenre, Comic } from '~/types/comics';
import Image from 'next/image';
import { debounce } from '~/lib/utils';
import LoadingSpinner from '../ui/loadingSpinner';

interface ComicFormProps {
  action: 'new' | 'edit';
  slug?: string;
}

export default function ComicForm({ action, slug }: ComicFormProps) {
  const router = useRouter();
  const [fetching, setFetching] = useState(action === 'edit');
  const [submitting, setSubmitting] = useState(false);
  const [genres, setGenres] = useState<ApiGenre[]>([]);
  
  const [isCreatingGenre, setIsCreatingGenre] = useState(false);
  const [newGenreName, setNewGenreName] = useState('');
  const [newGenreColor, setNewGenreColor] = useState('#4F46E5');
  const [comicId, setComicId] = useState('')

  const [formData, setFormData] = useState<Comic>({
    title: '',
    slug: '',
    description: '',
    coverImage: '',
    pdfUrl: '',
    featured: false,
    format: 'digital',
    contentType: 'images',
    status: 'draft',
    ageRating: '13+',
    availability: 'Ongoing',
    language: 'en',
    totalPages: 0,
    writer: '',
    artist: '',
    colorist: '',
    letterer: '',
    issueNumber: 1,
    genres: [], 
    tags: [],
    scheduledAt: '',
    readTime: '',
  });

  useEffect(() => {
    const init = async () => {
      try {
        const genreRes = await api.getComicGenres();
        if (genreRes.success) setGenres(genreRes.data);

        if (action === 'edit' && slug) {
          const comicRes = await api.getComic(slug);
          if (comicRes.success) {
            const comic = comicRes.data;
            setComicId(comic._id!)
            setFormData({
              ...comic,
              readTime: comic.estimatedReadTime,
              scheduledAt: comic.scheduledAt ? new Date(comic.scheduledAt).toISOString().slice(0, 16) : '',
              genres: comic.genres || [] as ApiGenre[],
            });
          }
        }
      } catch (error) {
        toast.error('Failed to load data');
      } finally {
        setFetching(false);
      }
    };
    void init();
  }, [action, slug]);

  const debouncedSlugify = useMemo(
    () => debounce((title: string) => {
      if (action === 'edit') return;
      const slug = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/--+/g, '-').trim();
      setFormData(prev => ({ ...prev, slug }));
    }, 500),
    [action]
  );

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, title: val }));
    debouncedSlugify(val);
  };

  const toggleGenre = (genre: ApiGenre) => {
    setFormData((prev) => {
      // Helper to extract ID safely
      const getSafeId = (g: ApiGenre | string) => (typeof g === 'object' ? (g.id ?? g._id) : g);
      const targetId = genre.id ?? genre._id;

      const isSelected = prev.genres.some((g) => getSafeId(g) === targetId);

      return {
        ...prev,
        genres: isSelected
          ? prev.genres.filter((g) => getSafeId(g) !== targetId)
          : [...prev.genres, genre],
      } as Comic; // Explicit cast ensures the whole object is returned
    });
  };

  const handleQuickCreateGenre = async () => {
    if (!newGenreName.trim()) return;
    try {
      const slug = newGenreName.toLowerCase().replace(/\s+/g, '-');
      const response = await api.createGenre({ name: newGenreName, color: newGenreColor, slug });
      if (response.success) {
        toast.success('Genre added!');
        setGenres(prev => [...prev, response.data]);
        setFormData(prev => ({ ...prev, genres: [...prev.genres, response.data] }));
        setNewGenreName('');
        setIsCreatingGenre(false);
      }
    } catch (error) { toast.error('Failed to create genre'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.genres.length === 0) return toast.error('Select at least one genre');

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        // API COMPLIANCE: Convert ApiGenre objects to string IDs
        genres: formData.genres.map((g: ApiGenre | string) => 
          typeof g === 'object' ? (g.id ?? g._id) : g
        ),
        scheduledAt: formData.scheduledAt ? new Date(formData.scheduledAt).toISOString() : undefined,
        totalPages: Number(formData.totalPages),
        issueNumber: Number(formData.issueNumber),
        estimatedReadTime: formData.readTime,
      };

      if (action === 'new') {
        await api.createComic(payload);
        toast.success('Comic created!');
      } else {
        await api.updateComic(comicId, payload);
        toast.success('Comic updated!');
      }
      router.push('/admin/comics');
      router.refresh();
    } catch {
      toast.error('Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (fetching) return <LoadingSpinner message="Loading comic data..." />;

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 sticky top-0 z-20 bg-gray-50/90 backdrop-blur-md py-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {action === 'new' ? 'Create New Comic' : `Edit: ${formData.title}`}
          </h1>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => router.back()} className="px-4 py-2 border rounded-lg hover:bg-white transition-colors">
            Cancel
          </button>
          <button 
            type="submit" 
            form="comic-form" 
            disabled={submitting} 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {action === 'new' ? 'Publish' : 'Save'}
          </button>
        </div>
      </div>

      <form id="comic-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2"><BookOpen className="h-5 w-5 text-blue-600" /> Basic Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input type="text" required value={formData.title} onChange={onTitleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug *</label>
                <input type="text" required value={formData.slug} readOnly disabled={action === 'edit'} className="w-full px-4 py-2 border rounded-lg bg-gray-50 disabled:text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea required rows={4} value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><User className="h-5 w-5 text-purple-600" /> Creative Team</h2>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Writer" value={formData.writer} onChange={(e) => setFormData(prev => ({ ...prev, writer: e.target.value }))} className="px-4 py-2 border rounded-lg" />
              <input type="text" placeholder="Artist" value={formData.artist} onChange={(e) => setFormData(prev => ({ ...prev, artist: e.target.value }))} className="px-4 py-2 border rounded-lg" />
              <input 
                type="text" 
                placeholder="Colorist" 
                value={formData.colorist} 
                onChange={(e) => setFormData(prev => ({ ...prev, colorist: e.target.value }))} 
                className="px-4 py-2 border rounded-lg" 
              />
              <input 
                type="text" 
                placeholder="Letterer" 
                value={formData.letterer} 
                onChange={(e) => setFormData(prev => ({ ...prev, letterer: e.target.value }))} 
                className="px-4 py-2 border rounded-lg" 
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2"><FileText className="h-5 w-5 text-green-600" /> Content</h2>
            <div className="grid grid-cols-2 gap-4">
              <input type="number" placeholder="Issue #" value={formData.issueNumber} onChange={(e) => setFormData(prev => ({ ...prev, issueNumber: parseInt(e.target.value) }))} className="px-4 py-2 border rounded-lg" />
              <input type="number" placeholder="Total Pages" value={formData.totalPages} onChange={(e) => setFormData(prev => ({ ...prev, totalPages: parseInt(e.target.value) }))} className="px-4 py-2 border rounded-lg" />
              <input 
                type="text" 
                placeholder="Read Time (e.g. 5 mins)" 
                value={formData.readTime}
                onChange={(e) => setFormData(prev => ({ ...prev, readTime: e.target.value }))} 
                className="px-4 py-2 border rounded-lg" 
              />
            </div>
            <input type="text" placeholder="PDF URL" value={formData.pdfUrl} onChange={(e) => setFormData(prev => ({ ...prev, pdfUrl: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
             <h2 className="font-bold">Status, Promotion & Availability</h2>
             <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-blue-900">Featured Comic</span>
                <span className="text-[10px] text-blue-700">Display on homepage banner</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
             <select value={formData.status} onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as  "draft" | "published" | "scheduled" | "archived" }))} className="w-full px-4 py-2 border rounded-lg">
               <option value="draft">Draft</option>
               <option value="published">Published</option>
               <option value="scheduled">Scheduled</option>
             </select>
             <select value={formData.availability} onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value as 'Completed' | 'Ongoing' | 'Coming Soon' }))} className="w-full px-4 py-2 border rounded-lg">
               <option value="Ongoing">Ongoing</option>
               <option value="Completed">Completed</option>
               <option value="Coming Soon">Coming Soon</option>
             </select>
             <input type="datetime-local" value={formData.scheduledAt} onChange={(e) => setFormData(prev => ({ ...prev, scheduledAt: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between mb-4">
              <h2 className="font-bold">Genres</h2>
              <button type="button" onClick={() => setIsCreatingGenre(!isCreatingGenre)} className="text-xs text-blue-600">
                {isCreatingGenre ? 'Cancel' : '+ New'}
              </button>
            </div>
            {isCreatingGenre && (
              <div className="flex gap-2 mb-4">
                <input type="text" value={newGenreName} onChange={(e) => setNewGenreName(e.target.value)} className="flex-1 px-2 py-1 border rounded text-sm" placeholder="Name" />
                <button type="button" onClick={handleQuickCreateGenre} className="px-2 py-1 bg-blue-600 text-white text-xs rounded">Add</button>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {genres.map(genre => (
                <button
                  key={genre.id || genre._id}
                  type="button"
                  onClick={() => toggleGenre(genre)}
                  className={`px-3 py-1 rounded-full text-xs transition-colors ${
                    formData.genres.some(g => (g.id === genre.id || g._id === genre._id)) ? 'bg-blue-600 text-white' : 'bg-gray-100'
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold mb-4">Cover Artwork</h2>
            <div className="aspect-[2/3] relative bg-gray-50 border-2 border-dashed rounded-lg flex items-center justify-center overflow-hidden mb-4">
              {formData.coverImage ? <Image src={formData.coverImage} fill className="object-cover" alt="Cover" /> : <Upload className="text-gray-300" />}
            </div>
            <input type="text" placeholder="Cover Image URL" value={formData.coverImage} onChange={(e) => setFormData(prev => ({ ...prev, coverImage: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>
        </div>
      </form>
    </div>
  );
}