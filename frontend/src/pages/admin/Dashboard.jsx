import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Loader2,
  Users,
  FileText,
  Eye,
  CalendarDays,
  Star,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { fetchDashboardStats } from "../../features/research/researchSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const formatNumber = (value) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 1,
  }).format(value || 0);

const formatRelativeTime = (value) => {
  const now = new Date();
  const date = new Date(value);
  const diffMs = now - date;
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  if (days < 7) return `${days} day ago`;

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const SummaryCard = ({ title, value, description, icon: Icon, colors }) => (
  <Card className={`border-0 shadow-lg ${colors}`}>
    <CardContent className="p-6 text-white">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-white/80">{title}</p>
          <p className="mt-2 text-4xl font-bold">{value}</p>
          <p className="mt-2 text-xs text-white/80">{description}</p>
        </div>
        <div className="rounded-xl bg-white/20 p-3">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function Dashboard() {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.research);
  const [timeRange, setTimeRange] = useState("weekly");

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const timelineData = stats.timeline?.[timeRange] || [];
  const contentByType = stats.contentByType || [];
  const categoryDistribution = stats.categoryDistribution || [];
  const userRoleDistribution = stats.userRoleDistribution || [];
  const recentActivity = stats.recentActivity || [];

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-slate-500">
            Live overview of content, users, views, and publishing activity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Timeline</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium"
          >
            <option value="daily">Last 7 Days</option>
            <option value="weekly">Last 6 Weeks</option>
            <option value="monthly">Last 6 Months</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Content"
          value={formatNumber(stats.totalPosts)}
          description={`${stats.totalResearch || 0} research, ${stats.totalNews || 0} news, ${stats.totalEvents || 0} events`}
          icon={FileText}
          colors="bg-gradient-to-br from-blue-500 to-blue-600"
        />

        <SummaryCard
          title="Total Users"
          value={formatNumber(stats.totalUsers)}
          description="Registered users across all roles"
          icon={Users}
          colors="bg-gradient-to-br from-violet-500 to-violet-600"
        />

        <SummaryCard
          title="Total Views"
          value={formatNumber(stats.totalViews)}
          description={`Average ${formatNumber(stats.avgViewsPerPost)} views per content item`}
          icon={Eye}
          colors="bg-gradient-to-br from-emerald-500 to-emerald-600"
        />

        <SummaryCard
          title="Upcoming Events"
          value={formatNumber(stats.upcomingEvents)}
          description={`${stats.featuredResearch || 0} featured research article(s) currently highlighted`}
          icon={CalendarDays}
          colors="bg-gradient-to-br from-orange-500 to-orange-600"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle>Publishing Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {timelineData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={timelineData}>
                  <defs>
                    <linearGradient id="totalActivity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#3b82f6"
                    fill="url(#totalActivity)"
                    strokeWidth={2}
                    name="Total Published"
                  />
                  <Area
                    type="monotone"
                    dataKey="research"
                    stroke="#8b5cf6"
                    fillOpacity={0}
                    strokeWidth={2}
                    name="Research"
                  />
                  <Area
                    type="monotone"
                    dataKey="news"
                    stroke="#10b981"
                    fillOpacity={0}
                    strokeWidth={2}
                    name="News"
                  />
                  <Area
                    type="monotone"
                    dataKey="events"
                    stroke="#f59e0b"
                    fillOpacity={0}
                    strokeWidth={2}
                    name="Events"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-slate-500">No publishing activity yet.</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Content Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {contentByType.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={contentByType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Items" radius={[8, 8, 0, 0]}>
                    {contentByType.map((item) => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-slate-500">No content data available.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {categoryDistribution.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-slate-500">No category data available.</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>User Roles</CardTitle>
          </CardHeader>
          <CardContent>
            {userRoleDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={userRoleDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    dataKey="value"
                    nameKey="name"
                    paddingAngle={4}
                  >
                    {userRoleDistribution.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-slate-500">No user role data available.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={`${activity.type}-${activity.id}`}
                  className="flex flex-col gap-3 rounded-xl border bg-slate-50 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-blue-100 p-3">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">{activity.type}</Badge>
                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                          Published
                        </Badge>
                      </div>
                      <p className="mt-2 font-semibold text-slate-900">
                        {activity.title}
                      </p>
                      <p className="text-sm text-slate-500">
                        by {activity.author || "Unknown author"}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm text-slate-500 md:text-right">
                    {formatRelativeTime(activity.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No recent activity available.</p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {contentByType.map((item) => (
          <Card key={item.name} className="shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{item.name}</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {formatNumber(item.count)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatNumber(item.views)} total views
                  </p>
                </div>
                <div
                  className="h-10 w-10 rounded-full"
                  style={{ backgroundColor: `${item.color}22` }}
                >
                  <div
                    className="m-2 h-6 w-6 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
