import { useState, useEffect } from "react"

import Header from "./components/Header"
import HomePage from "./components/HomePage"
import StoryPage from "./components/StoryPage"
import NewStoryPage from "./components/NewStoryPage"
import AdminPage from "./components/AdminPage"

function App() {

  const [page, setPage] = useState("home")
  const [selectedStory, setSelectedStory] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  /* ===============================
     STORIES (PUBLISHED)
  =============================== */

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


  /* ===============================
     PENDING STORIES
  =============================== */

  const [pendingStories, setPendingStories] = useState(() => {

    const saved = localStorage.getItem("pendingStories")

    return saved ? JSON.parse(saved) : []

  })

  useEffect(() => {
    localStorage.setItem("pendingStories", JSON.stringify(pendingStories))
  }, [pendingStories])


  /* ===============================
     STORY INTERACTIONS
  =============================== */

  function handleLike(id) {

    setStories(
      stories.map(story =>
        story.id === id
          ? { ...story, likes: story.likes + 1 }
          : story
      )
    )

  }

  function handleSave(id) {

    setStories(
      stories.map(story =>
        story.id === id
          ? { ...story, saved: !story.saved }
          : story
      )
    )

  }


  /* ===============================
     STORY SUBMISSION
  =============================== */

  function submitStory(newStory) {

    const submission = {
      ...newStory,
      id: Date.now()
    }

    setPendingStories([...pendingStories, submission])

  }


  /* ===============================
     ADMIN MODERATION
  =============================== */

  function approveStory(id) {

    const story = pendingStories.find(s => s.id === id)

    if (!story) return

    const article = story.generatedArticle || ""

    const publishedStory = {
      ...story,

      headline:
        story.headline ||
        `My ${story.role} Internship at ${story.company}`,

      summary:
        article.slice(0, 120) + "...",

      article: article
    }

    setStories([publishedStory, ...stories])

    setPendingStories(
      pendingStories.filter(s => s.id !== id)
    )

  }

  function rejectStory(id) {

    setPendingStories(
      pendingStories.filter(s => s.id !== id)
    )

  }


  /* ===============================
     AI ARTICLE GENERATION
  =============================== */

    async function generateArticle(story) {

      const article = `
    How I Landed a ${story.role} Internship at ${story.company}

    I applied for the ${story.role} role at ${story.company}. The process involved several interview rounds and technical discussions.

    Interview Process
    ${story.interviewProcess || "The interview included behavioral and technical questions."}

    Internship Project
    ${story.project || "During the internship I worked on meaningful projects with my team."}

    Overall, the experience was incredibly valuable and helped me develop both technical and professional skills.
    `

      const updated = pendingStories.map(s =>
        s.id === story.id
          ? { ...s, generatedArticle: article }
          : s
      )

      setPendingStories(updated)

    }

  /* ===============================
     EDIT GENERATED ARTICLE
  =============================== */

  function updateGeneratedArticle(id, text) {

    setPendingStories(
      pendingStories.map(story =>
        story.id === id
          ? { ...story, generatedArticle: text }
          : story
      )
    )

  }

  const filteredStories = stories.filter((story) => {

  const company = story.company?.toLowerCase() || ""
  const role = story.role?.toLowerCase() || ""
  const headline = story.headline?.toLowerCase() || ""

  return (
    company.includes(searchQuery.toLowerCase()) ||
    role.includes(searchQuery.toLowerCase()) ||
    headline.includes(searchQuery.toLowerCase())
  )

})
  /* ===============================
     RENDER
  =============================== */

  return (

    <div>

      <h1>Intern Stories</h1>

      <Header setPage={setPage} />

      {page === "home" && (

        <HomePage
          stories={filteredStories}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setSelectedStory={setSelectedStory}
          setPage={setPage}
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

      {page === "story" && selectedStory && (

        <StoryPage
          story={selectedStory}
          setPage={setPage}
        />

      )}

      {page === "admin" && (

        <AdminPage
          pendingStories={pendingStories}
          approveStory={approveStory}
          rejectStory={rejectStory}
          generateArticle={generateArticle}
          updateGeneratedArticle={updateGeneratedArticle}
        />

      )}

    </div>

  )

}

export default App