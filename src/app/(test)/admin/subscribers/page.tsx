// app/admin/subscribers/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Mail, 
  Download,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  Eye,
  MoreVertical
} from 'lucide-react';
import { api } from '~/lib/api';
import { toast } from 'react-hot-toast';
import { type SubscriberStats, type Subscriber } from '~/types/subscriber';
import LoadingSpinner from '~/components/ui/loadingSpinner';
import Link from 'next/link';

export default function SubscribersManagement() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVerified, setFilterVerified] = useState<string>('all');
  const [subscriberStats, setSubscriberStats] = useState<SubscriberStats | undefined>(undefined)

  useEffect(() => {
    void loadSubscribers();
  }, []);

  const loadSubscribers = async () => {
    try {
      setLoading(true);
      const response = await api.getSubscribers();
      if (response.success) {
        setSubscribers(response.data as Subscriber[]);
      }
      const statResponse = await api.getSubscriberStats()
      if (response.success) {
        setSubscriberStats(statResponse.data);
      }
    } catch (error) {
      console.error('Failed to load subscribers:', error);
      toast.error('Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    // Export subscribers to CSV
    const csvContent = subscribers.map(sub => 
      [sub.email, sub.name, sub.isVerified, sub.createdAt].join(',')
    ).join('\n');
    
    const blob = new Blob([`Email,Name,Verified,Subscribed,Joined\n${csvContent}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subscribers.csv';
    a.click();
  };

  const filteredSubscribers = subscribers.filter(sub => {
    if (searchQuery && !sub.email.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filterVerified === 'verified' && !sub.isVerified) return false;
    if (filterVerified === 'unverified' && sub.isVerified) return false;
    // if (filterVerified === 'unsubscribed' && sub.isSubscribed) return false;
    return true;
  });

  if (loading) {
    return <LoadingSpinner message='Retreiving email subscribers' />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscribers</h1>
          <p className="text-gray-600">Manage your newsletter subscribers</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-sm text-gray-500 mb-1">Total Subscribers</div>
          <div className="text-2xl font-bold text-gray-900">{subscribers.length}</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-sm text-gray-500 mb-1">Verified</div>
          <div className="text-2xl font-bold text-green-600">
            {subscribers.filter(s => s.isVerified).length}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-sm text-gray-500 mb-1">Active</div>
          <div className="text-2xl font-bold text-blue-600">
            {subscribers.filter(s => s.isSubscribed).length}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border border-slate-100">
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">
              Growth ({subscriberStats?.periodDays}d)
            </div>
            <div className={`text-xs font-bold px-2 py-1 rounded ${
              Number(subscriberStats?.growthPercentage) >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
            }`}>
              {subscriberStats?.growthPercentage}%
            </div>
          </div>
          
          <div className="text-3xl font-black text-purple-600">
            {subscriberStats?.netGrowth && subscriberStats.netGrowth > 0 ? `+${subscriberStats.netGrowth}` : subscriberStats?.netGrowth}
          </div>
          
          <div className="mt-4 text-xs text-slate-400 font-medium">
            {subscriberStats?.newSignups} signups • {subscriberStats?.unsubscribes} unsubscribed
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search subscribers by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <select
              value={filterVerified}
              onChange={(e) => setFilterVerified(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Subscribers</option>
              <option value="verified">Verified Only</option>
              <option value="unverified">Unverified Only</option>
              <option value="unsubscribed">Unsubscribed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subscriber
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preferences
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubscribers.map((subscriber) => (
                <tr key={subscriber.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {subscriber.name?.charAt(0) ?? subscriber.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {subscriber.name ?? 'Anonymous'}
                        </div>
                        <div className="text-sm text-gray-500">{subscriber.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {subscriber.preferences?.comic && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Comics
                        </span>
                      )}
                      {subscriber.preferences?.blog && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Blog
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        {subscriber.isVerified ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-green-600">Verified</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm text-yellow-600">Unverified</span>
                          </>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {subscriber.isSubscribed ? 'Subscribed' : 'Unsubscribed'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(subscriber.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/admin/subscribers/${subscriber.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}