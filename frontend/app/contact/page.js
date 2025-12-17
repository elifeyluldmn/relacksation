"use client";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this to your backend
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

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
          Contact RelACKs
        </h1>

        <p style={{
          fontSize: "1.2rem",
          textAlign: "center",
          color: "#666",
          marginBottom: "3rem",
          maxWidth: "600px",
          margin: "0 auto 3rem"
        }}>
          Have questions about our services? Need help with your booking? 
          We're here to help! Reach out to us through any of the methods below.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "3rem",
          marginBottom: "3rem"
        }}>
          {/* Contact Information */}
          <div>
            <h2 style={{
              fontSize: "2rem",
              color: "#2c3e50",
              marginBottom: "1.5rem",
              borderBottom: "3px solid #ff7f50",
              paddingBottom: "0.5rem"
            }}>
              Get in Touch
            </h2>

            <div style={{ display: "grid", gap: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{
                  width: "50px",
                  height: "50px",
                  background: "#ff7f50",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                  color: "#fff"
                }}>
                  📧
                </div>
                <div>
                  <h4 style={{ color: "#2c3e50", marginBottom: "0.25rem" }}>Email</h4>
                  <p style={{ color: "#666", margin: 0 }}>
                    <a href="mailto:relackswellness@gmail.com" style={{ color: "#3498db", textDecoration: "none" }}>
                      relackswellness@gmail.com
                    </a>
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{
                  width: "50px",
                  height: "50px",
                  background: "#ff7f50",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                  color: "#fff"
                }}>
                  📱
                </div>
                <div>
                  <h4 style={{ color: "#2c3e50", marginBottom: "0.25rem" }}>Phone</h4>
                  <p style={{ color: "#666", margin: 0 }}>
                    <a href="tel:+14055343295" style={{ color: "#3498db", textDecoration: "none" }}>
                      +1 (405) 534-3295
                    </a>
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{
                  width: "50px",
                  height: "50px",
                  background: "#ff7f50",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                  color: "#fff"
                }}>
                  📍
                </div>
                <div>
                  <h4 style={{ color: "#2c3e50", marginBottom: "0.25rem" }}>Location</h4>
                  <p style={{ color: "#666", margin: 0 }}>
                    Nantucket, Massachusetts<br />
                    Serving the entire island
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{
                  width: "50px",
                  height: "50px",
                  background: "#ff7f50",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                  color: "#fff"
                }}>
                  🕒
                </div>
                <div>
                  <h4 style={{ color: "#2c3e50", marginBottom: "0.25rem" }}>Business Hours</h4>
                  <p style={{ color: "#666", margin: 0 }}>
                    Monday - Sunday: 7:00 AM - 9:00 PM<br />
                    Available for emergency bookings 24/7
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div style={{
              marginTop: "2rem",
              padding: "1.5rem",
              background: "#f8f9fa",
              borderRadius: "8px",
              border: "1px solid #e9ecef"
            }}>
              <h4 style={{ color: "#2c3e50", marginBottom: "1rem" }}>Quick Links</h4>
              <div style={{ display: "grid", gap: "0.5rem" }}>
                <a href="/booking" style={{
                  color: "#3498db",
                  textDecoration: "none",
                  fontSize: "0.9rem"
                }}>
                  → Book Your Equipment
                </a>
                <a href="/about" style={{
                  color: "#3498db",
                  textDecoration: "none",
                  fontSize: "0.9rem"
                }}>
                  → Learn About Our Services
                </a>
                <a href="#faq" style={{
                  color: "#3498db",
                  textDecoration: "none",
                  fontSize: "0.9rem"
                }}>
                  → View FAQ
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 style={{
              fontSize: "2rem",
              color: "#2c3e50",
              marginBottom: "1.5rem",
              borderBottom: "3px solid #ff7f50",
              paddingBottom: "0.5rem"
            }}>
              Send us a Message
            </h2>

            {submitted ? (
              <div style={{
                padding: "2rem",
                background: "#e8f5e8",
                borderRadius: "8px",
                border: "1px solid #4caf50",
                textAlign: "center"
              }}>
                <div style={{
                  width: "60px",
                  height: "60px",
                  background: "#4caf50",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem",
                  fontSize: "2rem",
                  color: "#fff"
                }}>
                  ✓
                </div>
                <h3 style={{ color: "#2e7d32", marginBottom: "0.5rem" }}>
                  Message Sent!
                </h3>
                <p style={{ color: "#2e7d32", margin: 0 }}>
                  Thank you for contacting us. We'll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  style={{
                    marginTop: "1rem",
                    padding: "0.5rem 1rem",
                    background: "#4caf50",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
                <div>
                  <label style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "bold",
                    color: "#2c3e50"
                  }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
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
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
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
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
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
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                      fontSize: "1rem"
                    }}
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="booking">Booking Question</option>
                    <option value="pricing">Pricing Information</option>
                    <option value="support">Technical Support</option>
                    <option value="feedback">Feedback</option>
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
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="Tell us how we can help you..."
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
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <section id="faq" style={{ marginTop: "3rem" }}>
          <h2 style={{
            fontSize: "2rem",
            color: "#2c3e50",
            marginBottom: "1.5rem",
            borderBottom: "3px solid #ff7f50",
            paddingBottom: "0.5rem"
          }}>
            Frequently Asked Questions
          </h2>

          <div style={{ display: "grid", gap: "1rem" }}>
            <div style={{
              padding: "1.5rem",
              border: "1px solid #e9ecef",
              borderRadius: "8px",
              background: "#f8f9fa"
            }}>
              <h4 style={{ color: "#2c3e50", marginBottom: "0.5rem" }}>
                How far in advance should I book?
              </h4>
              <p style={{ color: "#666", margin: 0 }}>
                We recommend booking at least 1-2 weeks in advance, especially during peak season. 
                However, we do accept last-minute bookings based on availability.
              </p>
            </div>

            <div style={{
              padding: "1.5rem",
              border: "1px solid #e9ecef",
              borderRadius: "8px",
              background: "#f8f9fa"
            }}>
              <h4 style={{ color: "#2c3e50", marginBottom: "0.5rem" }}>
                What areas do you serve?
              </h4>
              <p style={{ color: "#666", margin: 0 }}>
                We serve the entire island of Nantucket, including all neighborhoods and beach areas. 
                Delivery is included in your rental price.
              </p>
            </div>

            <div style={{
              padding: "1.5rem",
              border: "1px solid #e9ecef",
              borderRadius: "8px",
              background: "#f8f9fa"
            }}>
              <h4 style={{ color: "#2c3e50", marginBottom: "0.5rem" }}>
                Do you provide setup and training?
              </h4>
              <p style={{ color: "#666", margin: 0 }}>
                Yes! Our team will deliver, set up, and provide complete training on all equipment. 
                We'll also be available for support throughout your rental period.
              </p>
            </div>

            <div style={{
              padding: "1.5rem",
              border: "1px solid #e9ecef",
              borderRadius: "8px",
              background: "#f8f9fa"
            }}>
              <h4 style={{ color: "#2c3e50", marginBottom: "0.5rem" }}>
                What if I need to cancel or reschedule?
              </h4>
              <p style={{ color: "#666", margin: 0 }}>
                We offer flexible cancellation policies. Cancellations made 48+ hours in advance 
                receive a full refund. Rescheduling is free and subject to availability.
              </p>
            </div>
          </div>
        </section>

        {/* Emergency Contact */}
        <div style={{
          marginTop: "3rem",
          padding: "2rem",
          background: "#fff3cd",
          borderRadius: "8px",
          border: "1px solid #ffeaa7",
          textAlign: "center"
        }}>
          <h3 style={{ color: "#856404", marginBottom: "1rem" }}>
            🚨 Emergency Support
          </h3>
          <p style={{ color: "#856404", marginBottom: "1rem" }}>
            Need immediate assistance with your rental? Call our 24/7 emergency line:
          </p>
          <a href="tel:+14055343295" style={{
            fontSize: "1.2rem",
            color: "#856404",
            textDecoration: "none",
            fontWeight: "bold"
          }}>
            +1 (405) 534-3295
          </a>
        </div>
      </div>
    </div>
  );
}
