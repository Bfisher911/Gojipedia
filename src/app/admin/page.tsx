import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Users, Film, Package, FileText, RefreshCw, Settings } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  robots: { index: false, follow: false },
};

export default function AdminDashboard() {
  // In production, this would check authentication
  const isAuthenticated = true; // Replace with actual auth check

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-[#00d4aa] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#f0f0f5]">Admin Access Required</h1>
          <p className="text-[#9090a0] mt-2">Please sign in to access the admin dashboard.</p>
          <Link
            href="/admin/login"
            className="inline-block mt-4 px-6 py-2 bg-[#00d4aa] text-[#0a0a0f] rounded-lg font-medium"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#f0f0f5]">Admin Dashboard</h1>
            <p className="text-[#9090a0] mt-1">Manage Gojipedia content and settings</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-[#9090a0]">System Online</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Monsters" value="6" trend="+0 this week" />
          <StatCard label="Movies" value="6" trend="+0 this week" />
          <StatCard label="Products" value="10" trend="+0 this week" />
          <StatCard label="Posts" value="3" trend="+0 this week" />
        </div>

        {/* Main Sections */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AdminCard
            icon={<Users className="w-6 h-6" />}
            title="Monsters"
            description="Create, edit, and manage monster profiles"
            href="/admin/monsters"
            actions={['Add Monster', 'Import CSV', 'Manage Relationships']}
          />
          <AdminCard
            icon={<Film className="w-6 h-6" />}
            title="Works"
            description="Manage movies, series, and other media"
            href="/admin/works"
            actions={['Add Work', 'Import CSV', 'Manage Appearances']}
          />
          <AdminCard
            icon={<Package className="w-6 h-6" />}
            title="Products"
            description="Curate affiliate products and collections"
            href="/admin/products"
            actions={['Review Suggestions', 'Edit Collections', 'Refresh Data']}
          />
          <AdminCard
            icon={<FileText className="w-6 h-6" />}
            title="Content"
            description="Manage blog posts and stories"
            href="/admin/content"
            actions={['Review Drafts', 'Publish', 'Edit Categories']}
          />
          <AdminCard
            icon={<RefreshCw className="w-6 h-6" />}
            title="Jobs"
            description="Monitor and run scheduled tasks"
            href="/admin/jobs"
            actions={['Run Product Refresh', 'Generate Drafts', 'View Logs']}
          />
          <AdminCard
            icon={<Settings className="w-6 h-6" />}
            title="Settings"
            description="Configure site settings and integrations"
            href="/admin/settings"
            actions={['API Keys', 'SEO Settings', 'User Management']}
          />
        </div>

        {/* Recent Activity */}
        <section className="mt-12">
          <h2 className="text-xl font-bold text-[#f0f0f5] mb-4">Recent Activity</h2>
          <div className="bg-[#12121a] border border-[#2a2a3a] rounded-xl divide-y divide-[#2a2a3a]">
            <ActivityItem
              action="Product refresh job completed"
              time="2 hours ago"
              status="success"
            />
            <ActivityItem
              action="New draft generated: Era Comparison Article"
              time="1 day ago"
              status="pending"
            />
            <ActivityItem
              action="Database backup completed"
              time="1 day ago"
              status="success"
            />
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-8">
          <h2 className="text-xl font-bold text-[#f0f0f5] mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <QuickAction label="Run Product Refresh" />
            <QuickAction label="Generate Content Drafts" />
            <QuickAction label="Clear Cache" />
            <QuickAction label="Rebuild Sitemap" />
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value, trend }: { label: string; value: string; trend: string }) {
  return (
    <div className="bg-[#12121a] border border-[#2a2a3a] rounded-xl p-4">
      <p className="text-sm text-[#606070]">{label}</p>
      <p className="text-3xl font-bold text-[#f0f0f5] mt-1">{value}</p>
      <p className="text-xs text-[#9090a0] mt-1">{trend}</p>
    </div>
  );
}

function AdminCard({
  icon,
  title,
  description,
  href,
  actions,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  actions: string[];
}) {
  return (
    <div className="bg-[#12121a] border border-[#2a2a3a] rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-[#00d4aa]/20 rounded-lg text-[#00d4aa]">{icon}</div>
        <h3 className="text-lg font-semibold text-[#f0f0f5]">{title}</h3>
      </div>
      <p className="text-sm text-[#9090a0] mb-4">{description}</p>
      <div className="space-y-2">
        {actions.map((action) => (
          <Link
            key={action}
            href={href}
            className="block text-sm text-[#00d4aa] hover:text-[#00f0c0] transition-colors"
          >
            {action} &rarr;
          </Link>
        ))}
      </div>
    </div>
  );
}

function ActivityItem({
  action,
  time,
  status,
}: {
  action: string;
  time: string;
  status: 'success' | 'pending' | 'error';
}) {
  const statusColors = {
    success: 'bg-green-500',
    pending: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  return (
    <div className="flex items-center gap-4 p-4">
      <div className={`w-2 h-2 rounded-full ${statusColors[status]}`} />
      <div className="flex-1">
        <p className="text-sm text-[#f0f0f5]">{action}</p>
        <p className="text-xs text-[#606070]">{time}</p>
      </div>
    </div>
  );
}

function QuickAction({ label }: { label: string }) {
  return (
    <button className="px-4 py-2 bg-[#1a1a25] border border-[#2a2a3a] rounded-lg text-sm text-[#9090a0] hover:text-[#f0f0f5] hover:border-[#00d4aa]/50 transition-colors">
      {label}
    </button>
  );
}
