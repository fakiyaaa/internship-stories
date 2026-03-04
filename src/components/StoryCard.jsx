function StoryCard({ story, onClick, onLike, onSave }) {
  return (
    <div className="story-card" onClick={onClick}>
      <h3>{story.headline}</h3>

      <p>{story.summary}</p>

      <p className="company-row">
        <strong>{story.company}</strong>
        <span> • {story.role}</span>
      </p>

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
          {story.saved ? "🔖 Saved" : "🔖 Save"}
        </button>
      </div>
    </div>
  )
}
export default StoryCard