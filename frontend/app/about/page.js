"use client";

export default function About() {
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
          About RelACKs
        </h1>

        <div style={{
          display: "grid",
          gap: "3rem",
          marginBottom: "3rem"
        }}>
          {/* Company Story */}
          <section>
            <h2 style={{
              fontSize: "2rem",
              color: "#2c3e50",
              marginBottom: "1rem",
              borderBottom: "3px solid #ff7f50",
              paddingBottom: "0.5rem"
            }}>
              Our Story
            </h2>
            <p style={{
              fontSize: "1.1rem",
              lineHeight: "1.8",
              color: "#555",
              marginBottom: "1rem"
            }}>
              Founded in the heart of Nantucket, RelACKs was born from a simple idea: 
              everyone deserves access to premium wellness experiences.
            </p>
            <p style={{
              fontSize: "1.1rem",
              lineHeight: "1.8",
              color: "#555",
              marginBottom: "1rem"
            }}>
              We specialize in portable sauna and cold plunge rentals, bringing the luxury of 
              professional wellness equipment directly to your doorstep. Whether you're hosting 
              a special event, recovering from an intense workout, or simply want to enhance 
              your daily wellness routine, RelACKs has you covered.
            </p>
          </section>

          {/* Mission */}
          <section>
            <h2 style={{
              fontSize: "2rem",
              color: "#2c3e50",
              marginBottom: "1rem",
              borderBottom: "3px solid #ff7f50",
              paddingBottom: "0.5rem"
            }}>
              Our Mission
            </h2>
            <p style={{
              fontSize: "1.1rem",
              lineHeight: "1.8",
              color: "#555",
              marginBottom: "1rem"
            }}>
              To democratize access to premium wellness experiences by providing 
              high-quality, portable equipment that transforms any space into a 
              sanctuary of health and relaxation.
            </p>
          </section>

          {/* Services */}
          <section>
            <h2 style={{
              fontSize: "2rem",
              color: "#2c3e50",
              marginBottom: "1rem",
              borderBottom: "3px solid #ff7f50",
              paddingBottom: "0.5rem"
            }}>
              Our Services
            </h2>
            
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem"
            }}>
              <div style={{
                padding: "1.5rem",
                border: "1px solid #e9ecef",
                borderRadius: "8px",
                background: "#f8f9fa"
              }}>
                <h3 style={{
                  fontSize: "1.3rem",
                  color: "#2c3e50",
                  marginBottom: "1rem"
                }}>
                  🔥 Portable Sauna
                </h3>
                <p style={{ color: "#666", lineHeight: "1.6" }}>
                  Professional-grade infrared saunas that deliver deep, therapeutic heat 
                  for detoxification, relaxation, and muscle recovery. Easy setup and 
                  operation in any location.
                </p>
              </div>

              <div style={{
                padding: "1.5rem",
                border: "1px solid #e9ecef",
                borderRadius: "8px",
                background: "#f8f9fa"
              }}>
                <h3 style={{
                  fontSize: "1.3rem",
                  color: "#2c3e50",
                  marginBottom: "1rem"
                }}>
                  ❄️ Cold Plunge Therapy
                </h3>
                <p style={{ color: "#666", lineHeight: "1.6" }}>
                  Invigorating cold therapy tubs designed to reduce inflammation, 
                  improve circulation, and accelerate muscle recovery. Perfect for 
                  athletes and wellness enthusiasts.
                </p>
              </div>
            </div>
          </section>

          {/* Why Choose Us */}
          <section>
            <h2 style={{
              fontSize: "2rem",
              color: "#2c3e50",
              marginBottom: "1rem",
              borderBottom: "3px solid #ff7f50",
              paddingBottom: "0.5rem"
            }}>
              Why Choose RelACKs?
            </h2>
            
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1.5rem"
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{
                  width: "60px",
                  height: "60px",
                  background: "#ff7f50",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem",
                  fontSize: "1.5rem",
                  color: "#fff"
                }}>
                  🚚
                </div>
                <h4 style={{ color: "#2c3e50", marginBottom: "0.5rem" }}>Convenient Delivery</h4>
                <p style={{ color: "#666", fontSize: "0.9rem" }}>
                  We deliver and set up equipment at your location, then pick it up when you're done.
                </p>
              </div>

              <div style={{ textAlign: "center" }}>
                <div style={{
                  width: "60px",
                  height: "60px",
                  background: "#ff7f50",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem",
                  fontSize: "1.5rem",
                  color: "#fff"
                }}>
                  ⭐
                </div>
                <h4 style={{ color: "#2c3e50", marginBottom: "0.5rem" }}>Premium Quality</h4>
                <p style={{ color: "#666", fontSize: "0.9rem" }}>
                  All equipment is professionally maintained and sanitized between uses.
                </p>
              </div>

              <div style={{ textAlign: "center" }}>
                <div style={{
                  width: "60px",
                  height: "60px",
                  background: "#ff7f50",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem",
                  fontSize: "1.5rem",
                  color: "#fff"
                }}>
                  💰
                </div>
                <h4 style={{ color: "#2c3e50", marginBottom: "0.5rem" }}>Flexible Pricing</h4>
                <p style={{ color: "#666", fontSize: "0.9rem" }}>
                  Competitive rates with discounts for longer rentals and package deals.
                </p>
              </div>

              <div style={{ textAlign: "center" }}>
                <div style={{
                  width: "60px",
                  height: "60px",
                  background: "#ff7f50",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem",
                  fontSize: "1.5rem",
                  color: "#fff"
                }}>
                  🛡️
                </div>
                <h4 style={{ color: "#2c3e50", marginBottom: "0.5rem" }}>Fully Insured</h4>
                <p style={{ color: "#666", fontSize: "0.9rem" }}>
                  Comprehensive insurance coverage for your peace of mind.
                </p>
              </div>
            </div>
          </section>

          {/* Team */}
          <section>
            <h2 style={{
              fontSize: "2rem",
              color: "#2c3e50",
              marginBottom: "1rem",
              borderBottom: "3px solid #ff7f50",
              paddingBottom: "0.5rem"
            }}>
              Our Team
            </h2>
            <p style={{
              fontSize: "1.1rem",
              lineHeight: "1.8",
              color: "#555",
              marginBottom: "1rem"
            }}>
              RelACKs is powered by a dedicated team of wellness enthusiasts, 
              logistics experts, and customer service professionals. We're committed 
              to providing exceptional service and ensuring every rental experience 
              exceeds your expectations.
            </p>
          </section>

          {/* Contact CTA */}
          <section style={{
            textAlign: "center",
            padding: "2rem",
            background: "#f8f9fa",
            borderRadius: "8px",
            border: "1px solid #e9ecef"
          }}>
            <h3 style={{
              fontSize: "1.5rem",
              color: "#2c3e50",
              marginBottom: "1rem"
            }}>
              Ready to Experience RelACKs?
            </h3>
            <p style={{
              color: "#666",
              marginBottom: "1.5rem",
              fontSize: "1.1rem"
            }}>
              Book your wellness equipment today and transform your space into a 
              sanctuary of health and relaxation.
            </p>
            <div style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap"
            }}>
              <a href="/booking" style={{
                padding: "0.75rem 1.5rem",
                fontSize: "1rem",
                backgroundColor: "#ff7f50",
                color: "#fff",
                textDecoration: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                transition: "background-color 0.3s ease"
              }}>
                Book Now
              </a>
              <a href="/contact" style={{
                padding: "0.75rem 1.5rem",
                fontSize: "1rem",
                backgroundColor: "#3498db",
                color: "#fff",
                textDecoration: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                transition: "background-color 0.3s ease"
              }}>
                Contact Us
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
  