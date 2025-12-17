import './globals.css'

export const metadata = {
  title: 'RelAcksation - Premium Sauna & Cold Plunge Rentals on Nantucket',
  description: 'Experience the ultimate portable sauna and cold plunge rentals on Nantucket. Premium wellness equipment delivered to your doorstep.',
  keywords: 'relacksation, sauna, cold plunge, fire pit, rental, nantucket, wellness, portable',
  authors: [{ name: 'RelAcks Wellness Inc.' }],
  openGraph: {
    title: 'RelAcksation - Premium Sauna & Cold Plunge Rentals',
    description: 'Experience the ultimate portable sauna and cold plunge rentals on Nantucket.',
    url: 'https://relacksation.com',
    siteName: 'RelAcksation',
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2c3e50" />
      </head>
      <body>
        <header style={{
          background: "rgba(44, 62, 80, 0.95)",
          backdropFilter: "blur(10px)",
          padding: "1rem 0",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
        }}>
          <nav style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 2rem"
          }}>
            <div style={{
              fontSize: "1.8rem",
              fontWeight: "bold",
              color: "#fff"
            }}>
              RelAcksation
            </div>
            
            <div style={{
              display: "flex",
              gap: "2rem",
              alignItems: "center"
            }}>
              <a href="/" style={{
                color: "#fff",
                textDecoration: "none",
                fontSize: "1rem",
                transition: "color 0.3s ease"
              }}>
                Home
              </a>
              <a href="/about" style={{
                color: "#fff",
                textDecoration: "none",
                fontSize: "1rem",
                transition: "color 0.3s ease"
              }}>
                About
              </a>
              <a href="/booking" style={{
                color: "#fff",
                textDecoration: "none",
                fontSize: "1rem",
                transition: "color 0.3s ease"
              }}>
                Book Now
              </a>
              <a href="/contact" style={{
                color: "#fff",
                textDecoration: "none",
                fontSize: "1rem",
                transition: "color 0.3s ease"
              }}>
                Contact
              </a>
              <a href="/custom-built-saunas" style={{
                color: "#fff",
                textDecoration: "none",
                fontSize: "1rem",
                transition: "color 0.3s ease"
              }}>
                Custom Built Saunas
              </a>
            </div>
          </nav>
        </header>

        <main>
          {children}
        </main>

        {/* Owner/Admin Panel Link - Bottom Left */}
        <a 
          href="/owner"
          className="fixed bottom-4 left-4 z-50 rounded-full bg-black/80 text-white px-3 py-2 text-sm shadow hover:bg-black transition"
        >
          Owner
        </a>

        <footer style={{
          background: "#2c3e50",
          color: "#fff",
          padding: "3rem 0 1rem",
          marginTop: "auto"
        }}>
          <div style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 2rem",
            textAlign: "center"
          }}>
            <div style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "1rem"
            }}>
              RelAcksation
            </div>
            <p style={{
              fontSize: "1rem",
              opacity: 0.8,
              marginBottom: "2rem"
            }}>
              Premium sauna and cold plunge rentals on Nantucket
            </p>
            
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "2rem",
              marginBottom: "2rem"
            }}>
              <a href="/about" style={{
                color: "#fff",
                textDecoration: "none",
                opacity: 0.8,
                transition: "opacity 0.3s ease"
              }}>
                About Us
              </a>
              <a href="/booking" style={{
                color: "#fff",
                textDecoration: "none",
                opacity: 0.8,
                transition: "opacity 0.3s ease"
              }}>
                Book Now
              </a>
              <a href="/contact" style={{
                color: "#fff",
                textDecoration: "none",
                opacity: 0.8,
                transition: "opacity 0.3s ease"
              }}>
                Contact
              </a>
            </div>
            
            <div style={{
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              paddingTop: "1rem",
              fontSize: "0.9rem",
              opacity: 0.6
            }}>
              © 2024 RelAcks Wellness Inc. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
