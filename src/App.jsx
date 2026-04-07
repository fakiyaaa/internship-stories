import { useState, useEffect } from "react"

import Header from "./components/Header"
import HomePage from "./components/HomePage"
import StoryPage from "./components/StoryPage"
import NewStoryPage from "./components/NewStoryPage"
import AdminPage from "./components/AdminPage"
import AuthPage from "./components/AuthPage"
import SavedPage from "./components/SavedPage"
import ProfilePage from "./components/ProfilePage"

import { supabase } from "./lib/supabase"

function App() {

  const [page, setPage] = useState("home")
  const [selectedStory, setSelectedStory] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [user, setUser] = useState(null)

  const [stories, setStories] = useState([])
  const [pendingStories, setPendingStories] = useState([])
  const [savedIds, setSavedIds] = useState(new Set())
  const [profiles, setProfiles] = useState({})
  const [selectedProfile, setSelectedProfile] = useState(null)

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
        console.error("loadStories error:", error.message, error.code, error.details)
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
        console.error("loadSubmissions error:", error.message, error.code, error.details)
        return
      }

      setPendingStories(data)

    }

    loadSubmissions()

  }, [])


  /* ===============================
     AUTH
  =============================== */

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const u = session?.user ?? null
      setUser(u)

      if (event === "SIGNED_IN" && u) {
        await supabase.from("profiles").upsert({ id: u.id }, { onConflict: "id", ignoreDuplicates: true })
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signOut() {
    try {
      await supabase.auth.signOut({ scope: "local" })
    } catch (e) {
      // ignore
    }
    setUser(null)
    setSavedIds(new Set())
    setPage("home")
  }


  /* ===============================
     LOAD PROFILES
  =============================== */

  useEffect(() => {
    const userIds = [...new Set(stories.map(s => s.user_id).filter(Boolean))]
    if (userIds.length === 0) return

    async function loadProfiles() {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .in("id", userIds)

      if (error) { console.error(error); return }

      const map = {}
      data.forEach(p => { map[p.id] = p })
      setProfiles(map)
    }

    loadProfiles()
  }, [stories])


  /* ===============================
     LOAD USER SAVES
  =============================== */

  useEffect(() => {
    if (!user) return

    async function loadSaves() {
      const { data, error } = await supabase
        .from("user_saves")
        .select("story_id")
        .eq("user_id", user.id)

      if (error) { console.error(error); return }

      setSavedIds(new Set(data.map(r => r.story_id)))
    }

    loadSaves()
  }, [user])


  /* ===============================
     STORY INTERACTIONS
  =============================== */

  async function handleLike(id) {
    if (!user) { setPage("auth"); return }

    const story = stories.find(s => s.id === id)
    const newLikes = (story.likes || 0) + 1

    setStories(stories.map(s => s.id === id ? { ...s, likes: newLikes } : s))

    await supabase
      .from("stories")
      .update({ likes: newLikes })
      .eq("id", id)
  }

  async function handleSave(id) {
    if (!user) { setPage("auth"); return }

    const alreadySaved = savedIds.has(id)

    if (alreadySaved) {
      setSavedIds(prev => { const next = new Set(prev); next.delete(id); return next })
      await supabase.from("user_saves").delete().eq("user_id", user.id).eq("story_id", id)
    } else {
      setSavedIds(prev => new Set(prev).add(id))
      await supabase.from("user_saves").insert({ user_id: user.id, story_id: id })
    }
  }


  /* ===============================
     STORY SUBMISSION
  =============================== */

  async function submitStory(newStory, photoFile) {
    if (!user) { setPage("auth"); return }

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
      status: "pending",
      user_id: user.id
    }

    if (photoFile) {
      const ext = photoFile.name.split(".").pop()
      const path = `${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from("story-photos")
        .upload(path, photoFile)

      if (uploadError) {
        console.error("Photo upload error:", uploadError)
      } else {
        const { data: urlData } = supabase.storage.from("story-photos").getPublicUrl(path)
        submission.photo_url = urlData.publicUrl
      }
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
      photo_url: story.photo_url || null,
      user_id: story.user_id || null,
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
     EDIT PUBLISHED ARTICLE
  =============================== */

  async function editPublishedArticle(id, newText) {

    const { error } = await supabase
      .from("stories")
      .update({ article: newText })
      .eq("id", id)

    if (error) {
      console.error("Error updating article:", error)
      return
    }

    setStories(prev =>
      prev.map(s => s.id === id ? { ...s, article: newText } : s)
    )

  }


  /* ===============================
     VIEW PROFILE
  =============================== */

  function viewProfile(userId) {
    setSelectedProfile(profiles[userId] || { id: userId })
    setPage("profile")
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

      <Header setPage={setPage} user={user} onSignOut={signOut} onViewProfile={() => user && viewProfile(user.id)} />

      {page === "home" && (

        <HomePage
          stories={filteredStories}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setSelectedStory={setSelectedStory}
          setPage={setPage}
          onLike={handleLike}
          onSave={handleSave}
          savedIds={savedIds}
          profiles={profiles}
          onViewProfile={viewProfile}
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
          profile={selectedStory?.user_id ? profiles[selectedStory.user_id] : null}
          onViewProfile={viewProfile}
        />

      )}

      {page === "saved" && (
        <SavedPage
          stories={stories}
          savedIds={savedIds}
          onLike={handleLike}
          onSave={handleSave}
          setSelectedStory={setSelectedStory}
          setPage={setPage}
          user={user}
          profiles={profiles}
          onViewProfile={viewProfile}
        />
      )}

      {page === "profile" && selectedProfile && (
        <ProfilePage
          profile={selectedProfile}
          stories={stories}
          savedIds={savedIds}
          onLike={handleLike}
          onSave={handleSave}
          setSelectedStory={setSelectedStory}
          setPage={setPage}
          isOwnProfile={user?.id === selectedProfile.id}
        />
      )}

      {page === "auth" && (
        <AuthPage setPage={setPage} />
      )}

      {page === "admin" && (

        <AdminPage
          pendingStories={pendingStories}
          approveStory={approveStory}
          rejectStory={rejectStory}
          generateArticle={generateArticle}
          updateGeneratedArticle={updateGeneratedArticle}
          publishedStories={stories}
          editPublishedArticle={editPublishedArticle}
        />

      )}

    </div>

  )

}

export default App