import Header from '../../components/Header'
import Footer from '../../components/Footer'
import BlogGrid from '../../components/BlogGrid'
import { getAllPosts } from '../../lib/posts'

export const metadata = {
  title: 'SocialSage Blog - Instagram Marketing & Analytics Insights',
  description: 'Expert insights on Instagram marketing, analytics, and optimization strategies. Learn how to grow your Instagram presence with data-driven content marketing tips.',
  openGraph: {
    title: 'SocialSage Blog - Instagram Marketing & Analytics Insights',
    description: 'Expert insights on Instagram marketing, analytics, and optimization strategies. Learn how to grow your Instagram presence with data-driven content marketing tips.',
    url: 'https://sagesocial.club/blog/',
    siteName: 'SocialSage',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SocialSage Blog - Instagram Marketing & Analytics Insights',
    description: 'Expert insights on Instagram marketing, analytics, and optimization strategies. Learn how to grow your Instagram presence with data-driven content marketing tips.',
  },
}

export default async function BlogPage() {
  const posts = getAllPosts()

  return (
    <>
      <Header />
      
      {/* Blog Header */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title hero-title-compact">
              SocialSage <span className="gradient-text">Blog</span>
            </h1>
            <p className="hero-description">
              Expert insights on Instagram marketing, analytics, and optimization strategies to grow your presence
            </p>
          </div>
        </div>
      </section>

      <BlogGrid posts={posts} />
      <Footer />
    </>
  )
}