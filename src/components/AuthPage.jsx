import { useState } from "react"
import { supabase } from "../lib/supabase"
import "../styles/auth.css"

function AuthPage({ setPage }) {
  const [mode, setMode] = useState("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [school, setSchool] = useState("")
  const [bio, setBio] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else setPage("home")
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { first_name: firstName, last_name: lastName, school, bio: bio || null }
        }
      })
      if (error) setError(error.message)
      else setError("Check your email to confirm your account.")
    }

    setLoading(false)
  }

  function switchMode() {
    setMode(mode === "login" ? "signup" : "login")
    setError("")
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>{mode === "login" ? "Sign in" : "Create account"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          {mode === "signup" && (
            <>
              <input
                placeholder="First name *"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
              />
              <input
                placeholder="Last name *"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
              />
              <input
                placeholder="School / University *"
                value={school}
                onChange={e => setSchool(e.target.value)}
                required
              />
              <textarea
                placeholder="Bio (optional)"
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={3}
              />
            </>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "..." : mode === "login" ? "Sign in" : "Sign up"}
          </button>
        </form>

        {error && <p className="auth-message">{error}</p>}

        <p className="auth-toggle">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}
          <button onClick={switchMode}>
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  )
}

export default AuthPage
