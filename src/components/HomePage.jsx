import StoryCard from "./StoryCard"

function HomePage({ stories, setSelectedStory, setPage}) {
  return (
    <div className="home-page">
      <div className="story-grid">
        {stories.map((story) => (
          <StoryCard 
            key={story.id} 
            story={story} 
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