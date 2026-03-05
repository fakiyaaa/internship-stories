import StoryCard from "./StoryCard"
import "../styles/homepage.css"
function HomePage({ stories, setSelectedStory, setPage, onLike, onSave }) {
  return (
    <div className="home-page">
      <div className="story-grid">
        {stories.map((story) => (
          <StoryCard
            key={story.id}
            story={story}
            onLike={onLike}
            onSave={onSave}
            onClick={() => {
              setSelectedStory(story)
              setPage("story")
            }}
          />
        ))}
      </div>
    </div>
  )
}
export default HomePage