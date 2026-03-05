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

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  function handleSubmit(e) {
    e.preventDefault()

    const submission = {
      id: Date.now(),
      ...form,
      status: "pending"
    }

    submitStory(submission)

    setPage("home")
  }

  return (
    <div className="new-story-page">

      <h2>Submit your internship story</h2>

      <form onSubmit={handleSubmit}>

        <h3>Internship Basics</h3>

        <input
          name="company"
          placeholder="Company"
          value={form.company}
          onChange={handleChange}
        />

        <input
          name="role"
          placeholder="Role"
          value={form.role}
          onChange={handleChange}
        />

        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
        />

        <input
          name="season"
          placeholder="Season (Summer 2025)"
          value={form.season}
          onChange={handleChange}
        />

        <h3>Getting the Internship</h3>

        <textarea
          name="applicationProcess"
          placeholder="How did you apply?"
          value={form.applicationProcess}
          onChange={handleChange}
        />

        <textarea
          name="interviewProcess"
          placeholder="Describe the interview stages"
          value={form.interviewProcess}
          onChange={handleChange}
        />

        <textarea
          name="preparation"
          placeholder="What preparation helped the most?"
          value={form.preparation}
          onChange={handleChange}
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

        <button type="submit">
          Submit Story
        </button>

      </form>

    </div>
  )
}

export default NewStoryPage