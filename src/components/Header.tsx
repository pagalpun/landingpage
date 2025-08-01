import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="nav-brand">
          <Link href="/">
            <Image 
              src="/Screenshot_2025-08-01_at_1.58.13_AM-removebg-preview.png" 
              alt="SocialSage Dashboard Preview" 
              className="header-screenshot"
              width={40}
              height={40}
            />
            <span className="brand-name">SageSocial</span>
          </Link>
        </div>
        <nav className="nav-menu">
          <Link href="/#roadmap" className="nav-link">Development Roadmap</Link>
          <Link href="/blog" className="nav-link">Blog</Link>
          <Link href="/#waitlist" className="btn btn-primary">Join Waitlist</Link>
        </nav>
      </div>
    </header>
  )
}