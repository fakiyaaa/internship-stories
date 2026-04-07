import "../styles/admin.css"
import { useState } from "react"

const ADMIN_ID = "51c6de19-c328-4ad3-a9e0-156c39ad1c65"

function AdminPage({
  pendingStories,
  approveStory,
  rejectStory,
  generateArticle,
  updateGeneratedArticle,
  publishedStories,
  editPublishedArticle,
  deleteStory,
  user
}) {

  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState("")

  if (!user || user.id !== ADMIN_ID) {
    return (
      <div className="admin-lock">
        <p>You don't have access to this page.</p>
      </div>
    )
  }

  function startEdit(story) {
    setEditingId(story.id)
    setEditText(story.article || "")
  }

  async function saveEdit(id) {
    await editPublishedArticle(id, editText)
    setEditingId(null)
  }

  return (
    <div className="admin-page">

      <h2>Published Stories</h2>

      {publishedStories.length === 0 && <p>No published stories yet.</p>}

      {publishedStories.map((story) => (
        <div key={story.id} className="admin-card">
          <h3>{story.company} — {story.role}</h3>
          <p className="story-headline">{story.headline}</p>

          {editingId === story.id ? (
            <>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={10}
              />
              <div className="admin-actions">
                <button className="approve-btn" onClick={() => saveEdit(story.id)}>Save</button>
                <button className="reject-btn" onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            </>
          ) : (
            <div className="admin-actions">
              <button className="generate-btn" onClick={() => startEdit(story)}>Edit Article</button>
              <button className="reject-btn" onClick={() => {
                if (window.confirm("Delete this story? This cannot be undone.")) deleteStory(story.id)
              }}>Delete</button>
            </div>
          )}
        </div>
      ))}

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
                  disabled={story.generating}
                >
                  {story.generating ? "Generating..." : "Generate Article"}
                </button>
              )}

              {story.generateError && (
                <p style={{ color: "red", fontSize: "13px", marginTop: "8px" }}>
                  Error: {story.generateError}
                </p>
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