'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export default function WaitlistForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const instagram = formData.get('instagram') as string
    const goals = formData.get('goals') as string

    try {
      // Clean Instagram handle (remove @ if present)
      const cleanInstagram = instagram.startsWith('@') ? instagram.slice(1) : instagram

      if (isSupabaseConfigured()) {
        // Get additional data for analytics
        const userAgent = navigator.userAgent
        const referrer = document.referrer || ''
        
        // Parse UTM parameters from URL
        const urlParams = new URLSearchParams(window.location.search)
        const utmSource = urlParams.get('utm_source')
        const utmMedium = urlParams.get('utm_medium')
        const utmCampaign = urlParams.get('utm_campaign')

        // Save to Supabase
        const { data, error: supabaseError } = await supabase
          .from('waitlist_signups')
          .insert([
            {
              email,
              instagram_handle: cleanInstagram,
              goals,
              source: 'landing-page',
              user_agent: userAgent,
              referrer,
              utm_source: utmSource,
              utm_medium: utmMedium,
              utm_campaign: utmCampaign,
              status: 'pending',
              priority_score: goals.length > 100 ? 5 : 3 // Higher score for detailed responses
            }
          ])
          .select()

        if (supabaseError) {
          throw supabaseError
        }

        // Calculate waitlist position for display
        const { count } = await supabase
          .from('waitlist_signups')
          .select('*', { count: 'exact', head: true })

        const totalSignups = count || 0
        const basePosition = 37
        const position = basePosition + (totalSignups * 2)
        
        // Store position for thank you page
        localStorage.setItem('waitlist-position', position.toString())

        console.log('Successfully saved to Supabase:', data)
      } else {
        // Fallback for when Supabase is not configured (development/build)
        console.log('Supabase not configured, using fallback:', { email, cleanInstagram, goals })
        
        // Calculate fallback position
        const currentCount = parseInt(localStorage.getItem('waitlist-count') || '0', 10)
        const newCount = currentCount + 1
        const basePosition = 37
        const position = basePosition + (newCount * 2)
        
        localStorage.setItem('waitlist-position', position.toString())
        localStorage.setItem('waitlist-count', newCount.toString())
      }
      
      // Redirect to thank you page
      router.push('/thank-you')
    } catch (error: any) {
      console.error('Form submission error:', error)
      
      // Handle specific Supabase errors
      if (error.code === '23505') {
        if (error.message.includes('email')) {
          setError('This email is already registered on our waitlist.')
        } else if (error.message.includes('instagram_handle')) {
          setError('This Instagram handle is already registered on our waitlist.')
        } else {
          setError('You have already registered for the waitlist.')
        }
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="waitlist" className="waitlist">
      <div className="container">
        <div className="waitlist-content">
          <div className="waitlist-form">
            <form id="waitlistForm" className="form" onSubmit={handleSubmit}>
              {error && (
                <div className="form-error" style={{ 
                  background: '#ff0066', 
                  color: 'white', 
                  padding: '1rem', 
                  borderRadius: '0.5rem', 
                  marginBottom: '1.5rem',
                  textAlign: 'center'
                }}>
                  {error}
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  className="form-input" 
                  placeholder="your@email.com" 
                  required 
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
              </div>
              <button type="submit" className="btn btn-waitlist" disabled={isSubmitting}>
                <span className="btn-text">
                  {isSubmitting ? 'Joining...' : 'Join the Waitlist'}
                </span>
                {!isSubmitting && (
                  <svg className="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14"/>
                    <path d="m12 5 7 7-7 7"/>
                  </svg>
                )}
                {isSubmitting && (
                  <svg className="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}