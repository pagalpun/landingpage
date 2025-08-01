import { notFound } from 'next/navigation'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import StickyCTA from '../../../components/StickyCTA'
import { getAllPosts, getPostBySlug } from '../../../lib/posts'
import markdownToHtml from '../../../lib/markdownToHtml'

type Params = {
  slug: string
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post?.slug || '',
  })).filter(param => param.slug)
}

export async function generateMetadata({ params }: { params: Params }) {
  const post = getPostBySlug(params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.title} | SocialSage Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://sagesocial.club/blog/${post.slug}/`,
      siteName: 'SocialSage',
      type: 'article',
      publishedTime: post.date,
      authors: [post.author || 'SocialSage Team'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  }
}

export default async function BlogPost({ params }: { params: Params }) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const content = await markdownToHtml(post.content || '')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    url: `https://sagesocial.club/blog/${post.slug}/`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Organization',
      name: post.author || 'SocialSage Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'SocialSage',
      logo: {
        '@type': 'ImageObject',
        url: 'https://sagesocial.club/Screenshot_2025-08-01_at_1.58.13_AM-removebg-preview.png',
      },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Header />
      
      <article className="blog-post">
        <div className="container">
          <div className="blog-post-header">
            <div className="blog-post-meta">
              <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</time>
              {post.category && <span className="blog-post-category">{post.category}</span>}
            </div>
            <h1 className="blog-post-title">{post.title}</h1>
            {post.excerpt && <p className="blog-post-excerpt">{post.excerpt}</p>}
          </div>
          
          <div className="blog-post-content" dangerouslySetInnerHTML={{ __html: content }} />
          
          {post.downloadUrl && (
            <div className="blog-post-download">
              <a href={post.downloadUrl} className="btn btn-primary" download>
                Download Instagram SEO Checklist
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7,10 12,15 17,10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </a>
            </div>
          )}
        </div>
      </article>

      <StickyCTA />
      <Footer />
    </>
  )
}