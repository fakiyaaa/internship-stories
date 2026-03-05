import { useState } from "react"
import "../styles/newstory.css"

function NewStoryPage({ submitStory, setPage }) {

  const [company, setCompany] = useState("")
  const [role, setRole] = useState("")
  const [headline, setHeadline] = useState("")
  const [summary, setSummary] = useState("")

  function handleSubmit(e) {
    e.preventDefault()

    const newStory = {
      id: Date.now(),
      company,
      role,
      headline,
      summary,
      likes: 0,
      saved: false,
      status: "pending"
    }

    submitStory(newStory)

    setPage("home")
  }

  return (
    <div className="new-story-page">

      <h2>Submit your internship story</h2>

      <form onSubmit={handleSubmit}>

        <input
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />

        <input
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />

        <input
          placeholder="Headline"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
        />

        <textarea
          placeholder="Tell your story..."
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />

        <button type="submit">
          Submit Story
        </button>

      </form>

    </div>
  )
}

export default NewStoryPage