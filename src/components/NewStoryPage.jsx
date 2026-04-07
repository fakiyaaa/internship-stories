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

  const [photo, setPhoto] = useState(null)
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const [photoError, setPhotoError] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()

    if (!photo) {
      setPhotoError("Please upload a photo.")
      return
    }

    setPhotoError("")
    setLoading(true)

    try {
      await submitStory(form, photo)
      setPage("home")
    } catch (err) {
      console.error("Error submitting story:", err)
    }

    setLoading(false)
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

        <h3>Photo</h3>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => { setPhoto(e.target.files[0]); setPhotoError("") }}
        />

        {photoError && <p style={{ color: "red", fontSize: "13px" }}>{photoError}</p>}

        {photo && (
          <img
            src={URL.createObjectURL(photo)}
            alt="preview"
            style={{ width: "100%", maxHeight: "240px", objectFit: "cover", borderRadius: "8px", marginTop: "8px" }}
          />
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Story"}
        </button>

      </form>

    </div>
  )
}

export default NewStoryPage