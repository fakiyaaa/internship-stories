import StoryCard from "./StoryCard"
import "../styles/homepage.css"

function SavedPage({ stories, savedIds, onLike, onSave, setSelectedStory, setPage, user }) {

  if (!user) {
    return (
      <div className="home-page">
        <p>Please <button onClick={() => setPage("auth")} style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", textDecoration: "underline", fontSize: "inherit" }}>sign in</button> to see your saved stories.</p>
      </div>
    )
  }

  const savedStories = stories.filter(s => savedIds.has(s.id))

  return (
    <div className="home-page">
      <h2>Saved Stories</h2>

      {savedStories.length === 0 ? (
        <p>You haven't saved any stories yet.</p>
      ) : (
        <div className="story-grid">
          {savedStories.map(story => (
            <StoryCard
              key={story.id}
              story={story}
              onClick={() => { setSelectedStory(story); setPage("story") }}
              onLike={onLike}
              onSave={onSave}
              saved={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default SavedPage
