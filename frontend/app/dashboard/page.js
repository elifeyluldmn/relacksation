"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [blockedDates, setBlockedDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('bookings');
  const [newBlockout, setNewBlockout] = useState({
    date: '',
    reason: 'maintenance',
    description: '',
    isAllProductsBlocked: true,
    products: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // In a real app, you would fetch from your backend
      // const [bookingsRes, blockedRes] = await Promise.all([
      //   axios.get('/api/bookings'),
      //   axios.get('/api/availability/blocked')
      // ]);
      
      // Mock data for demonstration
      const mockBookings = [
        {
          id: '1',
          bookingId: 'BK20241201001',
          customer: { name: 'John Smith', email: 'john@example.com', phone: '+1-555-0123' },
          rental: { startDate: '2024-12-15', endDate: '2024-12-17', duration: 3 },
          products: [{ name: 'RelACKs Portable Sauna', quantity: 1 }],
          pricing: { total: 300, discount: 60 },
          status: 'confirmed',
          payment: { status: 'paid' },
          createdAt: '2024-12-01T10:00:00Z'
        },
        {
          id: '2',
          bookingId: 'BK20241202001',
          customer: { name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+1-555-0456' },
          rental: { startDate: '2024-12-20', endDate: '2024-12-22', duration: 3 },
          products: [
            { name: 'RelACKs Cold Plunge Tub', quantity: 1 },
            { name: 'RelACKs Fire Pit', quantity: 1 }
          ],
          pricing: { total: 390, discount: 0 },
          status: 'confirmed',
          payment: { status: 'paid' },
          createdAt: '2024-12-02T14:30:00Z'
        }
      ];

      const mockBlockedDates = [
        {
          id: '1',
          date: '2024-12-25',
          reason: 'holiday',
          description: 'Christmas Day - All services closed',
          isAllProductsBlocked: true
        },
        {
          id: '2',
          date: '2024-12-31',
          reason: 'holiday',
          description: 'New Year\'s Eve - Limited availability',
          isAllProductsBlocked: false
        }
      ];

      setBookings(mockBookings);
      setBlockedDates(mockBlockedDates);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      setLoading(false);
    }
  };

  const handleBlockoutSubmit = async (e) => {
    e.preventDefault();
    try {
      // In a real app, you would send to your backend
      // await axios.post('/api/blockout', newBlockout);
      
      const newBlockoutItem = {
        id: Date.now().toString(),
        ...newBlockout,
        createdAt: new Date().toISOString()
      };
      
      setBlockedDates([...blockedDates, newBlockoutItem]);
      setNewBlockout({
        date: '',
        reason: 'maintenance',
        description: '',
        isAllProductsBlocked: true,
        products: []
      });
      
      alert('Date blocked successfully!');
    } catch (err) {
      alert('Failed to block date');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div style={{
        padding: "2rem",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          background: "#fff",
          padding: "3rem",
          borderRadius: "12px",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
        }}>
          <div style={{
            width: "50px",
            height: "50px",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #3498db",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 1rem"
          }}></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: "2rem",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          background: "#fff",
          padding: "3rem",
          borderRadius: "12px",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
        }}>
          <h2 style={{ color: "#e74c3c", marginBottom: "1rem" }}>Error</h2>
          <p style={{ color: "#666", marginBottom: "1rem" }}>{error}</p>
          <button
            onClick={fetchDashboardData}
            style={{
              padding: "0.75rem 1.5rem",
              background: "#3498db",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: "2rem",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      minHeight: "100vh"
    }}>
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        background: "#fff",
        borderRadius: "12px",
        padding: "3rem",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
      }}>
        <h1 style={{
          fontSize: "3rem",
          textAlign: "center",
          color: "#2c3e50",
          marginBottom: "2rem",
          fontWeight: "bold"
        }}>
          RelACKs Owner Dashboard
        </h1>

        {/* Stats Overview */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.5rem",
          marginBottom: "3rem"
        }}>
          <div style={{
            padding: "1.5rem",
            background: "#e8f5e8",
            borderRadius: "8px",
            border: "1px solid #4caf50",
            textAlign: "center"
          }}>
            <h3 style={{ color: "#2e7d32", marginBottom: "0.5rem" }}>Total Bookings</h3>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#2e7d32", margin: 0 }}>
              {bookings.length}
            </p>
          </div>
          
          <div style={{
            padding: "1.5rem",
            background: "#e3f2fd",
            borderRadius: "8px",
            border: "1px solid #2196f3",
            textAlign: "center"
          }}>
            <h3 style={{ color: "#1565c0", marginBottom: "0.5rem" }}>Confirmed</h3>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#1565c0", margin: 0 }}>
              {bookings.filter(b => b.status === 'confirmed').length}
            </p>
          </div>
          
          <div style={{
            padding: "1.5rem",
            background: "#fff3e0",
            borderRadius: "8px",
            border: "1px solid #ff9800",
            textAlign: "center"
          }}>
            <h3 style={{ color: "#e65100", marginBottom: "0.5rem" }}>Blocked Dates</h3>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#e65100", margin: 0 }}>
              {blockedDates.length}
            </p>
          </div>
          
          <div style={{
            padding: "1.5rem",
            background: "#fce4ec",
            borderRadius: "8px",
            border: "1px solid #e91e63",
            textAlign: "center"
          }}>
            <h3 style={{ color: "#ad1457", marginBottom: "0.5rem" }}>Revenue</h3>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#ad1457", margin: 0 }}>
              {formatCurrency(bookings.reduce((sum, b) => sum + b.pricing.total, 0))}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: "flex",
          borderBottom: "2px solid #e9ecef",
          marginBottom: "2rem"
        }}>
          <button
            onClick={() => setActiveTab('bookings')}
            style={{
              padding: "1rem 2rem",
              background: activeTab === 'bookings' ? '#ff7f50' : 'transparent',
              color: activeTab === 'bookings' ? '#fff' : '#666',
              border: 'none',
              cursor: 'pointer',
              fontWeight: activeTab === 'bookings' ? 'bold' : 'normal',
              borderBottom: activeTab === 'bookings' ? '3px solid #ff7f50' : 'none'
            }}
          >
            Bookings
          </button>
          <button
            onClick={() => setActiveTab('blocked')}
            style={{
              padding: "1rem 2rem",
              background: activeTab === 'blocked' ? '#ff7f50' : 'transparent',
              color: activeTab === 'blocked' ? '#fff' : '#666',
              border: 'none',
              cursor: 'pointer',
              fontWeight: activeTab === 'blocked' ? 'bold' : 'normal',
              borderBottom: activeTab === 'blocked' ? '3px solid #ff7f50' : 'none'
            }}
          >
            Blocked Dates
          </button>
          <button
            onClick={() => setActiveTab('blockout')}
            style={{
              padding: "1rem 2rem",
              background: activeTab === 'blockout' ? '#ff7f50' : 'transparent',
              color: activeTab === 'blockout' ? '#fff' : '#666',
              border: 'none',
              cursor: 'pointer',
              fontWeight: activeTab === 'blockout' ? 'bold' : 'normal',
              borderBottom: activeTab === 'blockout' ? '3px solid #ff7f50' : 'none'
            }}
          >
            Block New Date
          </button>
        </div>

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            <h2 style={{
              fontSize: "2rem",
              color: "#2c3e50",
              marginBottom: "1.5rem"
            }}>
              Recent Bookings
            </h2>
            
            <div style={{ display: "grid", gap: "1rem" }}>
              {bookings.map(booking => (
                <div key={booking.id} style={{
                  padding: "1.5rem",
                  border: "1px solid #e9ecef",
                  borderRadius: "8px",
                  background: "#f8f9fa"
                }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "1rem"
                  }}>
                    <div>
                      <h3 style={{ color: "#2c3e50", marginBottom: "0.5rem" }}>
                        {booking.bookingId}
                      </h3>
                      <p style={{ color: "#666", margin: 0 }}>
                        <strong>Customer:</strong> {booking.customer.name} ({booking.customer.email})
                      </p>
                      <p style={{ color: "#666", margin: "0.25rem 0" }}>
                        <strong>Phone:</strong> {booking.customer.phone}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{
                        padding: "0.25rem 0.75rem",
                        background: booking.status === 'confirmed' ? '#e8f5e8' : '#fff3e0',
                        color: booking.status === 'confirmed' ? '#2e7d32' : '#e65100',
                        borderRadius: "20px",
                        fontSize: "0.8rem",
                        fontWeight: "bold"
                      }}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "1rem",
                    marginBottom: "1rem"
                  }}>
                    <div>
                      <strong>Rental Period:</strong><br />
                      {formatDate(booking.rental.startDate)} - {formatDate(booking.rental.endDate)}
                    </div>
                    <div>
                      <strong>Duration:</strong> {booking.rental.duration} days
                    </div>
                    <div>
                      <strong>Total:</strong> {formatCurrency(booking.pricing.total)}
                      {booking.pricing.discount > 0 && (
                        <span style={{ color: "#4caf50", fontSize: "0.9rem" }}>
                          {" "}(Saved {formatCurrency(booking.pricing.discount)})
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <strong>Products:</strong>
                    <ul style={{ margin: "0.5rem 0", paddingLeft: "1.5rem" }}>
                      {booking.products.map((product, index) => (
                        <li key={index}>
                          {product.name} x{product.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div style={{
                    marginTop: "1rem",
                    paddingTop: "1rem",
                    borderTop: "1px solid #e9ecef",
                    fontSize: "0.9rem",
                    color: "#666"
                  }}>
                    <strong>Booked on:</strong> {formatDate(booking.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Blocked Dates Tab */}
        {activeTab === 'blocked' && (
          <div>
            <h2 style={{
              fontSize: "2rem",
              color: "#2c3e50",
              marginBottom: "1.5rem"
            }}>
              Blocked Dates
            </h2>
            
            <div style={{ display: "grid", gap: "1rem" }}>
              {blockedDates.map(blocked => (
                <div key={blocked.id} style={{
                  padding: "1.5rem",
                  border: "1px solid #e9ecef",
                  borderRadius: "8px",
                  background: "#fff3cd"
                }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start"
                  }}>
                    <div>
                      <h3 style={{ color: "#856404", marginBottom: "0.5rem" }}>
                        {formatDate(blocked.date)}
                      </h3>
                      <p style={{ color: "#856404", margin: "0.25rem 0" }}>
                        <strong>Reason:</strong> {blocked.reason}
                      </p>
                      <p style={{ color: "#856404", margin: "0.25rem 0" }}>
                        <strong>Description:</strong> {blocked.description}
                      </p>
                      <p style={{ color: "#856404", margin: "0.25rem 0" }}>
                        <strong>Scope:</strong> {blocked.isAllProductsBlocked ? 'All Products' : 'Specific Products'}
                      </p>
                    </div>
                    <span style={{
                      padding: "0.25rem 0.75rem",
                      background: "#856404",
                      color: "#fff",
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                      fontWeight: "bold"
                    }}>
                      Blocked
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Block New Date Tab */}
        {activeTab === 'blockout' && (
          <div>
            <h2 style={{
              fontSize: "2rem",
              color: "#2c3e50",
              marginBottom: "1.5rem"
            }}>
              Block New Date
            </h2>
            
            <form onSubmit={handleBlockoutSubmit} style={{
              maxWidth: "600px",
              display: "grid",
              gap: "1.5rem"
            }}>
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "bold",
                  color: "#2c3e50"
                }}>
                  Date to Block *
                </label>
                <input
                  type="date"
                  value={newBlockout.date}
                  onChange={(e) => setNewBlockout({...newBlockout, date: e.target.value})}
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                    fontSize: "1rem"
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "bold",
                  color: "#2c3e50"
                }}>
                  Reason *
                </label>
                <select
                  value={newBlockout.reason}
                  onChange={(e) => setNewBlockout({...newBlockout, reason: e.target.value})}
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                    fontSize: "1rem"
                  }}
                >
                  <option value="maintenance">Maintenance</option>
                  <option value="holiday">Holiday</option>
                  <option value="owner-block">Owner Block</option>
                  <option value="weather">Weather</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "bold",
                  color: "#2c3e50"
                }}>
                  Description
                </label>
                <textarea
                  value={newBlockout.description}
                  onChange={(e) => setNewBlockout({...newBlockout, description: e.target.value})}
                  rows="3"
                  placeholder="Explain why this date is blocked..."
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                    fontSize: "1rem",
                    resize: "vertical"
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  cursor: "pointer"
                }}>
                  <input
                    type="checkbox"
                    checked={newBlockout.isAllProductsBlocked}
                    onChange={(e) => setNewBlockout({...newBlockout, isAllProductsBlocked: e.target.checked})}
                    style={{ transform: "scale(1.2)" }}
                  />
                  <span style={{ fontWeight: "bold", color: "#2c3e50" }}>
                    Block all products on this date
                  </span>
                </label>
              </div>

              <button
                type="submit"
                style={{
                  padding: "1rem 2rem",
                  fontSize: "1.1rem",
                  backgroundColor: "#ff7f50",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  transition: "background-color 0.3s ease"
                }}
              >
                Block Date
              </button>
            </form>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
