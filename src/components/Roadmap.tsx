export default function Roadmap() {
  return (
    <section id="roadmap" className="roadmap">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Development Roadmap</h2>
          <p className="section-description">
            Track our progress building the most comprehensive Instagram analytics platform
          </p>
        </div>
        <div className="timeline">
          <div className="timeline-item completed">
            <div className="timeline-marker"></div>
            <div className="timeline-content">
              <h3 className="timeline-title">Detailed Instagram Scraping</h3>
              <p className="timeline-description">Advanced data collection system for comprehensive post analysis, engagement metrics, and audience insights</p>
              <div className="timeline-status">Completed</div>
            </div>
          </div>
          <div className="timeline-item completed">
            <div className="timeline-marker"></div>
            <div className="timeline-content">
              <h3 className="timeline-title">Competitor Identification Algorithm</h3>
              <p className="timeline-description">AI-powered system to identify and analyze competitor accounts based on content similarity and audience overlap</p>
              <div className="timeline-status">Completed</div>
            </div>
          </div>
          <div className="timeline-item completed">
            <div className="timeline-marker"></div>
            <div className="timeline-content">
              <h3 className="timeline-title">Video Analysis Functionality</h3>
              <p className="timeline-description">Computer vision and audio analysis for Reels and IGTV content performance optimization</p>
              <div className="timeline-status">Completed</div>
            </div>
          </div>
          <div className="timeline-item completed">
            <div className="timeline-marker"></div>
            <div className="timeline-content">
              <h3 className="timeline-title">Search Engine Optimization for Instagram Posts</h3>
              <p className="timeline-description">Hashtag optimization, caption analysis, and discoverability enhancement tools</p>
              <div className="timeline-status">Completed</div>
            </div>
          </div>
          <div className="timeline-item completed">
            <div className="timeline-marker"></div>
            <div className="timeline-content">
              <h3 className="timeline-title">Trained Chat Bot on User Context</h3>
              <p className="timeline-description">Personalized AI assistant trained on your account data to provide contextual recommendations</p>
              <div className="timeline-status">Completed</div>
            </div>
          </div>
          <div className="timeline-item pending">
            <div className="timeline-marker"></div>
            <div className="timeline-content">
              <h3 className="timeline-title">Campaign Creation</h3>
              <p className="timeline-description">Automated campaign planning and content scheduling based on AI insights and performance predictions</p>
              <div className="timeline-status">In Development</div>
            </div>
          </div>
          <div className="timeline-item pending">
            <div className="timeline-marker"></div>
            <div className="timeline-content">
              <h3 className="timeline-title">Bringing It All Together</h3>
              <p className="timeline-description">Unified dashboard integrating all features with advanced reporting and strategic recommendations</p>
              <div className="timeline-status">Coming Soon</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}