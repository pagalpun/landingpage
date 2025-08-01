'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const shouldShow = scrollPosition > 800 && !isDismissed
      setIsVisible(shouldShow)
    }

    const checkDismissed = () => {
      const dismissed = localStorage.getItem('sticky-cta-dismissed')
      if (dismissed) {
        setIsDismissed(true)
      }
    }

    checkDismissed()
    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isDismissed])

  const handleDismiss = () => {
    setIsDismissed(true)
    setIsVisible(false)
    localStorage.setItem('sticky-cta-dismissed', 'true')
  }

  if (!isVisible || isDismissed) {
    return null
  }

  return (
    <div className="sticky-cta">
      <button 
        className="sticky-cta-close" 
        onClick={handleDismiss}
        aria-label="Close"
      >
        ×
      </button>
      <div className="sticky-cta-header">
        Want help navigating this?
      </div>
      <div className="sticky-cta-text">
        Register for the waitlist and get a comprehensive audit
      </div>
      <Link href="/#waitlist" className="sticky-cta-button">
        Get Free Audit
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14"/>
          <path d="m12 5 7 7-7 7"/>
        </svg>
      </Link>
    </div>
  )
}