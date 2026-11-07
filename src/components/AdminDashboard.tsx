import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, IndianRupee, Users, PackageCheck, AlertCircle, ExternalLink, RefreshCw, KeyRound, ArrowLeft } from 'lucide-react';
import { Language } from '../types';

interface AdminDashboardProps {
  lang: Language;
  onBackToHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ lang, onBackToHome }) => {
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdminData = async (key: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin-orders?key=${encodeURIComponent(key)}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed: Invalid Admin Key');
      }

      setStats(data.stats);
      setOrders(data.orders || []);
      setInquiries(data.inquiries || []);
      setIsAuthenticated(true);
      sessionStorage.setItem('diwali_admin_key', key);
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedKey = sessionStorage.getItem('diwali_admin_key');
    if (savedKey) {
      setAdminKey(savedKey);
      fetchAdminData(savedKey);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey.trim()) return;
    fetchAdminData(adminKey.trim());
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-28 pb-20 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="royal-card-glow rounded-3xl p-8 max-w-md w-full border border-gold-400/50 shadow-2xl text-center"
        >
          <div className="w-14 h-14 rounded-full bg-gold-500/20 border border-gold-400 flex items-center justify-center mx-auto mb-3">
            <KeyRound className="w-7 h-7 text-gold-300" />
          </div>
          <h2 className="font-heading font-bold text-2xl text-gold-200 mb-1">Admin Portal</h2>
          <p className="text-xs text-gold-300/80 mb-6">Enter Admin Secret Key to view orders, revenue and inquiries.</p>

          {error && (
            <div className="mb-4 p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Enter Admin Key (e.g. diwali_admin_2026)"
              className="name-input-field w-full px-4 py-2.5 rounded-xl border border-gold-400 text-sm font-semibold outline-none text-center"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-full font-bold text-sm text-maroon-950 bg-gradient-to-r from-gold-300 via-gold-400 to-amber-500 hover:from-gold-200 hover:to-amber-400 shadow-gold-glow transition"
            >
              {isLoading ? 'Verifying...' : 'Access Dashboard'}
            </button>
          </form>

          <button
            onClick={onBackToHome}
            className="mt-6 text-xs text-gold-400 hover:text-gold-200 inline-flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <button
            onClick={onBackToHome}
            className="inline-flex items-center space-x-1 text-xs text-gold-400 hover:text-gold-200 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>
          <h1 className="font-heading font-extrabold text-3xl gold-text-gradient">Platform Admin Dashboard</h1>
          <p className="text-xs text-gold-300/80">Monitor verified orders, revenue, and custom inquiries</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => fetchAdminData(adminKey)}
            className="p-2 rounded-xl bg-gold-500/15 hover:bg-gold-500/25 border border-gold-400/40 text-gold-300 text-xs flex items-center space-x-1.5 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => {
              sessionStorage.removeItem('diwali_admin_key');
              setIsAuthenticated(false);
            }}
            className="px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-xs transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Revenue & Overview Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="p-5 rounded-2xl bg-maroon-950/80 border border-gold-400/40 shadow-xl">
            <span className="text-xs text-gold-300/80 uppercase tracking-wider block mb-1">Total Verified Revenue</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-lg text-emerald-400 font-bold">₹</span>
              <span className="text-3xl font-extrabold gold-text-gradient font-heading">{stats.totalRevenueInr}</span>
            </div>
            <span className="text-[11px] text-emerald-400 mt-1 block">✓ Captured Payments</span>
          </div>

          <div className="p-5 rounded-2xl bg-maroon-950/80 border border-gold-400/40 shadow-xl">
            <span className="text-xs text-gold-300/80 uppercase tracking-wider block mb-1">Total Orders</span>
            <span className="text-3xl font-extrabold text-gold-200 font-heading block">{stats.totalOrders}</span>
            <span className="text-[11px] text-gold-400/70 mt-1 block">
              {stats.paidOrdersCount} Paid • {stats.pendingOrdersCount} Pending
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-maroon-950/80 border border-gold-400/40 shadow-xl">
            <span className="text-xs text-gold-300/80 uppercase tracking-wider block mb-1">Plan Breakdown</span>
            <div className="text-xs space-y-0.5 mt-1 text-gold-200">
              <div>Basic (₹10): <strong>{stats.planBreakdown?.basic || 0}</strong></div>
              <div>Premium (₹49): <strong>{stats.planBreakdown?.premium || 0}</strong></div>
              <div>Royal (₹99): <strong>{stats.planBreakdown?.royal || 0}</strong></div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-maroon-950/80 border border-gold-400/40 shadow-xl">
            <span className="text-xs text-gold-300/80 uppercase tracking-wider block mb-1">Custom Inquiries</span>
            <span className="text-3xl font-extrabold text-saffron-300 font-heading block">{stats.totalInquiries}</span>
            <span className="text-[11px] text-saffron-400/70 mt-1 block">₹10–₹100 manual quotes</span>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="royal-card-glow rounded-3xl p-6 border border-gold-500/40 shadow-2xl mb-10 overflow-hidden">
        <h2 className="font-heading font-bold text-xl text-gold-200 mb-4">Orders Ledger</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-maroon-900/90 text-gold-300 uppercase tracking-wider border-b border-gold-500/30">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer (Sender)</th>
                <th className="p-3">Recipient</th>
                <th className="p-3">Plan & Amount</th>
                <th className="p-3">Payment Status</th>
                <th className="p-3">Generated URL</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-500/20 text-ivory-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gold-400/60">
                    No orders recorded yet.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-gold-500/5 transition">
                    <td className="p-3 font-mono text-[11px] text-gold-300">{o.id}</td>
                    <td className="p-3">
                      <div className="font-semibold text-gold-200">{o.customerName}</div>
                      <div className="text-[10px] text-gold-400/70">{o.customerWhatsapp}</div>
                    </td>
                    <td className="p-3 font-semibold text-amber-300">{o.recipientName}</td>
                    <td className="p-3">
                      <span className="uppercase font-bold text-gold-300">{o.planId}</span>
                      <span className="ml-1 font-semibold text-ivory-100">(₹{o.amountInInr})</span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          o.paymentStatus === 'paid' && o.paymentVerified
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                            : o.paymentStatus === 'failed'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-400/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                        }`}
                      >
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3">
                      {o.websiteUrl ? (
                        <a
                          href={o.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gold-300 hover:text-gold-100 flex items-center space-x-1 underline truncate max-w-[180px]"
                        >
                          <span className="truncate">{o.websiteSlug || 'View Website'}</span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      ) : (
                        <span className="text-gold-400/40">—</span>
                      )}
                    </td>
                    <td className="p-3 text-[11px] text-gold-400/70 whitespace-nowrap">
                      {new Date(o.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inquiries Table */}
      {inquiries.length > 0 && (
        <div className="royal-card-glow rounded-3xl p-6 border border-gold-500/40 shadow-2xl overflow-hidden">
          <h2 className="font-heading font-bold text-xl text-gold-200 mb-4">Custom Inquiries (₹10–₹100)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-maroon-900/90 text-gold-300 uppercase tracking-wider border-b border-gold-500/30">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">WhatsApp</th>
                  <th className="p-3">Budget</th>
                  <th className="p-3">Requirements</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-500/20 text-ivory-100">
                {inquiries.map((inq, idx) => (
                  <tr key={idx} className="hover:bg-gold-500/5 transition">
                    <td className="p-3 font-semibold text-gold-200">{inq.customerName || inq.customer_name}</td>
                    <td className="p-3 text-emerald-400">{inq.customerWhatsapp || inq.customer_whatsapp}</td>
                    <td className="p-3 font-mono text-amber-300">{inq.budgetRange || inq.budget_range}</td>
                    <td className="p-3 max-w-xs truncate">{inq.requirements}</td>
                    <td className="p-3 text-[11px] text-gold-400/70 whitespace-nowrap">
                      {new Date(inq.createdAt || inq.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

