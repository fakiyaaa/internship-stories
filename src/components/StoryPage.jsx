function StoryPage({ story, setPage }) {

  if (!story) return null

  return (
    <div className="story-page">

      <button onClick={() => setPage("home")}>
        ← Back
      </button>

      <h1>{story.headline}</h1>

      <p>
        <strong>{story.company}</strong> • {story.role}
      </p>

      <p>{story.summary}</p>

    </div>
  )
}

export default StoryPage