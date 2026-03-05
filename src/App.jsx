import { useState, useEffect } from "react"

import Header from "./components/Header"
import HomePage from "./components/HomePage"
import StoryPage from "./components/StoryPage"
import NewStoryPage from "./components/NewStoryPage"

function App() {
  const [page, setPage] = useState("home")
  const [selectedStory, setSelectedStory] = useState(null)  
  const [pendingStories, setPendingStories] = useState([])
  const [stories, setStories] = useState(() => {

    const savedStories = localStorage.getItem("stories")
    return savedStories 
    ? JSON.parse(savedStories) 
    : [
          {
        id: 1,
        company: "Netflix",
        role: "Software Engineer Intern",
        headline: "FAANG internship journey",
        summary: "My experience working at Netflix.",
        likes: 1,
        saved: false 
      },
      {
        id: 2,
        company: "Google",
        role: "Software Engineering Intern",
        headline: "Building ML pipelines",
        summary: "I worked on search ranking systems.",
        likes: 4,
        saved: false 
      },
      {
        id: 3,
        company: "NASA",
        role: "Aerospace Intern",
        headline: "Working on spacecraft simulations",
        summary: "Thermal modeling for space missions.",
        likes: 10,
        saved: false 
      }
      ]
    })
    useEffect(() => {
      localStorage.setItem("stories", JSON.stringify(stories))
    }, [stories])

    function handleLike(id) {
    setStories(
      stories.map((story) =>
        story.id === id
          ? { ...story, likes: story.likes + 1 }
          : story
      )
    )
  }

    function handleSave(id) {
    setStories(
      stories.map((story) =>
        story.id === id
          ? { ...story, saved: !story.saved }
          : story
      )
    )
  }
    function submitStory(newStory) {
      setPendingStories([...pendingStories, newStory])
    }

  return (
    <div>
      <h1>Intern Stories</h1>

      <Header setPage = {setPage}/>

      {page === "home" && (
        <HomePage 
          stories={stories} 
          setSelectedStory = {setSelectedStory}
          setPage = {setPage}
          onLike={handleLike}
          onSave={handleSave}
        />
      )}

      {page === "new" && (
        <NewStoryPage
          submitStory={submitStory}
          setPage={setPage}
        />
      )}
      {page === "story" && (
        <StoryPage story={selectedStory} setPage={setPage} />
      )}
    </div>
  )
}

export default App