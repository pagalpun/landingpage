'use client'

import { useEffect, useState } from 'react'
import Head from 'next/head'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function ThankYouPage() {
  const [position, setPosition] = useState(37)

  useEffect(() => {
    // Get position from localStorage or calculate dynamic position
    const getWaitlistPosition = () => {
      const storedPosition = localStorage.getItem('waitlist-position')
      if (storedPosition) {
        return parseInt(storedPosition, 10)
      } else {
        // Calculate position: start at 37, add 2 for each registration
        // Use a timestamp-based calculation for demo purposes
        const basePosition = 37
        const registrationCount = Math.floor((Date.now() - new Date('2025-08-01').getTime()) / (1000 * 60 * 60 * 24)) * 2
        const calculatedPosition = basePosition + registrationCount
        localStorage.setItem('waitlist-position', calculatedPosition.toString())
        return calculatedPosition
      }
    }

    const newPosition = getWaitlistPosition()
    setPosition(newPosition)

    // Track page view
    if (typeof window !== 'undefined' && (window as any).track) {
      (window as any).track('thank_you_page_view', { position: newPosition })
    }
  }, [])

  return (
    <>
      <Head>
        <title>Thank You - SocialSage Waitlist</title>
        <meta name="description" content="Thank you for joining the SocialSage waitlist! Your position has been confirmed." />
      </Head>
      <Header />
      
      {/* Thank You Section */}
      <section className="thank-you-hero">
        <div className="container">
          <div className="thank-you-content">
            <div className="success-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <h1 className="thank-you-title">Thank You!</h1>
            <p className="thank-you-message">
              You have been waitlisted and your position is <span className="position-highlight">{position}</span>
            </p>
            <div className="thank-you-details">
              <div className="detail-card">
                <h3>What happens next?</h3>
                <ul>
                  <li>We'll send you updates as we get closer to launch</li>
                  <li>Early access will be granted based on waitlist position</li>
                  <li>You'll get extra credits on your free plan</li>
                  <li>Access to our exclusive Instagram optimization guide</li>
                </ul>
              </div>
              <div className="detail-card">
                <h3>Follow our progress</h3>
                <p>Check out our <a href="/#roadmap">development roadmap</a> to see what we're building.</p>
                <p>Questions? Email us at <a href="mailto:SageSocialhelp@gmail.com">SageSocialhelp@gmail.com</a></p>
              </div>
            </div>
            <div className="thank-you-actions">
              <a href="/" className="btn btn-primary">Back to Home</a>
              <a href="/#roadmap" className="btn btn-secondary">View Roadmap</a>
              <a href="/blog" className="btn btn-secondary">Read Our Blog</a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}