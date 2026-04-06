import { useState, useEffect } from "react"

import Header from "./components/Header"
import HomePage from "./components/HomePage"
import StoryPage from "./components/StoryPage"
import NewStoryPage from "./components/NewStoryPage"
import AdminPage from "./components/AdminPage"

import { supabase } from "./lib/supabase"

function App() {

  const [page, setPage] = useState("home")
  const [selectedStory, setSelectedStory] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  const [stories, setStories] = useState([])
  const [pendingStories, setPendingStories] = useState([])

  /* ===============================
     LOAD STORIES FROM SUPABASE
  =============================== */

  useEffect(() => {

    async function loadStories() {

      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error(error)
        return
      }

      setStories(data)

    }

    loadStories()

  }, [])


  /* ===============================
     LOAD PENDING SUBMISSIONS
  =============================== */

  useEffect(() => {

    async function loadSubmissions() {

      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error(error)
        return
      }

      setPendingStories(data)

    }

    loadSubmissions()

  }, [])


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

  async function submitStory(newStory) {

    const submission = {
      company: newStory.company,
      role: newStory.role,
      location: newStory.location,
      season: newStory.season,
      applicationprocess: newStory.applicationProcess,
      interviewprocess: newStory.interviewProcess,
      preparation: newStory.preparation,
      team: newStory.team,
      project: newStory.project,
      techstack: newStory.techStack,
      challenge: newStory.challenge,
      advice: newStory.advice,
      status: "pending"
    }

    const { data, error } = await supabase
      .from("submissions")
      .insert([submission])
      .select()

    if (error) {
      console.error(error)
      throw error
    }

    if (data) {
      setPendingStories(prev => [data[0], ...prev])
    }

  }

  /* ===============================
     ADMIN APPROVE STORY
  =============================== */

  async function approveStory(id) {

    const story = pendingStories.find(s => s.id === id)
    if (!story) return

    const article = story.generatedArticle || ""

    const publishedStory = {
      company: story.company,
      role: story.role,
      headline: `My ${story.company} Internship as a ${story.role}`,
      summary: article ? article.slice(0, 120) + "..." : `${story.role} internship at ${story.company} — ${story.location}`,
      article: article,
      likes: 0,
      saved: false
    }

    const { data: insertData, error: insertError } = await supabase
      .from("stories")
      .insert([publishedStory])
      .select()

    if (insertError) {
      console.error("Insert error:", insertError)
      return
    }

    const { error: deleteError } = await supabase
      .from("submissions")
      .delete()
      .eq("id", id)

    if (deleteError) {
      console.error("Delete error:", deleteError)
    }

    setPendingStories(prev => prev.filter(s => s.id !== id))
    if (insertData) {
      setStories(prev => [insertData[0], ...prev])
    }

  }

  async function rejectStory(id) {

    await supabase
      .from("submissions")
      .delete()
      .eq("id", id)

    setPendingStories(
      pendingStories.filter(s => s.id !== id)
    )

  }


  /* ===============================
     AI ARTICLE GENERATION
  =============================== */

  async function generateArticle(story) {

    setPendingStories(prev =>
      prev.map(s => s.id === story.id ? { ...s, generating: true } : s)
    )

    try {

      const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: story.company,
          role: story.role,
          location: story.location,
          season: story.season,
          applicationProcess: story.applicationprocess,
          interviewProcess: story.interviewprocess,
          preparation: story.preparation,
          team: story.team,
          project: story.project,
          techStack: story.techstack,
          challenge: story.challenge,
          advice: story.advice,
        })
      })

      const data = await response.json()

      if (!response.ok || !data.article) {
        throw new Error(data.error || "No article returned")
      }

      setPendingStories(prev =>
        prev.map(s =>
          s.id === story.id
            ? { ...s, generatedArticle: data.article, generating: false }
            : s
        )
      )

    } catch (err) {
      console.error("Error generating article:", err)
      setPendingStories(prev =>
        prev.map(s => s.id === story.id ? { ...s, generating: false, generateError: err.message } : s)
      )
    }

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


  /* ===============================
     SEARCH FILTER
  =============================== */

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