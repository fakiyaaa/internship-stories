import "../styles/storypage.css"
function StoryPage({ story, setPage }) {

  if (!story) return null

  return (
    <div className="story-page">

      <button className="back-btn" onClick={() => setPage("home")}>
        ← Back to stories
      </button>

      <article className="story-content">

        <h1 className="story-title">
          {story.headline}
        </h1>

        <p className="story-meta">
          <strong>{story.company}</strong>
          <span> • {story.role}</span>
        </p>

        <p className="story-body">
          {story.article}
        </p>

      </article>

    </div>
  )
}

export default StoryPage