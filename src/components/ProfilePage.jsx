import { useState } from "react"
import { supabase } from "../lib/supabase"
import StoryCard from "./StoryCard"
import "../styles/profile.css"

function ProfilePage({ profile, stories, savedIds, onLike, onSave, setSelectedStory, setPage, isOwnProfile }) {

  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(profile?.name || "")
  const [bio, setBio] = useState(profile?.bio || "")
  const [avatar, setAvatar] = useState(null)
  const [saving, setSaving] = useState(false)

  const authorStories = stories.filter(s => s.user_id === profile?.id)

  async function saveProfile() {
    setSaving(true)

    const updates = { name, bio }

    if (avatar) {
      const ext = avatar.name.split(".").pop()
      const path = `${profile.id}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from("story-photos")
        .upload(path, avatar, { upsert: true })

      if (!uploadError) {
        const { data } = supabase.storage.from("story-photos").getPublicUrl(path)
        updates.avatar_url = data.publicUrl
      }
    }

    await supabase.from("profiles").update(updates).eq("id", profile.id)

    setSaving(false)
    setEditing(false)
    window.location.reload()
  }

  if (!profile) return <div className="profile-page"><p>Profile not found.</p></div>

  return (
    <div className="profile-page">

      <button className="back-btn" onClick={() => setPage("home")}>← Back</button>

      <div className="profile-header">
        <div className="profile-avatar">
          {profile.avatar_url
            ? <img src={profile.avatar_url} alt={profile.name} />
            : <div className="avatar-placeholder">{(profile.name || "?")[0].toUpperCase()}</div>
          }
        </div>

        <div className="profile-info">
          {editing ? (
            <>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                className="profile-name-input"
              />
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Short bio"
                className="profile-bio-input"
              />
              <label className="profile-avatar-upload">
                Change photo
                <input type="file" accept="image/*" onChange={e => setAvatar(e.target.files[0])} hidden />
              </label>
              <div className="profile-edit-actions">
                <button onClick={saveProfile} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
                <button onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <h2>{profile.name || "Anonymous"}</h2>
              {profile.bio && <p className="profile-bio">{profile.bio}</p>}
              {isOwnProfile && (
                <button className="edit-profile-btn" onClick={() => setEditing(true)}>Edit profile</button>
              )}
            </>
          )}
        </div>
      </div>

      <h3 className="profile-stories-title">
        {isOwnProfile ? "Your stories" : `${profile.name || "Their"} stories`}
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
