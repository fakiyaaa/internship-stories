import { useState } from "react"
import Header from "./components/Header"
import HomePage from "./components/HomePage"
import StoryPage from "./components/StoryPage"

function App() {
  const [page, setPage] = useState("home")
  const [selectedStory, setSelectedStory] = useState(null)


  const stories = [
  {
    id: 1,
    company: "Netflix",
    role: "Software Engineer Intern",
    headline: "FAANG internship journey",
    summary: "My experience working at Netflix."
  },
  {
    id: 2,
    company: "Google",
    role: "Software Engineering Intern",
    headline: "Building ML pipelines",
    summary: "I worked on search ranking systems."
  },
  {
    id: 3,
    company: "NASA",
    role: "Aerospace Intern",
    headline: "Working on spacecraft simulations",
    summary: "Thermal modeling for space missions."
  }
]

  return (
    <div>
      <h1>Intern Stories</h1>

      <Header setPage = {setPage}/>

      {page === "home" && (
        <HomePage 
          stories={stories} 
          setSelectedStory = {setSelectedStory}
          setPage = {setPage}
        />
      )}

      {page === "new" && <p>New Story Page</p>}
      {page === "story" && (
        <StoryPage story={selectedStory} setPage={setPage} />
      )}
    </div>
  )
}

export default App