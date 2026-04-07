import "../styles/storypage.css"
function StoryPage({ story, setPage, profile, onViewProfile }) {

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

        {profile && (() => {
          const name = [profile.first_name, profile.last_name].filter(Boolean).join(" ") || "Anonymous"
          return (
            <button className="story-page-author" onClick={() => onViewProfile(story.user_id)}>
              {profile.avatar_url
                ? <img src={profile.avatar_url} alt={name} />
                : <span className="author-initial">{name[0].toUpperCase()}</span>
              }
              <span>{name}</span>
            </button>
          )
        })()}

        {story.photo_url && (
          <img src={story.photo_url} alt={story.company} className="story-photo" />
        )}

        <div className="story-body">
          {story.article?.split("\n\n").filter(p => p.trim()).map((para, i) => (
            <p key={i}>{para.trim()}</p>
          ))}
        </div>

      </article>

    </div>
  )
}

export default StoryPage