import InteractiveButtons from '../components/InteractiveButtons';

export default function Home() {
  return (
    <div style={{
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "2rem",
        textAlign: "center",
        color: "#fff"
      }}>
        <h1 style={{ 
          fontSize: "4rem", 
          marginBottom: "1rem",
          fontWeight: "bold",
          textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
        }}>
          Welcome to RelAcksation
        </h1>
        
        <p style={{ 
          fontSize: "1.5rem", 
          marginBottom: "2rem",
          textShadow: "1px 1px 2px rgba(0,0,0,0.3)"
        }}>
          Premium Sauna & Cold Plunge Rentals on Nantucket
        </p>
        
        <p style={{ 
          fontSize: "1.2rem", 
          marginBottom: "3rem",
          maxWidth: "800px",
          margin: "0 auto 3rem",
          lineHeight: "1.6",
          textShadow: "1px 1px 2px rgba(0,0,0,0.3)"
        }}>
          Experience the ultimate relaxation with our portable saunas and cold plunge tubs. 
          Perfect for rejuvenation and wellness in the comfort of your own space.
        </p>
        
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
          marginBottom: "3rem"
        }}>
          <div style={{
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: "12px",
            padding: "2rem",
            border: "1px solid rgba(255,255,255,0.2)"
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔥</div>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Sauna</h3>
            <p style={{ opacity: 0.9 }}>
              Professional-grade portable infrared sauna for deep relaxation and detoxification.
            </p>
          </div>
          
          <div style={{
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: "12px",
            padding: "2rem",
            border: "1px solid rgba(255,255,255,0.2)"
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>❄️</div>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Cold Plunge</h3>
            <p style={{ opacity: 0.9 }}>
              Invigorating cold therapy tub for muscle recovery and improved circulation.
            </p>
          </div>
        </div>
        
        <InteractiveButtons />
        
        <div style={{
          marginTop: "4rem",
          padding: "2rem",
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.2)"
        }}>
          <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Ready to Relax?</h3>
          <p style={{ opacity: 0.9, marginBottom: "1.5rem" }}>
            Contact us to arrange payment via Venmo and complete your booking
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
        </div>
      </div>
    </div>
  );
}