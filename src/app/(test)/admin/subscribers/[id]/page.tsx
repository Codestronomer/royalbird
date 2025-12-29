// app/admin/subscribers/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Mail,
  User,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Bell,
  Edit,
  Trash2,
  RefreshCw,
  ExternalLink,
  BarChart3,
  Eye,
  Send,
  MessageSquare,
  Download,
  Globe,
  Shield,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { api } from '~/lib/api';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import LoadingSpinner from '~/components/ui/loadingSpinner';
import type { Subscriber } from '~/types/subscriber';

interface SubscriberDetails {
  subscriber: Subscriber;
  // activities: SubscriberActivity[];
  emailStats: {
    totalSent: number;
    totalOpened: number;
    totalClicked: number;
    openRate: number;
    clickRate: number;
    lastEmailSent?: Date;
  };
  // campaigns: EmailCampaign[];
}

export default function SubscriberDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const subscriberId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [details, setDetails] = useState<SubscriberDetails | null>(null);
  const [showMoreActivities, setShowMoreActivities] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showResendModal, setShowResendModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    preferences: {
      comic: false,
      blog: false,
      announcements: false,
      weeklyDigest: false,
    }
  });

  useEffect(() => {
    void loadSubscriberDetails();
  }, [subscriberId]);

  const loadSubscriberDetails = async () => {
    try {
      setLoading(true);
      // In real app, use dedicated endpoint like api.getSubscriberDetails(id)
      const [subscriberResponse] = await Promise.all([
        api.getSubscriberDetails(subscriberId),
        // api.getSubscriberActivities(subscriberId)
      ]);

      if (subscriberResponse.success) {
        
        const subscriber = subscriberResponse.data as Subscriber;
        
        if (subscriber) {
          setDetails({
            subscriber,
            // activities: activitiesResponse.success ? activitiesResponse.data : [],
            emailStats: {
              totalSent: 1,
              totalOpened: 0,
              totalClicked: 0,
              openRate: 0,
              clickRate: 0,
              lastEmailSent: new Date('2025-12-15')
            },
            // campaigns: [
            //   { id: '1', name: 'Welcome Series', status: 'completed', sentAt: new Date('2024-01-10'), opened: true, clicked: true },
            //   { id: '2', name: 'Weekly Digest', status: 'completed', sentAt: new Date('2024-01-17'), opened: true, clicked: false },
            //   { id: '3', name: 'New Comic Alert', status: 'completed', sentAt: new Date('2024-01-20'), opened: false, clicked: false },
            // ]
          });

          setEditForm({
            name: subscriber.name ?? '',
            preferences: subscriber.preferences || {
              comic: false,
              blog: false,
              announcements: false,
              weeklyDigest: false,
            }
          });
        } else {
          toast.error('Subscriber not found');
          router.push('/admin/subscribers');
        }
      }
    } catch (error) {
      console.error('Failed to load subscriber details:', error);
      toast.error('Failed to load subscriber details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubscriber = async () => {
    try {
      setUpdating(true);
      // In real app, call update API
      // await api.updateSubscriber(subscriberId, editForm);
      toast.success('Subscriber updated successfully');
      setEditMode(false);
      void loadSubscriberDetails(); // Refresh data
    } catch (error) {
      toast.error('Failed to update subscriber');
    } finally {
      setUpdating(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      // In real app, call resend verification API
      // await api.resendVerification(subscriberId);
      toast.success('Verification email resent successfully');
      setShowResendModal(false);
    } catch (error) {
      toast.error('Failed to resend verification email');
    }
  };

  const handleDeleteSubscriber = async () => {
    try {
      // In real app, call delete API
      // await api.deleteSubscriber(subscriberId);
      toast.success('Subscriber deleted successfully');
      router.push('/admin/subscribers');
    } catch (error) {
      toast.error('Failed to delete subscriber');
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (!confirm('Are you sure you want to unsubscribe this subscriber?')) return;
    
    try {
      // In real app, call unsubscribe API
      // await api.unsubscribeSubscriber(subscriberId);
      toast.success('Subscriber unsubscribed successfully');
      void loadSubscriberDetails();
    } catch (error) {
      toast.error('Failed to unsubscribe');
    }
  };

  const handleResubscribe = async () => {
    try {
      // In real app, call resubscribe API
      // await api.resubscribeSubscriber(subscriberId);
      toast.success('Subscriber resubscribed successfully');
      void loadSubscriberDetails();
    } catch (error) {
      toast.error('Failed to resubscribe');
    }
  };

  const handleExportData = () => {
    if (!details) return;
    
    const exportData = {
      subscriber: details.subscriber,
      // activities: details.activities,
      emailStats: details.emailStats,
      // campaigns: details.campaigns,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscriber-${details.subscriber.email}-data.json`;
    a.click();
    
    toast.success('Data exported successfully');
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'subscribe': return <Mail className="h-4 w-4 text-green-500" />;
      case 'unsubscribe': return <Mail className="h-4 w-4 text-red-500" />;
      case 'email_open': return <Eye className="h-4 w-4 text-blue-500" />;
      case 'email_click': return <ExternalLink className="h-4 w-4 text-purple-500" />;
      case 'verification': return <Shield className="h-4 w-4 text-yellow-500" />;
      case 'preference_change': return <Edit className="h-4 w-4 text-gray-500" />;
      default: return <Bell className="h-4 w-4 text-gray-400" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'subscribe': return 'bg-green-50 text-green-700';
      case 'unsubscribe': return 'bg-red-50 text-red-700';
      case 'email_open': return 'bg-blue-50 text-blue-700';
      case 'email_click': return 'bg-purple-50 text-purple-700';
      case 'verification': return 'bg-yellow-50 text-yellow-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading subscriber details..." />;
  }

  if (!details) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-5xl mb-4">👤</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Subscriber not found</h2>
          <p className="text-gray-600 mb-6">The subscriber you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/admin/subscribers"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Subscribers
          </Link>
        </div>
      </div>
    );
  }

  const { subscriber, emailStats } = details;
  // const displayedActivities = showMoreActivities ? activities : activities.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex flex-col items-left gap-4">
          <Link
            href="/admin/subscribers"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Subscribers
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Subscriber Details</h1>
            <p className="text-gray-600">Manage and view subscriber information</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportData}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
          >
            <Download className="h-4 w-4" />
            Export Data
          </button>
          <button
            onClick={() => setEditMode(!editMode)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            <Edit className="h-4 w-4" />
            {editMode ? 'Cancel Edit' : 'Edit'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Subscriber Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">
                  {subscriber.name?.charAt(0) ?? subscriber.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {editMode ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        className="px-3 py-1 border border-gray-300 rounded-lg"
                        placeholder="Enter name"
                      />
                    ) : (
                      subscriber.name ?? 'Anonymous Subscriber'
                    )}
                  </h2>
                  <p className="text-gray-600">{subscriber.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      subscriber.isVerified 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {subscriber.isVerified ? (
                        <>
                          <CheckCircle className="h-3 w-3" />
                          Verified
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3" />
                          Unverified
                        </>
                      )}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      subscriber.isSubscribed 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {subscriber.isSubscribed ? 'Subscribed' : 'Unsubscribed'}
                    </span>
                  </div>
                </div>
              </div>
              
              {!editMode && (
                <div className="flex gap-2">
                  {!subscriber.isVerified && (
                    <button
                      onClick={() => setShowResendModal(true)}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 text-sm font-medium"
                    >
                      <Send className="h-3 w-3" />
                      Resend Verification
                    </button>
                  )}
                  {subscriber.isSubscribed ? (
                    <button
                      onClick={handleUnsubscribe}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 text-sm font-medium"
                    >
                      Unsubscribe
                    </button>
                  ) : (
                    <button
                      onClick={handleResubscribe}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 text-sm font-medium"
                    >
                      Resubscribe
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Preferences */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Email Preferences</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {editMode ? (
                  Object.entries(editForm.preferences).map(([key, value]) => (
                    <label key={key} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setEditForm(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences, [key]: e.target.checked }
                        }))}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700 capitalize">{key}</span>
                    </label>
                  ))
                ) : (
                  Object.entries(subscriber.preferences || {}).map(([key, value]) => (
                    <div
                      key={key}
                      className={`p-3 rounded-lg border ${value ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${value ? 'bg-blue-500' : 'bg-gray-300'}`} />
                        <span className="text-sm font-medium text-gray-700 capitalize">{key}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {value ? 'Receiving emails' : 'Not receiving emails'}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Subscriber Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">Subscriber ID</div>
                <div className="text-sm font-mono text-gray-900 truncate">{subscriber.id}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">Joined Date</div>
                <div className="text-sm font-medium text-gray-900">
                  {new Date(subscriber.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">Last Activity</div>
                <div className="text-sm font-medium text-gray-900">
                  {/* {activities[0] ? new Date(activities[0].timestamp).toLocaleDateString() : 'No activity'} */}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">Status</div>
                <div className="text-sm font-medium text-gray-900">
                  {subscriber.isSubscribed ? 'Active' : 'Inactive'}
                </div>
              </div>
            </div>

            {/* Edit Mode Actions */}
            {editMode && (
              <div className="flex gap-3 mt-6 pt-6 border-t">
                <button
                  onClick={handleUpdateSubscriber}
                  disabled={updating}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
                >
                  {updating ? 'Updating...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Activity History */}
          <div className="bg-white rounded-xl shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Activity History</h2>
                <button
                  onClick={() => setShowMoreActivities(!showMoreActivities)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {showMoreActivities ? 'Show Less' : 'View All'}
                </button>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {/* {displayedActivities.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-5xl mb-4">📭</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No activity yet</h3>
                  <p className="text-gray-600">This subscriber hasn't performed any actions yet.</p>
                </div>
              ) : (
                displayedActivities.map((activity) => (
                  <div key={activity.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900">
                            {activity.description}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {new Date(activity.timestamp).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {activity.details}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getActivityColor(activity.type)}`}>
                            {activity.type.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(activity.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )} */}
            </div>
          </div>
        </div>

        {/* Right Column - Stats & Actions */}
        <div className="space-y-6">
          {/* Email Stats */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Email Engagement</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-sm text-blue-600 mb-1">Open Rate</div>
                  <div className="text-2xl font-bold text-blue-900">
                    {emailStats.openRate}%
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-sm text-purple-600 mb-1">Click Rate</div>
                  <div className="text-2xl font-bold text-purple-900">
                    {emailStats.clickRate}%
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Emails Sent</span>
                  <span className="font-medium text-gray-900">{emailStats.totalSent}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Opened</span>
                  <span className="font-medium text-gray-900">{emailStats.totalOpened}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Clicked</span>
                  <span className="font-medium text-gray-900">{emailStats.totalClicked}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Email Sent</span>
                  <span className="font-medium text-gray-900">
                    {emailStats.lastEmailSent 
                      ? new Date(emailStats.lastEmailSent).toLocaleDateString() 
                      : 'Never'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Campaign History */}
          {/* <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Email Campaigns</h2>
            <div className="space-y-3">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">{campaign.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded ${
                      campaign.status === 'completed' ? 'bg-green-100 text-green-800' :
                      campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {campaign.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Sent: {new Date(campaign.sentAt).toLocaleDateString()}</span>
                    <div className="flex items-center gap-2">
                      {campaign.opened && <Eye className="h-3 w-3 text-blue-500" />}
                      {campaign.clicked && <ExternalLink className="h-3 w-3 text-purple-500" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div> */}

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => setShowResendModal(true)}
                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
                    <Send className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Resend Verification</div>
                    <div className="text-xs text-gray-500">Send verification email</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
              
              <button
                onClick={handleExportData}
                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Download className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Export Data</div>
                    <div className="text-xs text-gray-500">Download subscriber data</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
              
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full flex items-center justify-between p-3 border border-red-200 rounded-lg hover:bg-red-50 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                    <Trash2 className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-red-900">Delete Subscriber</div>
                    <div className="text-xs text-red-500">Permanently remove</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-red-400" />
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-red-900 mb-3">Danger Zone</h3>
            <p className="text-sm text-red-700 mb-4">
              These actions are irreversible. Please proceed with caution.
            </p>
            <div className="space-y-3">
              <button
                onClick={subscriber.isSubscribed ? handleUnsubscribe : handleResubscribe}
                className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium"
              >
                {subscriber.isSubscribed ? 'Force Unsubscribe' : 'Force Resubscribe'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Delete Subscriber
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showResendModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Resend Verification Email</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to resend the verification email to {subscriber.email}?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleResendVerification}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Resend Email
              </button>
              <button
                onClick={() => setShowResendModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <div className="text-red-600 mb-4">
              <AlertCircle className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">Delete Subscriber</h3>
            <p className="text-gray-600 mb-6 text-center">
              Are you sure you want to delete {subscriber.email}? This action cannot be undone and all subscriber data will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteSubscriber}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Delete Permanently
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}