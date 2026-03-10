import "../styles/admin.css"
import { useState } from "react"

function AdminPage({
  pendingStories,
  approveStory,
  rejectStory,
  generateArticle,
  updateGeneratedArticle
}) {

  const [unlocked, setUnlocked] = useState(false)
  const [input, setInput] = useState("")
  const [error, setError] = useState(false)

  function handleLogin() {
    if (input === "1235") {
      setUnlocked(true)
      setError(false)
    } else {
      setError(true)
    }
  }

  if (!unlocked) {
    return (
      <div className="admin-lock">
        <h2>Admin Access</h2>
        <input
          type="password"
          placeholder="Enter password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />
        <button onClick={handleLogin}>Enter</button>
        {error && <p className="error">Incorrect password</p>}
      </div>
    )
  }

  return (
    <div className="admin-page">

      <h2>Pending Submissions</h2>

      {pendingStories.length === 0 && (
        <p>No submissions yet.</p>
      )}

      {pendingStories.map((story) => (

        <div key={story.id} className="admin-card">

          <div className="admin-layout">

            <div className="admin-answers">

              <h3>{story.company} — {story.role}</h3>

              <p><strong>Location:</strong> {story.location}</p>
              <p><strong>Season:</strong> {story.season}</p>

              <p><strong>Interview Process</strong></p>
              <p>{story.interviewProcess}</p>

              <p><strong>Project</strong></p>
              <p>{story.project}</p>

            </div>

            <div className="admin-article">

              <h4>Generated Article</h4>

              {!story.generatedArticle && (
                <button
                  onClick={() => generateArticle(story)}
                  className="generate-btn"
                >
                  Generate Article
                </button>
              )}

              {story.generatedArticle && (
                <textarea
                  value={story.generatedArticle}
                  onChange={(e) =>
                    updateGeneratedArticle(story.id, e.target.value)
                  }
                />
              )}

            </div>

          </div>

          <div className="admin-actions">

            <button
              onClick={() => approveStory(story.id)}
              className="approve-btn"
              disabled={!story.generatedArticle}
            >
              Approve
            </button>

            <button
              onClick={() => rejectStory(story.id)}
              className="reject-btn"
            >
              Reject
            </button>

          </div>

        </div>

      ))}

    </div>
  )
}

export default AdminPage