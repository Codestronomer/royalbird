'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp,
  Users,
  Eye,
  Heart,
  MessageSquare,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Calendar,
  Download,
  Filter,
  BarChart3,
  LineChart,
  Target,
  AlertCircle,
  CheckCircle,
  Info,
  ExternalLink
} from 'lucide-react';
import { api } from '../../../../lib/api';
import { toast } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import type { AudienceInsights, ContentPerformance, DashboardOverviewData, EngagementMetricsResponse } from '~/types/analytics';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);


export type TimeRange = '7d' | '30d' | '90d' | '1y';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [startDate, setStartDate] = useState<Date>(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [overviewData, setOverviewData] = useState<DashboardOverviewData | null>(null);
  const [contentPerformance, setContentPerformance] = useState<ContentPerformance[]>([]);
  const [audienceInsights, setAudienceInsights] = useState<AudienceInsights | null>(null);
  const [engagementMetrics, setEngagementMetrics] = useState<EngagementMetricsResponse | null>(null);

  const loadAnalyticsData = useCallback(async () => {
    try {
      setLoading(true);
      
      const daysMap: Record<TimeRange, number> = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 };
      const days = daysMap[timeRange];
      
      // Fetch in parallel using the updated API client
      const [overviewRes, contentRes, audienceRes, engagementRes] = await Promise.all([
        api.getDashboardOverview(days),
        api.getContentPerformance(),
        api.getAudienceInsights(),
        api.getEngagementMetrics()
      ]);

      if (overviewRes.success) setOverviewData(overviewRes.data);
      if (contentRes.success) setContentPerformance(contentRes.data || []);
      if (audienceRes.success) setAudienceInsights(audienceRes.data || null);
      if (engagementRes.success) setEngagementMetrics(engagementRes.data || null);
    } catch (error) {
      console.error('Failed to load analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    void loadAnalyticsData();
  }, [loadAnalyticsData]);
  
  const handleTimeRangeChange = (val: TimeRange) => {
    setTimeRange(val);
    const daysMap: Record<TimeRange, number> = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 };
    setStartDate(new Date(Date.now() - daysMap[val] * 24 * 60 * 60 * 1000));
    setEndDate(new Date());
  };

  const handleExport = () => {
    if (!overviewData && !contentPerformance.length && !audienceInsights && !engagementMetrics) {
      return toast.error("No data to export");
    }
    
    const data = {
      overviewData,
      contentPerformance,
      audienceInsights,
      engagementMetrics,
      exportDate: new Date().toISOString(),
      timeRange
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `royalbird-analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully');
  };

  // Chart configurations
  const dailyViewsChart = {
    labels: overviewData?.charts?.dailyViews?.map(d => {
      const date = new Date(d.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }) ?? [],
    datasets: [{
      label: 'Daily Views',
      data: overviewData?.charts?.dailyViews?.map(d => d.value) ?? [],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
    }]
  };

  const contentPublishedChart = {
    labels: overviewData?.charts?.contentPublished?.map(d => {
      const date = new Date(d.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }) ?? [],
    datasets: [
      {
        label: 'Comics',
        data: overviewData?.charts?.contentPublished?.map(d => d.comics) ?? [],
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
      },
      {
        label: 'Blogs',
        data: overviewData?.charts?.contentPublished?.map(d => d.blogs) ?? [],
        backgroundColor: 'rgba(14, 165, 233, 0.8)',
      }
    ]
  };

  const deviceDistributionChart = {
    labels: ['Desktop', 'Mobile', 'Tablet'],
    datasets: [{
      data: audienceInsights?.devices ? [
        audienceInsights.devices.desktop,
        audienceInsights.devices.mobile,
        audienceInsights.devices.tablet
      ] : [0, 0, 0],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(245, 158, 11, 0.8)'
      ],
      borderColor: [
        'rgb(59, 130, 246)',
        'rgb(34, 197, 94)',
        'rgb(245, 158, 11)'
      ],
      borderWidth: 1,
    }]
  };

  const ageDistributionChart = {
    labels: audienceInsights?.demographics.ageGroups.map(a => a.range) ?? [],
    datasets: [{
      data: audienceInsights?.demographics.ageGroups.map(a => a.percentage) ?? [],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(245, 158, 11, 0.8)',
      ],
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
        }
      },
      x: {
        grid: {
          display: false,
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header with improved controls */}
      <header className="flex flex-col lg:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Track performance, engagement, and audience insights</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white border rounded-lg px-4 py-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => setStartDate(date!)}
              className="w-32 border-none focus:outline-none text-sm"
              dateFormat="MMM dd, yyyy"
            />
            <span className="text-gray-400">to</span>
            <DatePicker
              selected={endDate}
              onChange={(date: Date | null) => setEndDate(date!)}
              className="w-32 border-none focus:outline-none text-sm"
              dateFormat="MMM dd, yyyy"
            />
          </div>
          
          <select 
            value={timeRange} 
            onChange={(e) => handleTimeRangeChange(e.target.value as TimeRange)}
            className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <button 
            onClick={handleExport} 
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
          >
            <Download className="h-4 w-4" />
            Export Data
          </button>
        </div>
      </header>

      {/* Insights Cards */}
      {overviewData?.insights && overviewData.insights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {overviewData.insights.map((insight, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border ${
                insight.type === 'success' ? 'bg-green-50 border-green-200' :
                insight.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                insight.type === 'error' ? 'bg-red-50 border-red-200' :
                'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {insight.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                ) : insight.type === 'warning' ? (
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                ) : (
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                )}
                <div>
                  <h4 className="font-bold text-gray-900">{insight.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{insight.message}</p>
                  <p className="text-sm font-medium mt-2 text-gray-700">{insight.action}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Stats Grid */}
      {overviewData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Views"
            value={overviewData.overview?.totalViews.toLocaleString()}
            icon={Eye}
            trend={overviewData.trends?.viewGrowth}
            color="blue"
          />
          <StatCard
            title="Total Likes"
            value={overviewData.overview?.totalLikes.toLocaleString()}
            icon={Heart}
            trend={5.2} // This would come from engagement metrics
            color="pink"
          />
          <StatCard
            title="Active Users"
            value={overviewData.overview?.activeUsers?.toLocaleString()}
            icon={Users}
            trend={overviewData.trends?.subscriberGrowth}
            color="green"
          />
          <StatCard
            title="Engagement Rate"
            value={`${overviewData.trends?.engagementRate?.toFixed(1)}%`}
            icon={Target}
            trend={1.8} // This would come from engagement metrics
            color="purple"
          />
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Views Chart */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <LineChart className="h-6 w-6 text-blue-600" />
              <h3 className="font-bold text-gray-900">Daily Views</h3>
            </div>
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64">
            <Line data={dailyViewsChart} options={chartOptions} />
          </div>
        </div>

        {/* Content Published Chart */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-purple-600" />
              <h3 className="font-bold text-gray-900">Content Published</h3>
            </div>
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64">
            <Bar data={contentPublishedChart} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Audience Insights */}
      {audienceInsights && (
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Audience Insights</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Device Distribution */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Device Distribution</h4>
              <div className="h-48">
                <Doughnut data={deviceDistributionChart} options={chartOptions} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Desktop</span>
                  </div>
                  <span className="font-medium">{audienceInsights.devices.desktop}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Mobile</span>
                  </div>
                  <span className="font-medium">{audienceInsights.devices.mobile}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tablet className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">Tablet</span>
                  </div>
                  <span className="font-medium">{audienceInsights.devices.tablet}%</span>
                </div>
              </div>
            </div>

            {/* Age Distribution */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Age Distribution</h4>
              <div className="h-48">
                <Pie data={ageDistributionChart} options={chartOptions} />
              </div>
            </div>

            {/* Behavior Metrics */}
            <div className="space-y-6">
              <h4 className="font-medium text-gray-900">Behavior Metrics</h4>
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Avg. Session Duration</p>
                      <p className="text-xl font-bold text-gray-900">
                        {Math.floor(audienceInsights.behavior.avgSessionDuration / 60)}:
                        {(audienceInsights.behavior.avgSessionDuration % 60).toString().padStart(2, '0')}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Pages per Session</p>
                      <p className="text-xl font-bold text-gray-900">
                        {audienceInsights.behavior.pagesPerSession?.toFixed(1)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-600">Bounce Rate</p>
                      <p className="text-xl font-bold text-gray-900">
                        {audienceInsights.behavior.bounceRate?.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Engagement Metrics */}
      {engagementMetrics && (
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Engagement Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Avg. Engagement per User</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {engagementMetrics.metrics.avgEngagementPerUser}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Peak Engagement Time</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {engagementMetrics.metrics?.peakEngagementTime.label ?? 'N/A'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Engagement</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {engagementMetrics.metrics?.totalEngagement.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Performance */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Top Performing Content</h3>
          <select 
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => {
              // Implement filtering logic here
            }}
          >
            <option value="all">All Content</option>
            <option value="comic">Comics Only</option>
            <option value="blog">Blogs Only</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Title</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    Views
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    Likes
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    Engagement
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Published</th>
              </tr>
            </thead>
            <tbody>
              {contentPerformance.slice(0, 10).map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900 line-clamp-1">{item.title}</div>
                    <div className="text-sm text-gray-500">{item.author}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.type === 'comic' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium">{item.views.toLocaleString()}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium">{item.likes.toLocaleString()}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${Math.min(item?.engagementRate, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{item?.engagementRate?.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm text-gray-600">
                      {new Date(item.publishedDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popular Content from Overview */}
      {overviewData?.popular && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Comics */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Top Comics</h3>
            <div className="space-y-4">
              {overviewData.popular.topComics.slice(0, 5).map((comic, index) => (
                <div key={comic._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-300 w-6 text-center">{index + 1}</span>
                    <div>
                      <h4 className="font-medium text-gray-900 line-clamp-1">{comic.title}</h4>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {comic.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {comic.likes.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Top Blogs */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Top Blogs</h3>
            <div className="space-y-4">
              {overviewData.popular.topBlogs.slice(0, 5).map((blog, index) => (
                <div key={blog._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-300 w-6 text-center">{index + 1}</span>
                    <div>
                      <h4 className="font-medium text-gray-900 line-clamp-1">{blog.title}</h4>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {blog.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {blog.likes.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Geography Data */}
      {audienceInsights?.demographics.location && audienceInsights.demographics.location.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Top Locations</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {audienceInsights.demographics.location.slice(0, 6).map((loc, index) => (
              <div key={index} className="text-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="text-2xl font-bold text-gray-900 mb-2">{loc.users}</div>
                <div className="text-sm text-gray-600">{loc.country}</div>
                <div className="text-xs text-gray-500 mt-1">users</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Stat Card Component
function StatCard(
  props: {
    title: string; 
    value: string | number;
    trend: number;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    color: 'blue' | 'purple' | 'green' | 'pink' | 'orange' | 'indigo';
  }
) {
  const { title, value, trend, icon: Icon, color } = props;
  
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    pink: 'bg-pink-50 text-pink-600 border-pink-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  };

  return (
    <div className={`border rounded-2xl p-6 ${colorClasses[color]} transition-transform hover:scale-[1.02]`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color].split(' ')[0]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className={`text-sm font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend >= 0 ? '+' : ''}{trend}%
        </div>
      </div>
      <div className="text-3xl font-bold mb-2">{value}</div>
      <div className="text-sm font-medium opacity-80">{title}</div>
    </div>
  );
}