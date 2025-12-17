"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Booking() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    products: [],
    customer: {
      name: '',
      email: '',
      phone: ''
    },
    address: {
      line1: '',
      city: '',
      state: '',
      zip: ''
    }
  });
  
  const [availableProducts, setAvailableProducts] = useState([]);
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dateError, setDateError] = useState("");
  const [bookingResult, setBookingResult] = useState(null);
  const [productsError, setProductsError] = useState("");
  const [apiBaseUrl, setApiBaseUrl] = useState("");

  // Set API base URL on component mount
  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    setApiBaseUrl(baseUrl);
    console.log('[Booking] API Base URL:', baseUrl);
  }, []);

  // Load products on component mount
  useEffect(() => {
    if (apiBaseUrl) {
      loadProducts();
    }
  }, [apiBaseUrl]);

  // Load availability when dates change
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      loadAvailability();
    }
  }, [formData.startDate, formData.endDate]);

  const loadProducts = async () => {
    try {
      const baseUrl = apiBaseUrl || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const url = `${baseUrl}/api/products`;
      console.log('[Booking] Loading products from:', url);
      
      const response = await axios.get(url);
      setAvailableProducts(response.data);
      setProductsError(""); // Clear any previous errors
      console.log('[Booking] Products loaded successfully:', response.data.length, 'products');
    } catch (error) {
      // Log detailed error for debugging
      console.error('[Booking] Error loading products:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      
      // Set user-friendly error message
      setProductsError("We couldn't load the products. Please try again or contact us.");
      
      // Don't set the general error state - keep the page usable
      // setError('Failed to load products');
    }
  };

  const loadAvailability = async () => {
    try {
      const baseUrl = apiBaseUrl || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${baseUrl}/api/availability`, {
        params: {
          start: formData.startDate,
          end: formData.endDate
        }
      });
      setAvailability(response.data.availability);
    } catch (error) {
      // Log detailed error for debugging
      console.error('[Booking] Error loading availability:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Don't block the user - availability check failure shouldn't prevent booking
      // setError('Failed to load availability');
    }
  };

  const handleProductToggle = (productSlug) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.includes(productSlug)
        ? prev.products.filter(p => p !== productSlug)
        : [...prev.products, productSlug]
    }));
  };

  const handleCustomerChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      customer: { ...prev.customer, [field]: value }
    }));
  };

  const handleAddressChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [field]: value }
    }));
  };

  const isProductAvailable = (productSlug) => {
    if (!availability || Object.keys(availability).length === 0) return true;
    if (!formData.startDate || !formData.endDate) return true;
    
    // Check if product is available on all dates in the booking range [startDate, endDate)
    // Note: endDate is exclusive (checkout day), so we don't check availability for endDate
    const dates = Object.keys(availability).filter(date => {
      return date >= formData.startDate && date < formData.endDate;
    });
    
    if (dates.length === 0) return true;
    
    return dates.every(date => {
      const dayAvailability = availability[date][productSlug];
      return dayAvailability && dayAvailability.available > 0;
    });
  };

  const getProductAvailabilityText = (productSlug) => {
    if (!availability || Object.keys(availability).length === 0) return '';
    if (!formData.startDate || !formData.endDate) return '';
    
    // Only check dates in the booking range [startDate, endDate)
    const dates = Object.keys(availability).filter(date => {
      return date >= formData.startDate && date < formData.endDate;
    });
    
    if (dates.length === 0) return '';
    
    const minAvailable = Math.min(...dates.map(date => {
      const dayAvailability = availability[date][productSlug];
      return dayAvailability ? dayAvailability.available : 0;
    }));
    
    return `(${minAvailable} available)`;
  };

  const calculateTotal = () => {
    // Simple pricing for now - can be enhanced later
    const basePrice = {
      'sauna': 600,
      'cold-plunge': 125,
      'fire-pit': 100
    };
    
    const nights = calculateNights();
    return formData.products.reduce((total, product) => {
      return total + (basePrice[product] * nights);
    }, 0);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const baseUrl = apiBaseUrl || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${baseUrl}/api/bookings`, formData);
      
      setBookingResult(response.data);
      setStep(5); // Move to success step
    } catch (error) {
      // Log detailed error for debugging
      console.error('[Booking] Error creating booking:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status
      });
      setError(error.response?.data?.error || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
      {[1, 2, 3, 4, 5].map((stepNumber) => (
        <div key={stepNumber} style={{ display: "flex", alignItems: "center" }}>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: step >= stepNumber ? "#007bff" : "#e9ecef",
            color: step >= stepNumber ? "#fff" : "#6c757d",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            margin: "0 0.5rem"
          }}>
            {stepNumber}
          </div>
          {stepNumber < 5 && (
            <div style={{
              width: "60px",
              height: "2px",
              background: step > stepNumber ? "#007bff" : "#e9ecef"
            }} />
          )}
        </div>
      ))}
    </div>
  );

  const calculateNights = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.round((end - start) / msPerDay);
  };

  const validateDates = () => {
    if (!formData.startDate || !formData.endDate) {
      setDateError("Please select both start and end dates");
      return false;
    }
    
    if (formData.startDate >= formData.endDate) {
      setDateError("Bookings must be at least 1 night. Please choose an end date after your start date.");
      return false;
    }
    
    const today = new Date().toISOString().split('T')[0];
    if (formData.startDate < today) {
      setDateError("Start date cannot be in the past");
      return false;
    }
    
    const nights = calculateNights();
    if (nights < 1) {
      setDateError("Bookings must be at least 1 night. Please choose an end date after your start date.");
      return false;
    }
    
    setDateError("");
    return true;
  };

  const handleDateChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setDateError(""); // Clear error when user changes date
  };

  const handleStep1Continue = () => {
    if (validateDates()) {
      setStep(2);
    }
  };

  const renderDateSelection = () => {
    const nights = calculateNights();
    const ownerPhone = process.env.NEXT_PUBLIC_OWNER_PHONE || '+14055343295';
    const ownerEmail = process.env.NEXT_PUBLIC_OWNER_EMAIL || 'relackswellness@gmail.com';
    
    return (
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem", color: "#2c3e50" }}>
          Select Your Rental Dates
        </h2>
        
        <div style={{ display: "grid", gap: "1rem", maxWidth: "600px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: "#333" }}>
              Start Date *
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleDateChange('startDate', e.target.value)}
              required
              min={new Date().toISOString().split('T')[0]}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "4px",
                border: dateError && !formData.startDate ? "1px solid #dc3545" : "1px solid #ddd",
                fontSize: "1rem",
                color: "#000"
              }}
            />
          </div>
          
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: "#333" }}>
              End Date (Checkout Morning) *
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
              required
              min={formData.startDate ? new Date(new Date(formData.startDate).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "4px",
                border: dateError && !formData.endDate ? "1px solid #dc3545" : "1px solid #ddd",
                fontSize: "1rem",
                color: "#000"
              }}
            />
          </div>
        </div>

        {dateError && (
          <div style={{ 
            marginTop: "1rem", 
            padding: "1rem", 
            background: "#f8d7da", 
            borderRadius: "8px",
            border: "1px solid #f5c6cb",
            color: "#721c24"
          }}>
            <p style={{ margin: 0 }}>{dateError}</p>
          </div>
        )}

        {formData.startDate && formData.endDate && !dateError && (
          <div style={{ 
            marginTop: "1rem", 
            padding: "1rem", 
            background: "#e8f5e8", 
            borderRadius: "8px",
            border: "1px solid #4caf50"
          }}>
            <p style={{ margin: 0, color: "#2e7d32" }}>
              <strong>Selected:</strong> {formData.startDate} - {formData.endDate}
              <br />
              <strong>Duration:</strong> {nights} {nights === 1 ? 'night' : 'nights'}
            </p>
          </div>
        )}
        
        <div style={{ 
          marginTop: "1rem", 
          padding: "1rem", 
          background: "#fff3cd", 
          borderRadius: "8px",
          border: "1px solid #ffc107",
          fontSize: "0.9rem",
          color: "#856404"
        }}>
          <p style={{ margin: 0 }}>
            <strong>ℹ️ Note:</strong> All bookings are per night (checkout in the morning of your end date). 
            If you have any special timing requests, please contact us at{" "}
            <a href={`tel:${ownerPhone}`} style={{ color: "#856404", textDecoration: "underline" }}>
              {ownerPhone}
            </a>{" "}
            or{" "}
            <a href={`mailto:${ownerEmail}`} style={{ color: "#856404", textDecoration: "underline" }}>
              {ownerEmail}
            </a>.
          </p>
        </div>
      </div>
    );
  };

  const renderProductSelection = () => (
    <div style={{ marginBottom: "2rem" }}>
      <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem", color: "#2c3e50" }}>
        Choose Your Products
      </h2>
      
      {productsError && (
        <div style={{ 
          marginBottom: "1rem", 
          padding: "0.75rem", 
          background: "#fff3cd", 
          borderRadius: "6px",
          border: "1px solid #ffc107",
          color: "#856404",
          fontSize: "0.9rem"
        }}>
          {productsError}
        </div>
      )}
      
      {availableProducts.length === 0 && !productsError && (
        <div style={{ 
          marginBottom: "1rem", 
          padding: "0.75rem", 
          background: "#e3f2fd", 
          borderRadius: "6px",
          border: "1px solid #2196f3",
          color: "#1976d2",
          fontSize: "0.9rem"
        }}>
          Loading products...
        </div>
      )}
      
      <div style={{ display: "grid", gap: "1rem" }}>
        {availableProducts.map(product => {
          const isAvailable = isProductAvailable(product.slug);
          const availabilityText = getProductAvailabilityText(product.slug);
          
          return (
            <div key={product.slug} style={{
              padding: "1rem",
              border: "1px solid #ddd",
              borderRadius: "8px",
              background: isAvailable ? "#fff" : "#f8f9fa",
              opacity: isAvailable ? 1 : 0.6
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <input
                  type="checkbox"
                  id={product.slug}
                  checked={formData.products.includes(product.slug)}
                  onChange={() => handleProductToggle(product.slug)}
                  disabled={!isAvailable}
                  style={{ transform: "scale(1.2)" }}
                />
                <div style={{ flex: 1 }}>
                  <label htmlFor={product.slug} style={{ 
                    fontWeight: "bold", 
                    cursor: isAvailable ? "pointer" : "not-allowed",
                    color: isAvailable ? "#2c3e50" : "#6c757d"
                  }}>
                    {product.name} {availabilityText}
                  </label>
                  {!isAvailable && (
                    <p style={{ margin: "0.5rem 0", color: "#dc3545", fontSize: "0.9rem" }}>
                      Not available for selected dates
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {formData.products.length > 0 && (
        <div style={{ 
          marginTop: "1rem", 
          padding: "1rem", 
          background: "#e3f2fd", 
          borderRadius: "8px",
          border: "1px solid #2196f3"
        }}>
          <p style={{ margin: 0, color: "#1976d2" }}>
            <strong>Selected Products:</strong> {formData.products.length} item(s)
          </p>
        </div>
      )}
    </div>
  );

  const renderContactForm = () => (
    <div style={{ marginBottom: "2rem" }}>
      <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem", color: "#2c3e50" }}>
        Contact Information
      </h2>
      
      <div style={{ display: "grid", gap: "1rem", maxWidth: "600px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: "#333" }}>
            Full Name *
          </label>
          <input
            type="text"
            value={formData.customer.name}
            onChange={(e) => handleCustomerChange('name', e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "4px",
              border: "1px solid #ddd",
              fontSize: "1rem",
              color: "#000"
            }}
          />
        </div>
        
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: "#333" }}>
            Email Address *
          </label>
          <input
            type="email"
            value={formData.customer.email}
            onChange={(e) => handleCustomerChange('email', e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "4px",
              border: "1px solid #ddd",
              fontSize: "1rem",
              color: "#000"
            }}
          />
        </div>
        
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: "#333" }}>
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.customer.phone}
            onChange={(e) => handleCustomerChange('phone', e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "4px",
              border: "1px solid #ddd",
              fontSize: "1rem",
              color: "#000"
            }}
          />
        </div>
        
        <h3 style={{ color: "#2c3e50", marginTop: "1rem" }}>Delivery Address</h3>
        
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: "#333" }}>
            Street Address *
          </label>
          <input
            type="text"
            value={formData.address.line1}
            onChange={(e) => handleAddressChange('line1', e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "4px",
              border: "1px solid #ddd",
              fontSize: "1rem",
              color: "#000"
            }}
          />
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: "#333" }}>
              City *
            </label>
            <input
              type="text"
              value={formData.address.city}
              onChange={(e) => handleAddressChange('city', e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "4px",
                border: "1px solid #ddd",
                fontSize: "1rem",
                color: "#000"
              }}
            />
          </div>
          
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: "#333" }}>
              State *
            </label>
            <input
              type="text"
              value={formData.address.state}
              onChange={(e) => handleAddressChange('state', e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "4px",
                border: "1px solid #ddd",
                fontSize: "1rem",
                color: "#000"
              }}
            />
          </div>
          
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: "#333" }}>
              ZIP *
            </label>
            <input
              type="text"
              value={formData.address.zip}
              onChange={(e) => handleAddressChange('zip', e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "4px",
                border: "1px solid #ddd",
                fontSize: "1rem",
                color: "#000"
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderReview = () => {
    const total = calculateTotal();
    const nights = calculateNights();
    
    return (
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem", color: "#2c3e50" }}>
          Review Your Booking
        </h2>
        
        <div style={{
          padding: "1.5rem",
          border: "1px solid #ddd",
          borderRadius: "8px",
          background: "#fff"
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
            <div>
              <h3 style={{ color: "#2c3e50", marginBottom: "1rem" }}>Booking Details</h3>
              <p><strong>Dates:</strong> {formData.startDate} - {formData.endDate}</p>
              <p><strong>Duration:</strong> {nights} {nights === 1 ? 'night' : 'nights'}</p>
              
              <h4 style={{ color: "#2c3e50", marginTop: "1rem", marginBottom: "0.5rem" }}>Products:</h4>
              {formData.products.map((product, index) => {
                const productInfo = availableProducts.find(p => p.slug === product);
                return (
                  <div key={index} style={{ margin: "0.5rem 0", padding: "0.5rem", background: "#f8f9fa", borderRadius: "4px" }}>
                    <p style={{ margin: "0.25rem 0", fontWeight: "bold" }}>{productInfo?.name}</p>
                  </div>
                );
              })}
            </div>
            
            <div>
              <h3 style={{ color: "#2c3e50", marginBottom: "1rem" }}>Total</h3>
              <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#2c3e50" }}>
                <strong>${total}</strong>
              </p>
              <p style={{ fontSize: "0.9rem", color: "#666" }}>
                * Final pricing will be confirmed upon contact
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPaymentInstructions = () => (
    <div style={{ marginBottom: "2rem" }}>
      {bookingResult && (
        <div style={{
          padding: "1.5rem",
          border: "1px solid #ddd",
          borderRadius: "8px",
          background: "#fff",
          marginBottom: "2rem"
        }}>
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <h3 style={{ color: "#2c3e50", marginBottom: "0.5rem" }}>Booking Request Created!</h3>
            <p style={{ color: "#666", margin: 0 }}>Booking ID: {bookingResult.bookingId}</p>
          </div>
          
          <div style={{
            padding: "1rem",
            background: "#e8f5e8",
            borderRadius: "6px",
            border: "1px solid #4caf50",
            marginBottom: "1.5rem"
          }}>
            <p style={{ margin: 0, color: "#2e7d32", textAlign: "center", fontSize: "1.1rem" }}>
              ✅ Your booking request has been submitted successfully!
            </p>
          </div>
          
          <p style={{ textAlign: "center", marginBottom: "1.5rem", color: "#666" }}>
            To complete your booking, please reach out to us directly to arrange payment and delivery details.
          </p>
          
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href={`tel:${process.env.NEXT_PUBLIC_OWNER_PHONE || '+14055343295'}`}
              style={{
                padding: "0.75rem 1.5rem",
                fontSize: "1rem",
                backgroundColor: "#28a745",
                color: "#fff",
                textDecoration: "none",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              📞 Call Us
            </a>
            <a
              href={`sms:${process.env.NEXT_PUBLIC_OWNER_PHONE || '+14055343295'}`}
              style={{
                padding: "0.75rem 1.5rem",
                fontSize: "1rem",
                backgroundColor: "#17a2b8",
                color: "#fff",
                textDecoration: "none",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              💬 Text Us
            </a>
            <a
              href={`mailto:${process.env.NEXT_PUBLIC_OWNER_EMAIL || 'relackswellness@gmail.com'}`}
              style={{
                padding: "0.75rem 1.5rem",
                fontSize: "1rem",
                backgroundColor: "#6f42c1",
                color: "#fff",
                textDecoration: "none",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              📧 Email Us
            </a>
          </div>
          
          <div style={{
            marginTop: "1.5rem",
            padding: "1rem",
            background: "#f8f9fa",
            borderRadius: "6px",
            border: "1px solid #dee2e6"
          }}>
            <h4 style={{ color: "#2c3e50", marginBottom: "0.5rem" }}>What happens next?</h4>
            <ul style={{ margin: 0, paddingLeft: "1.5rem", color: "#666" }}>
              <li>We'll contact you to confirm your booking details</li>
              <li>Payment will be arranged via Venmo</li>
              <li>You'll receive a confirmation email once payment is complete</li>
              <li>We'll coordinate delivery and setup for your rental dates</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );

  const renderNavigation = () => (
    <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
      {step > 1 && step < 5 && (
        <button
          onClick={() => setStep(step - 1)}
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            backgroundColor: "#6c757d",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Previous
        </button>
      )}
      
      {step === 1 && (
        <button
          type="button"
          onClick={handleStep1Continue}
          disabled={!formData.startDate || !formData.endDate}
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            backgroundColor: formData.startDate && formData.endDate ? "#007bff" : "#6c757d",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: formData.startDate && formData.endDate ? "pointer" : "not-allowed",
            opacity: formData.startDate && formData.endDate ? 1 : 0.6
          }}
        >
          Continue to Products
        </button>
      )}
      
      {step === 2 && (
        <button
          onClick={() => setStep(3)}
          disabled={formData.products.length === 0}
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            backgroundColor: formData.products.length > 0 ? "#28a745" : "#6c757d",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: formData.products.length > 0 ? "pointer" : "not-allowed"
          }}
        >
          Continue to Contact Info
        </button>
      )}
      
      {step === 3 && (
        <button
          onClick={() => setStep(4)}
          disabled={!formData.customer.name || !formData.customer.email || !formData.customer.phone || !formData.address.line1 || !formData.address.city || !formData.address.state || !formData.address.zip}
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            backgroundColor: (formData.customer.name && formData.customer.email && formData.customer.phone && formData.address.line1 && formData.address.city && formData.address.state && formData.address.zip) ? "#007bff" : "#6c757d",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: (formData.customer.name && formData.customer.email && formData.customer.phone && formData.address.line1 && formData.address.city && formData.address.state && formData.address.zip) ? "pointer" : "not-allowed"
          }}
        >
          Review Booking
        </button>
      )}
      
      {step === 4 && (
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            backgroundColor: loading ? "#6c757d" : "#ff7f50",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Submitting..." : "Submit Booking Request"}
        </button>
      )}
    </div>
  );

  return (
    <div style={{
      padding: "2rem",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      minHeight: "100vh"
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        background: "#fff",
        borderRadius: "12px",
        padding: "2rem",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
      }}>
        <h1 style={{ 
          fontSize: "3rem", 
          marginBottom: "1rem", 
          textAlign: "center", 
          color: "#2c3e50",
          fontWeight: "bold"
        }}>
          Book Your RelAcksation Experience
        </h1>
        
        <p style={{ 
          fontSize: "1.2rem", 
          textAlign: "center", 
          marginBottom: "2rem", 
          color: "#666" 
        }}>
          Select dates, choose products, and request your premium wellness rental
        </p>

        {error && (
          <div style={{
            padding: "1rem",
            background: "#f8d7da",
            color: "#721c24",
            borderRadius: "6px",
            marginBottom: "1rem",
            border: "1px solid #f5c6cb"
          }}>
            {error}
          </div>
        )}

        {renderStepIndicator()}

        {/* Step content */}
        {step === 1 && renderDateSelection()}
        {step === 2 && renderProductSelection()}
        {step === 3 && renderContactForm()}
        {step === 4 && renderReview()}
        {step === 5 && renderPaymentInstructions()}

        {step < 5 && renderNavigation()}
      </div>
    </div>
  );
}