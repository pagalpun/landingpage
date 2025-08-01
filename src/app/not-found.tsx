import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function NotFound() {
  return (
    <>
      <Header />
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title hero-title-compact">
              Page <span className="gradient-text">Not Found</span>
            </h1>
            <p className="hero-description">
              The page you're looking for doesn't exist.
            </p>
            <div style={{ marginTop: '2rem' }}>
              <Link href="/" className="btn btn-primary">
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}