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

    async function loadPending() {

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

    loadPending()

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
      status: newStory.status
    }

    const { data, error } = await supabase
      .from("submissions")
      .insert([submission])
    console.log(data, error)

    if (error) {
      console.error(error)
      return
    }

    setPage("home")

  }

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

  /* INSERT INTO STORIES TABLE */

  const { error: insertError } = await supabase
    .from("stories")
    .insert([publishedStory])

  if (insertError) {
    console.error("Insert error:", insertError)
    return
  }

  /* DELETE FROM SUBMISSIONS TABLE */

  const { error: deleteError } = await supabase
    .from("submissions")
    .delete()
    .eq("id", id)

  if (deleteError) {
    console.error("Delete error:", deleteError)
  }

  /* UPDATE FRONTEND STATE */

  setPendingStories(pendingStories.filter(s => s.id !== id))
  setStories([publishedStory, ...stories])
}
  /* ===============================
     REJECT STORY
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

  function generateArticle(story) {

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