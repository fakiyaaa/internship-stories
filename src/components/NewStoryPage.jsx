import { useState } from "react"
import "../styles/newstory.css"

function NewStoryPage({ submitStory, setPage }) {

  const [form, setForm] = useState({
    company: "",
    role: "",
    location: "",
    season: "",
    applicationProcess: "",
    interviewProcess: "",
    preparation: "",
    team: "",
    project: "",
    techStack: "",
    challenge: "",
    advice: ""
  })

  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    try {
      await submitStory(form, null)
      setSubmitted(true)
    } catch (err) {
      console.error("Error submitting story:", err)
    }

    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="new-story-page" style={{ textAlign: "center", padding: "60px 20px" }}>
        <h2>Thank you for sharing your story!</h2>
        <p style={{ marginTop: "12px", color: "#555" }}>
          Your submission has been saved. It will be reviewed and published within 1–2 days.
        </p>
        <button style={{ marginTop: "24px" }} onClick={() => setPage("home")}>
          Back to Home
        </button>
      </div>
    )
  }

  
  return (
    <div className="new-story-page">

      <h2>Submit your internship story</h2>

      <form onSubmit={handleSubmit}>

        <h3>Internship Basics</h3>

        <input
          name="company"
          placeholder="Company *"
          value={form.company}
          onChange={handleChange}
          required
        />

        <input
          name="role"
          placeholder="Role *"
          value={form.role}
          onChange={handleChange}
          required
        />

        <input
          name="location"
          placeholder="Location *"
          value={form.location}
          onChange={handleChange}
          required
        />

        <input
          name="season"
          placeholder="Season (Summer 2025) *"
          value={form.season}
          onChange={handleChange}
          required
        />

        <h3>Getting the Internship</h3>

        <textarea
          name="applicationProcess"
          placeholder="How did you apply? *"
          value={form.applicationProcess}
          onChange={handleChange}
          required
        />

        <textarea
          name="interviewProcess"
          placeholder="Describe the interview stages *"
          value={form.interviewProcess}
          onChange={handleChange}
          required
        />

        <textarea
          name="preparation"
          placeholder="What preparation helped the most? *"
          value={form.preparation}
          onChange={handleChange}
          required
        />

        <h3>Internship Work</h3>

        <textarea
          name="team"
          placeholder="What team did you work on?"
          value={form.team}
          onChange={handleChange}
        />

        <textarea
          name="project"
          placeholder="What project did you work on?"
          value={form.project}
          onChange={handleChange}
        />

        <textarea
          name="techStack"
          placeholder="Technologies you used"
          value={form.techStack}
          onChange={handleChange}
        />

        <textarea
          name="challenge"
          placeholder="What was the hardest challenge?"
          value={form.challenge}
          onChange={handleChange}
        />

        <h3>Advice</h3>

        <textarea
          name="advice"
          placeholder="Advice for future applicants"
          value={form.advice}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Story"}
        </button>

      </form>

    </div>
  )
}

export default NewStoryPage