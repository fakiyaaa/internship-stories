import "../styles/admin.css"

function AdminPage({
  pendingStories,
  approveStory,
  rejectStory,
  generateArticle,
  updateGeneratedArticle
}) {

  return (
    <div className="admin-page">

      <h2>Pending Submissions</h2>

      {pendingStories.length === 0 && (
        <p>No submissions yet.</p>
      )}

      {pendingStories.map((story) => (

        <div key={story.id} className="admin-card">

          <div className="admin-layout">

            {/* LEFT SIDE → RAW ANSWERS */}

            <div className="admin-answers">

              <h3>{story.company} — {story.role}</h3>

              <p><strong>Location:</strong> {story.location}</p>
              <p><strong>Season:</strong> {story.season}</p>

              <p><strong>Interview Process</strong></p>
              <p>{story.interviewProcess}</p>

              <p><strong>Project</strong></p>
              <p>{story.project}</p>

            </div>


            {/* RIGHT SIDE → GENERATED ARTICLE */}

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


          {/* ACTION BUTTONS */}

          <div className="admin-actions">

            <button
              onClick={() => approveStory(story.id)}
              className="approve-btn"
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