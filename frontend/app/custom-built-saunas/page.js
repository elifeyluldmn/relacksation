"use client";

export default function CustomBuiltSaunas() {
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
          Custom Built Saunas
        </h1>

        <div style={{
          display: "grid",
          gap: "3rem",
          marginBottom: "3rem"
        }}>
          {/* Main Introduction */}
          <section>
            <div style={{
              textAlign: "center",
              marginBottom: "2rem"
            }}>
              <div style={{
                fontSize: "4rem",
                marginBottom: "1rem"
              }}>
                🔨🔥
              </div>
              <p style={{
                fontSize: "1.3rem",
                lineHeight: "1.8",
                color: "#555",
                maxWidth: "800px",
                margin: "0 auto"
              }}>
                At RelAcksation, we don't just rent saunas – we build them too! 
                Let us create a custom-built sauna designed specifically for your space, 
                style, and wellness needs.
              </p>
            </div>
          </section>

          {/* Why Choose Custom */}
          <section>
            <h2 style={{
              fontSize: "2rem",
              color: "#2c3e50",
              marginBottom: "1.5rem",
              borderBottom: "3px solid #ff7f50",
              paddingBottom: "0.5rem"
            }}>
              Why Choose a Custom Built Sauna?
            </h2>
            
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem"
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
                  🎨 Personalized Design
                </h3>
                <p style={{ color: "#666", lineHeight: "1.6" }}>
                  Every sauna is tailored to match your aesthetic preferences, 
                  space requirements, and functional needs.
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
                  🏠 Perfect Fit
                </h3>
                <p style={{ color: "#666", lineHeight: "1.6" }}>
                  Custom dimensions ensure your sauna fits perfectly in your 
                  home, backyard, or commercial space.
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
                  ⚙️ Premium Materials
                </h3>
                <p style={{ color: "#666", lineHeight: "1.6" }}>
                  We use only the highest quality cedar, hemlock, and state-of-the-art 
                  heating systems for lasting performance.
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
                  🔧 Expert Installation
                </h3>
                <p style={{ color: "#666", lineHeight: "1.6" }}>
                  Professional installation and setup included with every custom build.
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
                  ♻️ Energy Efficient
                </h3>
                <p style={{ color: "#666", lineHeight: "1.6" }}>
                  Modern insulation and heating technology for optimal energy efficiency.
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
                  🛡️ Warranty & Support
                </h3>
                <p style={{ color: "#666", lineHeight: "1.6" }}>
                  Comprehensive warranty and ongoing maintenance support for peace of mind.
                </p>
              </div>
            </div>
          </section>

          {/* Our Process */}
          <section>
            <h2 style={{
              fontSize: "2rem",
              color: "#2c3e50",
              marginBottom: "1.5rem",
              borderBottom: "3px solid #ff7f50",
              paddingBottom: "0.5rem"
            }}>
              Our Process
            </h2>
            
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem"
            }}>
              {[
                { step: "1", title: "Consultation", desc: "We discuss your vision, space, and budget to create the perfect design plan." },
                { step: "2", title: "Design & Quote", desc: "Receive a detailed design proposal and transparent pricing quote." },
                { step: "3", title: "Material Selection", desc: "Choose from premium wood types, heating systems, and finishing options." },
                { step: "4", title: "Construction", desc: "Our expert craftsmen build your sauna with precision and care." },
                { step: "5", title: "Installation", desc: "Professional installation at your location with full setup and testing." },
                { step: "6", title: "Enjoy!", desc: "Start enjoying your personalized wellness sanctuary!" }
              ].map((item, index) => (
                <div key={index} style={{
                  display: "flex",
                  gap: "1.5rem",
                  alignItems: "flex-start"
                }}>
                  <div style={{
                    minWidth: "50px",
                    height: "50px",
                    background: "#ff7f50",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.3rem",
                    fontWeight: "bold",
                    color: "#fff"
                  }}>
                    {item.step}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{
                      fontSize: "1.2rem",
                      color: "#2c3e50",
                      marginBottom: "0.5rem"
                    }}>
                      {item.title}
                    </h4>
                    <p style={{ color: "#666", lineHeight: "1.6" }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section style={{
            textAlign: "center",
            padding: "3rem 2rem",
            background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
            borderRadius: "12px",
            border: "2px solid #ff7f50"
          }}>
            <h2 style={{
              fontSize: "2rem",
              color: "#2c3e50",
              marginBottom: "1rem"
            }}>
              Ready to Build Your Dream Sauna?
            </h2>
            <p style={{
              fontSize: "1.2rem",
              color: "#555",
              marginBottom: "2rem",
              maxWidth: "700px",
              margin: "0 auto 2rem"
            }}>
              Contact us today for a free consultation and quote. Let's create the perfect 
              wellness sanctuary for your home or business.
            </p>

            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              alignItems: "center",
              marginBottom: "2rem"
            }}>
              <div style={{
                fontSize: "1.1rem",
                color: "#2c3e50"
              }}>
                <strong>📞 Phone:</strong> {process.env.NEXT_PUBLIC_OWNER_PHONE ? `+1 (${process.env.NEXT_PUBLIC_OWNER_PHONE.slice(2, 5)}) ${process.env.NEXT_PUBLIC_OWNER_PHONE.slice(5, 8)}-${process.env.NEXT_PUBLIC_OWNER_PHONE.slice(8)}` : '+1 (405) 534-3295'}
              </div>
              <div style={{
                fontSize: "1.1rem",
                color: "#2c3e50"
              }}>
                <strong>📧 Email:</strong> {process.env.NEXT_PUBLIC_OWNER_EMAIL || 'relackswellness@gmail.com'}
              </div>
            </div>

            <div style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap"
            }}>
              <a
                href={`tel:${process.env.NEXT_PUBLIC_OWNER_PHONE || '+14055343295'}`}
                style={{
                  padding: "1rem 2rem",
                  fontSize: "1.1rem",
                  backgroundColor: "#28a745",
                  color: "#fff",
                  textDecoration: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  transition: "background-color 0.3s ease"
                }}
              >
                📞 Call Us Now
              </a>
              <a
                href={`mailto:${process.env.NEXT_PUBLIC_OWNER_EMAIL || 'relackswellness@gmail.com'}`}
                style={{
                  padding: "1rem 2rem",
                  fontSize: "1.1rem",
                  backgroundColor: "#6f42c1",
                  color: "#fff",
                  textDecoration: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  transition: "background-color 0.3s ease"
                }}
              >
                📧 Email Us
              </a>
              <a
                href="/contact"
                style={{
                  padding: "1rem 2rem",
                  fontSize: "1.1rem",
                  backgroundColor: "#3498db",
                  color: "#fff",
                  textDecoration: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  transition: "background-color 0.3s ease"
                }}
              >
                Contact Form
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

