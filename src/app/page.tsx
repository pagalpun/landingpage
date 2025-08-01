import Header from '../components/Header'
import Hero from '../components/Hero'
import WaitlistForm from '../components/WaitlistForm'
import Roadmap from '../components/Roadmap'
import Footer from '../components/Footer'

export const metadata = {
  title: 'SocialSage - Instagram Analytics & Optimization for Content Creators',
  description: 'Join the waitlist for SocialSage - Advanced Instagram analytics and optimization tools for content creators and marketing agencies. Get free extra tokens as an early user!',
  openGraph: {
    title: 'SocialSage - Instagram Analytics & Optimization for Content Creators',
    description: 'Join the waitlist for SocialSage - Advanced Instagram analytics and optimization tools for content creators and marketing agencies. Get free extra tokens as an early user!',
    url: 'https://sagesocial.club',
    siteName: 'SocialSage',
    images: [
      {
        url: 'https://sagesocial.club/Screenshot_2025-08-01_at_1.58.13_AM-removebg-preview.png',
        width: 800,
        height: 600,
        alt: 'SocialSage Dashboard Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SocialSage - Instagram Analytics & Optimization for Content Creators',
    description: 'Join the waitlist for SocialSage - Advanced Instagram analytics and optimization tools for content creators and marketing agencies. Get free extra tokens as an early user!',
    images: ['https://sagesocial.club/Screenshot_2025-08-01_at_1.58.13_AM-removebg-preview.png'],
  },
}

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <WaitlistForm />
      <Roadmap />
      <Footer />
    </>
  )
}