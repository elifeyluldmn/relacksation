export default function Success() {
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
        maxWidth: "600px",
        margin: "0 auto",
        background: "#fff",
        borderRadius: "12px",
        padding: "3rem",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        textAlign: "center"
      }}>
        <div style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "#28a745",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 2rem",
          fontSize: "2rem"
        }}>
          ✅
        </div>
        
        <h1 style={{ 
          fontSize: "2.5rem", 
          marginBottom: "1rem", 
          color: "#2c3e50",
          fontWeight: "bold"
        }}>
          Request Received!
        </h1>
        
        <p style={{ 
          fontSize: "1.2rem", 
          marginBottom: "2rem", 
          color: "#666",
          lineHeight: "1.6"
        }}>
          Thank you for choosing RelAcksation! We've received your booking request and will contact you shortly to complete payment via Venmo.
        </p>
        
        <div style={{
          padding: "1.5rem",
          background: "#e3f2fd",
          borderRadius: "8px",
          border: "1px solid #2196f3",
          marginBottom: "2rem"
        }}>
          <h3 style={{ color: "#1976d2", marginBottom: "1rem" }}>Next Steps</h3>
          <ul style={{ 
            margin: 0, 
            paddingLeft: "1.5rem", 
            color: "#1976d2",
            textAlign: "left",
            lineHeight: "1.8"
          }}>
            <li>We'll contact you within 24 hours to arrange payment</li>
            <li>Payment will be processed via Venmo</li>
            <li>You'll receive a confirmation email once payment is complete</li>
            <li>We'll coordinate delivery and setup for your rental dates</li>
          </ul>
        </div>
        
        <div style={{
          padding: "1.5rem",
          background: "#f8f9fa",
          borderRadius: "8px",
          border: "1px solid #dee2e6",
          marginBottom: "2rem"
        }}>
          <h3 style={{ color: "#2c3e50", marginBottom: "1rem" }}>Contact Us</h3>
          <p style={{ color: "#666", marginBottom: "1rem" }}>
            Have questions? Reach out to us directly:
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
              📞 Call Owner
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
              💬 Text Owner
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
              📧 Email Owner
            </a>
          </div>
        </div>
        
        <div style={{ marginTop: "2rem" }}>
          <a
            href="/"
            style={{
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              backgroundColor: "#007bff",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "6px",
              display: "inline-block"
            }}
          >
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
}