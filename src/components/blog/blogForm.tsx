// app/admin/blogs/[action]/[id]/page.tsx - For both new and edit
'use client';

import { useState, useEffect, useCallback, useMemo, use } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Save, 
  X, 
  Upload, 
  Eye,
  Clock,
  Tag,
  Calendar,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Loader2,
  Image as ImageIcon,
  Code,
  Type,
  Heading,
  List,
  Link as LinkIcon,
  Quote,
  Bold,
  Italic,
  ListOrdered,
  HelpCircle
} from 'lucide-react';
import { api } from '~/lib/api';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import type { ApiBlogPostResponse, BlogCategory, BlogFormData } from '~/types/blog';
import type { User } from '~/types/user';
import type { ApiResponse } from '~/types/api';
import { debounce, formatDate, parseMdxContent } from '~/lib/utils';
import Image from 'next/image';
import { text } from 'stream/consumers';
import * as commands from '@uiw/react-md-editor/commands';
import rehypeSanitize from 'rehype-sanitize';
import type { Q } from 'node_modules/better-auth/dist/index-COnelCGa.mjs';
import LoadingSpinner from '../ui/loadingSpinner';

// Dynamically import markdown editor to avoid SSR issues
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor'),
  { ssr: false }
);

interface BlogFormProps {
  action: 'new' | 'edit';
  blogSlug?: string;
}

const customCommands = [
  {
    ...commands.bold,
    icon: <Bold className="h-4 w-4" />,
    buttonProps: { 
      'aria-label': 'Bold', 
      title: 'Bold',
      className: "p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
    }
  },
  {
    ...commands.italic,
    icon: <Italic className="h-4 w-4" />,
    buttonProps: { 
      'aria-label': 'Italic', 
      title: 'Italic',
      className: "p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
    }
  },
  {
    ...commands.group(
      [commands.heading, commands.heading1, commands.heading2, commands.heading3, commands.heading4],
      {
        name: 'title',
        groupName: 'title',
        icon: <Heading className="h-4 w-4" />,
        buttonProps: { 'aria-label': 'Insert title', title: 'Insert title', className: "p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"}
      }
    )
  },
  commands.divider,
  {
    ...commands.unorderedListCommand,
    icon: <List className="h-4 w-4" />,
    buttonProps: { 'aria-label': 'Unordered List', title: 'Unordered List', className: "p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"}
  },
  {
    ...commands.orderedListCommand,
    icon: <ListOrdered className="h-4 w-4" />,
    buttonProps: { 'aria-label': 'Ordered List', title: 'Ordered List', className: "p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"}
  },
  commands.divider,
  {
    ...commands.link,
    icon: <LinkIcon className="h-4 w-4" />,
    buttonProps: { 'aria-label': 'Insert Link', title: 'Insert Link', className: "p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"}
  },
  {
    ...commands.image,
    icon: <ImageIcon className="h-4 w-4" />,
    buttonProps: { 'aria-label': 'Insert Image', title: 'Insert Image', className: "p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"}
  },
  {
    ...commands.code,
    icon: <Code className="h-4 w-4" />,
    buttonProps: { 'aria-label': 'Insert Code', title: 'Insert Code', className: "p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"}
  },
  {
    ...commands.quote,
    icon: <Quote className="h-4 w-4" />,
    buttonProps: { 'aria-label': 'Insert Quote', title: 'Insert Quote', className: "p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"}
  },
  {
    ...commands.help,
    icon: <HelpCircle className="h-4 w-4" />,
    buttonProps: { 'aria-label': 'Help', title: 'Help', className: "p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"}
  }
];

export default function BlogForm({ action, blogSlug }: BlogFormProps) {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [blogId, setBlogId] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit');
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    slug: '',
    description: '',
    content: '',
    author: '',
    category: '',
    image: '',
    status: 'draft',
    featured: false,
    metaTitle: '',
    metaDescription: '',
    tags: [],
    publishedAt: '',
    scheduledAt: '',
    readingTime: 5,
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewContent, setPreviewContent] = useState<React.ReactNode | undefined>(undefined);

  // Load blog data if editing
  useEffect(() => {
    if (action === 'edit' && blogSlug) {
      void loadBlogData(blogSlug);
    }
    void loadCategories();
    
    // Set default author from localStorage
    const userData = localStorage.getItem('user_data');
    if (userData) {
      const user: User = JSON.parse(userData) as User;
      setFormData(prev => ({
        ...prev,
        author: `${user.firstName ?? ''} ${user.lastName}`
      }));
    }
  }, [blogSlug, action]);

  const debouncedSlugify = useMemo(
    () => debounce((title: string) => {
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }, 500) as (arg: string) => void,
    []
  );

  const debounceParseContent = useMemo(
    () => 
      debounce(async (content: string) => {
        const parsedContent = await parseMdxContent(content);
        setPreviewContent(parsedContent || '');
      }, 1000),
    []
  );

  const handleContentChange = useCallback((content: string | undefined) => {
    const newContent = content ?? '';

    setFormData(prev => {
      const words = Math.ceil(newContent.split(/\s+/).filter(Boolean).length / 200);
      const readingTime = Math.ceil(words/ 200);

      return { ...prev, content: newContent, readingTime };
    })

    debounceParseContent(newContent);
  }, [])

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, title: val }));

    debouncedSlugify(val);
  };

  // Auto-generate meta fields
  useEffect(() => {
    if (!formData.metaTitle && formData.title) {
      setFormData(prev => ({ ...prev, metaTitle: formData.title }));
    }
    if (!formData.metaDescription && formData.description) {
      setFormData(prev => ({ 
        ...prev, 
        metaDescription: formData.description.substring(0, 160) 
      }));
    }
  }, [formData.title, formData.description]);

  const loadBlogData = async (slug: string) => {
    try {
      setLoading(true);
      if (!blogSlug) {
        toast.error('Blog slug is missing');
        router.push('/admin/blogs');
        return;
      }
      const response: ApiResponse<ApiBlogPostResponse> = await api.getBlogPost(slug);
      
      if (response.success) {
        const blog = response.data;
        setBlogId(blog.id);
        setFormData({
          title: blog.title || '',
          slug: blog.slug || '',
          description: blog.description ?? '',
          content: blog.content  ?? '',
          author: blog.author || '',
          category: blog.category || '',
          image: blog.featuredImage ?? '',
          status: blog.status || 'draft',
          featured: blog.featured || false,
          metaTitle: (blog.metaTitle ?? blog.title) || '',
          metaDescription: blog.metaDescription ?? blog.description ?? '',
          tags: blog.tags ?? [],
          publishedAt: blog.publishedAt ? formatDate(blog.publishedAt) : '',
          scheduledAt: formatDate(blog.scheduledAt) ?? '',
          readingTime: blog.readingTime ?? 5,
        });
      } else {
        toast.error('Failed to load blog data');
        router.push('/admin/blogs');
      }
    } catch (error) {
      console.error('Error loading blog:', error);
      toast.error('Failed to load blog data');
      router.push('/admin/blogs');
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    if (!formData.author.trim()) newErrors.author = 'Author is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setSaving(true);
    
    try {
      // Prepare data for API
      const submitData = {
        ...formData,
        description: formData.description,
        featuredImage: formData.image,
        // Convert date strings to Date objects if needed
        ...(formData.publishedAt && { publishedAt: new Date(formData.publishedAt).toISOString() }),
        ...(formData.scheduledAt && { scheduledAt: new Date(formData.scheduledAt).toISOString() }),
      };
      
      let response;
      if (action === 'new') {
        response = await api.createBlogPost(submitData);
      } else {
        response = await api.updateBlogPost(blogId ?? '', submitData);
      }
      
      if (response.success) {
        toast.success(`Blog post ${action === 'new' ? 'created' : 'updated'} successfully!`);
        router.push('/admin/blogs');
      } else {
        toast.error(response.message ?? 'Failed to save blog post');
      }
    } catch (error: unknown) {
      console.error('Save error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save blog post');
    } finally {
      setSaving(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    try {
      // In real app, upload to your server
      // For demo, create object URL
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, featuredImage: imageUrl }));
      
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  if (loading) {
    return (
      <LoadingSpinner message='loading blog data' />
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <Link
            href="/admin/blogs"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blogs
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {action === 'new' ? 'Create New Blog Post' : 'Edit Blog Post'}
          </h1>
          <p className="text-gray-600">
            {action === 'new' 
              ? 'Write and publish a new blog article' 
              : 'Update your blog post content'
            }
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/blogs')}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="blog-form"
            disabled={saving}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 font-medium disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                Saving...
              </>
            ) : action === 'new' ? (
              'Publish Now'
            ) : (
              'Update Post'
            )}
          </button>
        </div>
      </div>

      <form id="blog-form" onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Slug */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={onTitleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter blog post title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug *
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">royalbirdstudios.com/blog/</span>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.slug ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="blog-post-slug"
                    />
                  </div>
                  {errors.slug && (
                    <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Description</h2>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Write a brief description of your blog post..."
              />
              <p className="mt-2 text-sm text-gray-500">
                This will be used as the excerpt and meta description.
              </p>
            </div>

            {/* Content Editor */}
            <div className="bg-white rounded-xl shadow">
              <div className="border-b border-gray-200">
                <div className="flex">
                  <button
                    type="button"
                    onClick={() => setPreviewMode('edit')}
                    className={`px-6 py-3 font-medium text-sm border-b-2 ${
                      previewMode === 'edit'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode('preview')}
                    className={`px-6 py-3 font-medium text-sm border-b-2 ${
                      previewMode === 'preview'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Preview
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {previewMode === 'edit' ? (
                  <>
                    {/* Markdown Editor */}
                    <div className="min-h-[400px]" data-color-mode="light">
                      <MDEditor
                        value={formData.content}
                        onChange={handleContentChange}
                        height={400}
                        preview="edit"
                        previewOptions={{
                          rehypePlugins: [[rehypeSanitize]]
                        }}
                        commands={customCommands}
                        extraCommands={[
                          commands.codeEdit,
                          commands.codePreview,
                          commands.fullscreen,
                        ]}
                      />
                    </div>
                    
                    {errors.content && (
                      <p className="mt-2 text-sm text-red-600">{errors.content}</p>
                    )}
                  </>
                ) : (
                  /* Preview Mode */
                  <div className="prose prose-blue max-w-none min-h-[400px] p-4 border border-gray-200 rounded-lg">
                    <h1 className="text-3xl font-bold mb-4">{formData.title}</h1>
                    <div 
                      className="text-gray-700"
                    >
                      {previewContent}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Publish Card */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Publish</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      status: e.target.value as 'draft' | 'published' | 'scheduled' | 'archived'
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                
                {/* Published At Date */}
                {formData.status === 'published' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Published Date
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.publishedAt}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        publishedAt: e.target.value 
                      }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
                
                {/* Scheduled At Date */}
                {formData.status === 'scheduled' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Schedule For
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.scheduledAt}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        scheduledAt: e.target.value 
                      }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
                
                {/* Featured Checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      featured: e.target.checked 
                    }))}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                    Feature this post on homepage
                  </label>
                </div>
                
                {/* Reading Time */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Estimated reading time:</span>
                  <span className="font-medium">{formData.readingTime} minutes</span>
                </div>
                
                {/* Save Button */}
                <div className="pt-4 border-t">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 font-medium disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>

            {/* Category & Tags */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Categories & Tags</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      category: e.target.value 
                    }))}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Add tags..."
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Featured Image</h2>
              <div className="space-y-4">
                {formData.image ? (
                  <div className="relative">
                    <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={formData.image}
                        alt="Featured preview"
                        className="h-full w-full object-cover"
                        width={600}
                        height={300}
                      />
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, featuredImage: '' }))}
                        className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium"
                      >
                        Remove
                      </button>
                      <label className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm font-medium text-center cursor-pointer">
                        Change
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-2">Upload featured image</p>
                    <p className="text-xs text-gray-500 mb-4">Recommended: 1200x630px</p>
                    <label className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium cursor-pointer">
                      Choose Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    image: e.target.value 
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Or enter image URL..."
                />
              </div>
            </div>

            {/* Author Info */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Author</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    author: e.target.value 
                  }))}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.author ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter author name"
                />
                {errors.author && (
                  <p className="mt-1 text-sm text-red-600">{errors.author}</p>
                )}
              </div>
            </div>

            {/* SEO Settings */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">SEO Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      metaTitle: e.target.value 
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="SEO title (optional)"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.metaTitle ? formData.metaTitle.length : 0}/60 characters
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={formData.metaDescription}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      metaDescription: e.target.value 
                    }))}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="SEO description (optional)"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.metaDescription ? formData.metaDescription.length : 0}/160 characters
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}