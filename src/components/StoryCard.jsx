import "../styles/storycard.css"

function StoryCard({ story, onClick, onLike, onSave, saved, profile, onViewProfile }) {
  return (
    <div className="story-card" onClick={onClick}>
      {story.photo_url && (
        <img src={story.photo_url} alt={story.company} className="story-card-photo" />
      )}
      <h3>{story.headline}</h3>

      <p>{story.summary}</p>

      <p className="company-row">
        <strong>{story.company}</strong>
        <span> • {story.role}</span>
      </p>

      {profile && (
        <button
          className="story-author"
          onClick={e => { e.stopPropagation(); onViewProfile(story.user_id) }}
        >
          {profile.avatar_url
            ? <img src={profile.avatar_url} alt={profile.name} />
            : <span className="author-initial">{(profile.name || "?")[0].toUpperCase()}</span>
          }
          {profile.name || "Anonymous"}
        </button>
      )}

      <div className="story-actions">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onLike(story.id)
          }}
        >
          ❤️ {story.likes}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onSave(story.id)
          }}
        >
          {saved ? "🔖 Saved" : "🔖 Save"}
        </button>
      </div>
    </div>
  )
}
export default StoryCard