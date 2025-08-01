'use client'

import { FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function WaitlistForm() {
  const router = useRouter()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const instagram = formData.get('instagram') as string
    const goals = formData.get('goals') as string

    try {
      // Calculate new waitlist position
      const currentCount = parseInt(localStorage.getItem('waitlist-count') || '0', 10)
      const newCount = currentCount + 1
      const basePosition = 37
      const newPosition = basePosition + (newCount * 2)
      
      // Store the new position and count
      localStorage.setItem('waitlist-position', newPosition.toString())
      localStorage.setItem('waitlist-count', newCount.toString())

      // Here you would normally send data to your backend
      console.log('Form submitted:', { email, instagram, goals, position: newPosition })
      
      // Redirect to thank you page
      router.push('/thank-you')
    } catch (error) {
      console.error('Form submission error:', error)
      // Handle error - maybe show a toast notification
    }
  }

  return (
    <section id="waitlist" className="waitlist">
      <div className="container">
        <div className="waitlist-content">
          <div className="waitlist-form">
            <form id="waitlistForm" className="form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  className="form-input" 
                  placeholder="your@email.com" 
                  required 
                />
                <p className="form-privacy-note">psst- no spam, no leaks, no bullsh*t. Just 2 emails over your entire lifetime.</p>
              </div>
              <div className="form-group">
                <label htmlFor="instagram" className="form-label">Instagram Handle</label>
                <input 
                  type="text" 
                  id="instagram" 
                  name="instagram" 
                  className="form-input" 
                  placeholder="@yourusername" 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="goals" className="form-label">Your Goals & Challenges</label>
                <textarea 
                  id="goals" 
                  name="goals" 
                  className="form-textarea" 
                  placeholder="Tell us about your current Instagram strategy, challenges, and what you hope to achieve with SocialSage. Detailed responses may qualify for free full access!" 
                  rows={4} 
                  required 
                />
              </div>
              <button type="submit" className="btn btn-waitlist">
                <span className="btn-text">Join the Waitlist</span>
                <svg className="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14"/>
                  <path d="m12 5 7 7-7 7"/>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}