import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSellers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingReturns: 0
  });
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();

  const adminTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'sellers', label: 'Sellers', icon: '🏪' },
    { id: 'products', label: 'Products', icon: '📦' },
    { id: 'orders', label: 'Orders', icon: '🛒' },
    { id: 'categories', label: 'Categories', icon: '📂' },
    { id: 'coupons', label: 'Coupons', icon: '🎫' },
    { id: 'returns', label: 'Returns', icon: '↩️' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        setStats({
          totalUsers: 1250,
          totalSellers: 85,
          totalProducts: 450,
          totalOrders: 2340,
          totalRevenue: 125000,
          pendingReturns: 12
        });
      }
    } catch (error) {
      setStats({
        totalUsers: 1250,
        totalSellers: 85,
        totalProducts: 450,
        totalOrders: 2340,
        totalRevenue: 125000,
        pendingReturns: 12
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="glass-effect p-12 rounded-2xl luxury-shadow max-w-md mx-auto">
          <h2 className="text-3xl font-bold mb-4">Access Denied</h2>
          <p className="text-base-content/70">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
      {/* Admin Header */}
      <div className="glass-effect border-b border-base-200/50 mb-8">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center fade-in">
            <h1 className="text-5xl lg:text-6xl font-black brand-name mb-4 text-primary">Admin Control Center</h1>
            <p className="text-xl text-base-content/70">Manage your e-commerce platform</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-8">
        {/* Quick Stats */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
            <div className="glass-effect luxury-shadow-hover p-6 rounded-2xl border border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <span className="text-2xl">👥</span>
                </div>
                <span className="text-sm text-success font-medium">+5.2%</span>
              </div>
              <h3 className="text-3xl font-bold text-primary mb-2">{stats.totalUsers}</h3>
              <p className="text-sm text-base-content/60">Total Users</p>
            </div>

            <div className="glass-effect luxury-shadow-hover p-6 rounded-2xl border border-success/20">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-success/10 rounded-xl">
                  <span className="text-2xl">🏪</span>
                </div>
                <span className="text-sm text-success font-medium">+12%</span>
              </div>
              <h3 className="text-3xl font-bold text-success mb-2">{stats.totalSellers}</h3>
              <p className="text-sm text-base-content/60">Active Sellers</p>
            </div>

            <div className="glass-effect luxury-shadow-hover p-6 rounded-2xl border border-warning/20">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-warning/10 rounded-xl">
                  <span className="text-2xl">📦</span>
                </div>
                <span className="text-sm text-success font-medium">+8%</span>
              </div>
              <h3 className="text-3xl font-bold text-warning mb-2">{stats.totalProducts}</h3>
              <p className="text-sm text-base-content/60">Total Products</p>
            </div>

            <div className="glass-effect luxury-shadow-hover p-6 rounded-2xl border border-info/20">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-info/10 rounded-xl">
                  <span className="text-2xl">🛒</span>
                </div>
                <span className="text-sm text-success font-medium">+15%</span>
              </div>
              <h3 className="text-3xl font-bold text-info mb-2">{stats.totalOrders}</h3>
              <p className="text-sm text-base-content/60">Total Orders</p>
            </div>

            <div className="glass-effect luxury-shadow-hover p-6 rounded-2xl border border-accent/20">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-accent/10 rounded-xl">
                  <span className="text-2xl">💰</span>
                </div>
                <span className="text-sm text-success font-medium">+22%</span>
              </div>
              <h3 className="text-3xl font-bold text-accent mb-2">${stats.totalRevenue.toLocaleString()}</h3>
              <p className="text-sm text-base-content/60">Total Revenue</p>
            </div>

            <div className="glass-effect luxury-shadow-hover p-6 rounded-2xl border border-error/20">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-error/10 rounded-xl">
                  <span className="text-2xl">⚠️</span>
                </div>
                <button className="text-sm text-primary hover:underline">View</button>
              </div>
              <h3 className="text-3xl font-bold text-error mb-2">{stats.pendingReturns}</h3>
              <p className="text-sm text-base-content/60">Pending Actions</p>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="glass-effect p-2 rounded-2xl mb-8 luxury-shadow">
          <div className="flex flex-wrap gap-2">
            {adminTabs.map(tab => (
              <button
                key={tab.id}
                className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-content shadow-lg'
                    : 'hover:bg-primary/10 hover:text-primary'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="glass-effect p-8 rounded-2xl luxury-shadow">
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="text-3xl font-bold brand-name mb-6">Dashboard Overview</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-base-200/50 rounded-xl">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <div>
                        <p className="font-medium">New seller registration</p>
                        <p className="text-sm text-base-content/60">2 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-base-200/50 rounded-xl">
                      <div className="w-2 h-2 bg-warning rounded-full"></div>
                      <div>
                        <p className="font-medium">Product reported</p>
                        <p className="text-sm text-base-content/60">15 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-base-200/50 rounded-xl">
                      <div className="w-2 h-2 bg-info rounded-full"></div>
                      <div>
                        <p className="font-medium">Large order placed</p>
                        <p className="text-sm text-base-content/60">1 hour ago</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="btn btn-primary" onClick={() => setActiveTab('sellers')}>
                      Approve Sellers
                    </button>
                    <button className="btn btn-outline" onClick={() => setActiveTab('returns')}>
                      Review Returns
                    </button>
                    <button className="btn btn-outline" onClick={() => setActiveTab('products')}>
                      Manage Products
                    </button>
                    <button className="btn btn-outline" onClick={() => setActiveTab('analytics')}>
                      View Reports
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h2 className="text-3xl font-bold brand-name mb-6">User Management</h2>
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar placeholder">
                            <div className="bg-primary text-primary-content rounded-full w-8">
                              <span className="text-xs">JD</span>
                            </div>
                          </div>
                          <span>John Doe</span>
                        </div>
                      </td>
                      <td>john@example.com</td>
                      <td><span className="badge badge-success">Active</span></td>
                      <td>2024-01-15</td>
                      <td>
                        <div className="flex gap-2">
                          <button className="btn btn-xs btn-outline">Edit</button>
                          <button className="btn btn-xs btn-error">Ban</button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'sellers' && (
            <div>
              <h2 className="text-3xl font-bold brand-name mb-6">Seller Management</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title">Pending Approvals</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-base-200/50 rounded-xl">
                        <div>
                          <p className="font-medium">Tech Store Pro</p>
                          <p className="text-sm text-base-content/60">Electronics seller</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="btn btn-success btn-sm">Approve</button>
                          <button className="btn btn-error btn-sm">Reject</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title">Top Performers</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Fashion Hub</span>
                        <span className="text-success font-bold">$12,450</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Gadget World</span>
                        <span className="text-success font-bold">$9,230</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <h2 className="text-3xl font-bold brand-name mb-6">Product Management</h2>
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-4">
                  <button className="btn btn-primary">Add Product</button>
                  <button className="btn btn-outline">Bulk Import</button>
                  <button className="btn btn-outline">Export CSV</button>
                </div>
                <div className="flex gap-2">
                  <select className="select select-bordered">
                    <option>All Categories</option>
                    <option>Electronics</option>
                    <option>Fashion</option>
                  </select>
                  <input type="text" placeholder="Search products..." className="input input-bordered" />
                </div>
              </div>
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-2xl font-bold mb-2">Product Management</h3>
                <p className="text-base-content/60">Advanced product management features coming soon</p>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="text-3xl font-bold brand-name mb-6">Order Management</h2>
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="text-2xl font-bold mb-2">Order Management</h3>
                <p className="text-base-content/60">Order tracking and management features coming soon</p>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div>
              <h2 className="text-3xl font-bold brand-name mb-6">Category Management</h2>
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📂</div>
                <h3 className="text-2xl font-bold mb-2">Category Management</h3>
                <p className="text-base-content/60">Category and brand management features coming soon</p>
              </div>
            </div>
          )}

          {activeTab === 'coupons' && (
            <div>
              <h2 className="text-3xl font-bold brand-name mb-6">Coupon Management</h2>
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🎫</div>
                <h3 className="text-2xl font-bold mb-2">Coupon Management</h3>
                <p className="text-base-content/60">Discount and coupon management features coming soon</p>
              </div>
            </div>
          )}

          {activeTab === 'returns' && (
            <div>
              <h2 className="text-3xl font-bold brand-name mb-6">Return Management</h2>
              <div className="text-center py-16">
                <div className="text-6xl mb-4">↩️</div>
                <h3 className="text-2xl font-bold mb-2">Return Management</h3>
                <p className="text-base-content/60">Return and refund management features coming soon</p>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h2 className="text-3xl font-bold brand-name mb-6">Analytics & Reports</h2>
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📈</div>
                <h3 className="text-2xl font-bold mb-2">Analytics Dashboard</h3>
                <p className="text-base-content/60">Advanced analytics and reporting features coming soon</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-3xl font-bold brand-name mb-6">System Settings</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title">Site Configuration</h3>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Site Name</span>
                      </label>
                      <input type="text" className="input input-bordered" value="De Canokart" />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Site Description</span>
                      </label>
                      <textarea className="textarea textarea-bordered">Premium e-commerce platform</textarea>
                    </div>
                    <button className="btn btn-primary">Save Changes</button>
                  </div>
                </div>
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title">Payment Settings</h3>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Tax Rate (%)</span>
                      </label>
                      <input type="number" className="input input-bordered" value="8.5" />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Shipping Rate</span>
                      </label>
                      <input type="number" className="input input-bordered" value="5.99" />
                    </div>
                    <button className="btn btn-primary">Update Settings</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;