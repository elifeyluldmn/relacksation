"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function OwnerPanel() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("calendar");
  const [bookings, setBookings] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Calendar & Quick Add state
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickBooking, setQuickBooking] = useState({
    startDate: '',
    endDate: '',
    products: [],
    customer: { name: '', email: '', phone: '' },
    address: { line1: '', city: '', state: '', zip: '' }
  });

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}`;

  const handleLogin = (e) => {
    e.preventDefault();
    // Check both NEXT_PUBLIC_ADMIN_PASSWORD (client-side) and ADMIN_PASSWORD (server-side fallback)
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    if (password === adminPassword || password === 'change-me') {
      setAuthenticated(true);
      loadBookings();
      loadProducts();
    } else {
      setError('Invalid password');
    }
  };

  const loadBookings = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/bookings`);
      setBookings(response.data);
    } catch (error) {
      console.error('Error loading bookings:', error);
      setError('Failed to load bookings');
    }
  };

  const loadProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products/all`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
      setError('Failed to load products');
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await axios.patch(`${API_URL}/api/bookings/${bookingId}`, { status: newStatus });
      loadBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
      setError('Failed to update booking');
    }
  };

  const handleProductUpdate = async (productId, updates) => {
    try {
      await axios.patch(`${API_URL}/api/products/${productId}`, updates);
      loadProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Failed to update product');
    }
  };

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/bookings`, quickBooking);
      setShowQuickAdd(false);
      setQuickBooking({
        startDate: '',
        endDate: '',
        products: [],
        customer: { name: '', email: '', phone: '' },
        address: { line1: '', city: '', state: '', zip: '' }
      });
      loadBookings();
      setError('');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to add booking');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'confirmed': return '#28a745';
      case 'canceled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString();
  };

  const getBookingsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return bookings.filter(b => {
      const start = new Date(b.startDate).toISOString().split('T')[0];
      const end = new Date(b.endDate).toISOString().split('T')[0];
      return dateStr >= start && dateStr <= end;
    });
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setError('Copied to clipboard!');
      setTimeout(() => setError(''), 2000);
    } catch (err) {
      setError('Failed to copy');
      setTimeout(() => setError(''), 2000);
    }
  };

  // Login Screen
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Owner Login
          </h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
              style={{ minHeight: '44px' }}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Main Owner Panel with Tabs
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-gray-900">Owner Panel</h1>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-4 mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Tab Content */}
      <div className="p-4">
        {/* CALENDAR TAB */}
        {activeTab === "calendar" && (
          <div>
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <h2 className="text-lg font-bold mb-4 text-gray-900">Calendar View</h2>
              
              {/* Product Capacity Badges */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {products.map(product => (
                  <div key={product._id} className="bg-indigo-50 rounded-lg p-3 text-center">
                    <div className="text-xs font-semibold text-gray-800">{product.name}</div>
                    <div className="text-2xl font-bold text-indigo-600">{product.capacity}</div>
                  </div>
                ))}
              </div>

              {/* Month View with Calendar Grid */}
              <div className="mb-4">
                <div className="text-center mb-3">
                  <div className="text-lg font-semibold">
                    {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </div>
                </div>
                
                {/* Calendar Grid - Simple week view */}
                <div className="grid grid-cols-7 gap-1 text-xs mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-semibold text-gray-800 py-1">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar Days - Show current week */}
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 7 }, (_, i) => {
                    const date = new Date(selectedDate);
                    date.setDate(date.getDate() - date.getDay() + i);
                    const dateStr = date.toISOString().split('T')[0];
                    const dayBookings = getBookingsForDate(date);
                    const isToday = dateStr === new Date().toISOString().split('T')[0];
                    
                    return (
                      <div
                        key={i}
                        className={`border rounded p-1 text-center ${isToday ? 'bg-indigo-100 border-indigo-400' : 'bg-gray-50'}`}
                        style={{ minHeight: '60px' }}
                      >
                        <div className="text-xs font-semibold mb-1 text-gray-900">{date.getDate()}</div>
                        {dayBookings.length > 0 && (
                          <div className="space-y-0.5">
                            {dayBookings.slice(0, 2).map(booking => (
                              <div key={booking._id} className="text-[10px] bg-indigo-200 rounded px-1 truncate text-gray-900 font-medium">
                                {booking.products[0]}
                              </div>
                            ))}
                            {dayBookings.length > 2 && (
                              <div className="text-[10px] text-gray-700 font-medium">+{dayBookings.length - 2}</div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Today's Bookings Detail */}
              <div className="mt-4">
                <h3 className="font-semibold mb-2 text-gray-900">Today's Bookings</h3>
                {getBookingsForDate(new Date()).length === 0 ? (
                  <p className="text-gray-700 text-sm">No bookings today</p>
                ) : (
                  <div className="space-y-2">
                    {getBookingsForDate(new Date()).map(booking => (
                      <div key={booking._id} className="bg-gray-50 rounded p-2">
                        <div className="font-semibold text-sm text-gray-900">{booking.customer.name}</div>
                        <div className="text-xs text-gray-800">
                          {booking.products.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Add Button */}
            <button
              onClick={() => setShowQuickAdd(!showQuickAdd)}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              style={{ minHeight: '44px' }}
            >
              {showQuickAdd ? 'Cancel' : '+ Add Booking'}
            </button>

            {/* Quick Add Form */}
            {showQuickAdd && (
              <div className="bg-white rounded-lg shadow p-4 mt-4">
                <h3 className="font-bold mb-4">Quick Add Booking</h3>
                <form onSubmit={handleQuickAdd} className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium mb-1">Start Date</label>
                      <input
                        type="date"
                        value={quickBooking.startDate}
                        onChange={(e) => setQuickBooking(prev => ({ ...prev, startDate: e.target.value }))}
                        required
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500"
                        style={{ minHeight: '44px' }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">End Date</label>
                      <input
                        type="date"
                        value={quickBooking.endDate}
                        onChange={(e) => setQuickBooking(prev => ({ ...prev, endDate: e.target.value }))}
                        required
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500"
                        style={{ minHeight: '44px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Products</label>
                    <div className="flex gap-2 flex-wrap">
                      {['sauna', 'cold-plunge', 'fire-pit'].map(product => (
                        <label key={product} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded" style={{ minHeight: '44px' }}>
                          <input
                            type="checkbox"
                            checked={quickBooking.products.includes(product)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setQuickBooking(prev => ({ ...prev, products: [...prev.products, product] }));
                              } else {
                                setQuickBooking(prev => ({ ...prev, products: prev.products.filter(p => p !== product) }));
                              }
                            }}
                            className="w-5 h-5"
                          />
                          <span className="text-sm">{product}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Customer Name"
                    value={quickBooking.customer.name}
                    onChange={(e) => setQuickBooking(prev => ({ ...prev, customer: { ...prev.customer, name: e.target.value }}))}
                    required
                    className="w-full px-3 py-2 border rounded"
                    style={{ minHeight: '44px' }}
                  />

                  <input
                    type="tel"
                    placeholder="Phone"
                    value={quickBooking.customer.phone}
                    onChange={(e) => setQuickBooking(prev => ({ ...prev, customer: { ...prev.customer, phone: e.target.value }}))}
                    required
                    className="w-full px-3 py-2 border rounded"
                    style={{ minHeight: '44px' }}
                  />

                  <input
                    type="text"
                    placeholder="Address"
                    value={quickBooking.address.line1}
                    onChange={(e) => setQuickBooking(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value }}))}
                    required
                    className="w-full px-3 py-2 border rounded"
                    style={{ minHeight: '44px' }}
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold disabled:bg-gray-400"
                    style={{ minHeight: '44px' }}
                  >
                    {loading ? 'Adding...' : 'Add Booking'}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* BOOKINGS TAB */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold mb-4 text-gray-900">Upcoming Bookings</h2>
            {bookings.length === 0 ? (
              <p className="text-gray-700 text-center py-8">No bookings found</p>
            ) : (
              bookings.map(booking => (
                <div key={booking._id} className="bg-white rounded-lg shadow-md p-5 border border-gray-200">
                  {/* Header with Status */}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{booking.customer.name}</h3>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wide"
                      style={{ backgroundColor: getStatusColor(booking.status) }}
                    >
                      {booking.status}
                    </span>
                  </div>

                  {/* Customer Contact Information */}
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Contact Information</h4>
                    <div className="space-y-1.5">
                      <div className="flex items-start gap-2">
                        <span className="text-gray-600 font-medium min-w-[60px]">Phone:</span>
                        <span className="text-gray-900">{booking.customer.phone || 'N/A'}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-gray-600 font-medium min-w-[60px]">Email:</span>
                        <span className="text-gray-900 break-all">{booking.customer.email || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Delivery Address</h4>
                    <div className="text-gray-900">
                      {booking.address?.line1 && (
                        <div className="mb-1">{booking.address.line1}</div>
                      )}
                      {(booking.address?.city || booking.address?.state || booking.address?.zip) && (
                        <div className="text-gray-800">
                          {[booking.address.city, booking.address.state, booking.address.zip].filter(Boolean).join(', ')}
                        </div>
                      )}
                      {!booking.address?.line1 && !booking.address?.city && (
                        <div className="text-gray-500 italic">No address provided</div>
                      )}
                    </div>
                  </div>

                  {/* Booking Dates */}
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Booking Dates</h4>
                    <div className="text-gray-900 font-medium">
                      {formatDate(booking.startDate)} → {formatDate(booking.endDate)}
                    </div>
                  </div>

                  {/* Products */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Products</h4>
                    <div className="flex gap-2 flex-wrap">
                      {booking.products.map(product => (
                        <span key={product} className="bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded-md text-sm font-medium">
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    {booking.status === 'pending' && (
                      <button
                        onClick={() => handleStatusChange(booking._id, 'confirmed')}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-semibold transition-colors shadow-sm"
                        style={{ minHeight: '44px' }}
                      >
                        Confirm
                      </button>
                    )}
                    {booking.status !== 'canceled' && (
                      <button
                        onClick={() => handleStatusChange(booking._id, 'canceled')}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-semibold transition-colors shadow-sm"
                        style={{ minHeight: '44px' }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === "products" && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold mb-4 text-gray-900">Manage Products</h2>
            {products.map(product => (
              <div key={product._id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="font-bold text-lg text-gray-900">{product.name}</div>
                  <label className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-800">{product.isActive ? 'Active' : 'Inactive'}</span>
                    <input
                      type="checkbox"
                      checked={product.isActive}
                      onChange={(e) => handleProductUpdate(product._id, { isActive: e.target.checked })}
                      className="w-6 h-6"
                    />
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex-1">
                    <span className="block text-sm font-medium mb-1 text-gray-900">Capacity</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleProductUpdate(product._id, { capacity: Math.max(0, product.capacity - 1) })}
                        className="bg-gray-200 text-gray-700 w-12 h-12 rounded font-bold text-xl"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={product.capacity}
                        onChange={(e) => handleProductUpdate(product._id, { capacity: parseInt(e.target.value) || 0 })}
                        className="w-20 text-center border rounded py-2 text-lg font-bold"
                        min="0"
                        style={{ minHeight: '44px' }}
                      />
                      <button
                        onClick={() => handleProductUpdate(product._id, { capacity: product.capacity + 1 })}
                        className="bg-indigo-600 text-white w-12 h-12 rounded font-bold text-xl"
                      >
                        +
                      </button>
                    </div>
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-bold mb-4 text-gray-900">Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Owner Phone</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={process.env.NEXT_PUBLIC_OWNER_PHONE ? (process.env.NEXT_PUBLIC_OWNER_PHONE.startsWith('+1') ? `+1 (${process.env.NEXT_PUBLIC_OWNER_PHONE.slice(2, 5)}) ${process.env.NEXT_PUBLIC_OWNER_PHONE.slice(5, 8)}-${process.env.NEXT_PUBLIC_OWNER_PHONE.slice(8)}` : process.env.NEXT_PUBLIC_OWNER_PHONE) : '+1 (405) 534-3295'}
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-50 border rounded"
                    style={{ minHeight: '44px' }}
                  />
                  <button
                    onClick={() => copyToClipboard(process.env.NEXT_PUBLIC_OWNER_PHONE || '+14055343295')}
                    className="bg-indigo-600 text-white px-4 py-2 rounded font-semibold"
                    style={{ minHeight: '44px' }}
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Owner Email</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={process.env.NEXT_PUBLIC_OWNER_EMAIL || 'relackswellness@gmail.com'}
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-50 border rounded"
                    style={{ minHeight: '44px' }}
                  />
                  <button
                    onClick={() => copyToClipboard(process.env.NEXT_PUBLIC_OWNER_EMAIL || 'relackswellness@gmail.com')}
                    className="bg-indigo-600 text-white px-4 py-2 rounded font-semibold"
                    style={{ minHeight: '44px' }}
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <button
                  onClick={() => {
                    setAuthenticated(false);
                    setPassword('');
                  }}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold"
                  style={{ minHeight: '44px' }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Tab Bar - Sticky */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="flex">
          <button
            onClick={() => setActiveTab("calendar")}
            className={`flex-1 py-3 text-center font-semibold transition ${
              activeTab === "calendar" ? 'bg-indigo-600 text-white' : 'text-gray-600'
            }`}
            style={{ minHeight: '56px' }}
          >
            <div className="text-lg">📅</div>
            <div className="text-xs">Calendar</div>
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`flex-1 py-3 text-center font-semibold transition ${
              activeTab === "bookings" ? 'bg-indigo-600 text-white' : 'text-gray-600'
            }`}
            style={{ minHeight: '56px' }}
          >
            <div className="text-lg">📋</div>
            <div className="text-xs">Bookings</div>
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`flex-1 py-3 text-center font-semibold transition ${
              activeTab === "products" ? 'bg-indigo-600 text-white' : 'text-gray-600'
            }`}
            style={{ minHeight: '56px' }}
          >
            <div className="text-lg">📦</div>
            <div className="text-xs">Products</div>
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 py-3 text-center font-semibold transition ${
              activeTab === "settings" ? 'bg-indigo-600 text-white' : 'text-gray-600'
            }`}
            style={{ minHeight: '56px' }}
          >
            <div className="text-lg">⚙️</div>
            <div className="text-xs">Settings</div>
          </button>
        </div>
      </div>
    </div>
  );
}
