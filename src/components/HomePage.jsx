import StoryCard from "./StoryCard"
import "../styles/homepage.css"

function HomePage({
  stories,
  setSelectedStory,
  setPage,
  onLike,
  onSave,
  searchQuery,
  setSearchQuery
}) {

  return (

    <div className="home-page">

      {/* SEARCH BAR */}

      <input
        type="text"
        placeholder="Search companies or roles..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />

      {/* STORY GRID */}

      <div className="story-grid">

        {stories.map((story) => (

          <StoryCard
            key={story.id}
            story={story}
            onClick={() => {
              setSelectedStory(story)
              setPage("story")
            }}
            onLike={onLike}
            onSave={onSave}
          />

        ))}

      </div>

    </div>

  )

}

export default HomePage