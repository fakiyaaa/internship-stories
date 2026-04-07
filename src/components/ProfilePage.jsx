import { useState } from "react"
import { supabase } from "../lib/supabase"
import StoryCard from "./StoryCard"
import "../styles/profile.css"

function ProfilePage({ profile, stories, savedIds, onLike, onSave, setSelectedStory, setPage, isOwnProfile, onProfileSaved }) {

  const [editing, setEditing] = useState(false)
  const [firstName, setFirstName] = useState(profile?.first_name || "")
  const [lastName, setLastName] = useState(profile?.last_name || "")
  const [school, setSchool] = useState(profile?.school || "")
  const [bio, setBio] = useState(profile?.bio || "")
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState("")
  const [saveSuccess, setSaveSuccess] = useState(false)

  const authorStories = stories.filter(s => s.user_id === profile?.id)
  const displayName = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "Anonymous"

  async function saveProfile() {
    setSaving(true)
    setSaveError("")

    try {
      const updates = { first_name: firstName, last_name: lastName, school, bio: bio || null }

      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", profile.id)
        .select()
        .single()

      if (error) throw new Error(error.message)

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
      setEditing(false)
      if (data) onProfileSaved(data)
    } catch (err) {
      setSaveError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (!profile) return <div className="profile-page"><p>Profile not found.</p></div>

  return (
    <div className="profile-page">

      <button className="back-btn" onClick={() => setPage("home")}>← Back</button>

      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-placeholder">{displayName[0].toUpperCase()}</div>
        </div>

        <div className="profile-info">
          {editing ? (
            <>
              <div className="profile-name-row">
                <input
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="First name *"
                  className="profile-name-input"
                  required
                />
                <input
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="Last name *"
                  className="profile-name-input"
                  required
                />
              </div>
              <input
                value={school}
                onChange={e => setSchool(e.target.value)}
                placeholder="School / University *"
                className="profile-name-input"
                required
              />
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Bio (optional)"
                className="profile-bio-input"
              />
              {saveError && <p style={{ color: "red", fontSize: "13px" }}>{saveError}</p>}
              <div className="profile-edit-actions">
                <button onClick={saveProfile} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
                <button onClick={() => { setEditing(false); setSaveError("") }}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <h2>{displayName}</h2>
              {profile.school && <p className="profile-school">🎓 {profile.school}</p>}
              {profile.bio && <p className="profile-bio">{profile.bio}</p>}
              {saveSuccess && <p style={{ color: "green", fontSize: "13px" }}>Saved!</p>}
              {isOwnProfile && (
                <button className="edit-profile-btn" onClick={() => setEditing(true)}>Edit profile</button>
              )}
            </>
          )}
        </div>
      </div>

      <h3 className="profile-stories-title">
        {isOwnProfile ? "Your stories" : `${displayName}'s stories`}
      </h3>

      {authorStories.length === 0 ? (
        <p className="no-stories">No stories published yet.</p>
      ) : (
        <div className="story-grid">
          {authorStories.map(story => (
            <StoryCard
              key={story.id}
              story={story}
              onClick={() => { setSelectedStory(story); setPage("story") }}
              onLike={onLike}
              onSave={onSave}
              saved={savedIds?.has(story.id) ?? false}
            />
          ))}
        </div>
      )}

    </div>
  )
}

export default ProfilePage
