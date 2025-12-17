"use client";

export default function InteractiveButtons() {
  return (
    <>
      <style jsx>{`
        .book-now-button:hover {
          transform: translateY(-2px);
        }
        .learn-more-button:hover {
          background-color: #fff;
          color: #667eea;
        }
      `}</style>
      <div style={{
        display: "flex",
        gap: "1rem",
        justifyContent: "center",
        flexWrap: "wrap"
      }}>
        <a
          href="/booking"
          className="book-now-button"
          style={{
            padding: "1rem 2rem",
            fontSize: "1.2rem",
            backgroundColor: "#fff",
            color: "#667eea",
            textDecoration: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            transition: "transform 0.2s ease",
            display: "inline-block"
          }}
        >
          Book Now
        </a>
        
        <a
          href="/about"
          className="learn-more-button"
          style={{
            padding: "1rem 2rem",
            fontSize: "1.2rem",
            backgroundColor: "transparent",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            border: "2px solid #fff",
            transition: "all 0.2s ease",
            display: "inline-block"
          }}
        >
          Learn More
        </a>
      </div>
    </>
  );
}
