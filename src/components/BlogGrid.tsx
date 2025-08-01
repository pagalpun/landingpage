import Link from 'next/link'

interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  category: string
}

interface BlogGridProps {
  posts: (Post | null)[]
}

export default function BlogGrid({ posts }: BlogGridProps) {
  const validPosts = posts.filter((post): post is Post => post !== null)

  return (
    <section className="blog-grid">
      <div className="container">
        <div className="blog-posts">
          {validPosts.map((post) => (
            <article key={post.slug} className="blog-post-card">
              <div className="blog-post-content">
                <div className="blog-post-meta">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </time>
                  <span className="blog-post-category">{post.category}</span>
                </div>
                <h2 className="blog-post-title">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="blog-post-excerpt">{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`} className="blog-read-more">
                  Read More
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14"/>
                    <path d="m12 5 7 7-7 7"/>
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}