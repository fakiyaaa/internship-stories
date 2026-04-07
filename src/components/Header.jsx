import "../styles/header.css"

function Header({ setPage, user, onSignOut, onViewProfile }) {
  return (
    <header>
      <h2>Intern Stories</h2>

      <button onClick={() => setPage("home")}>
        Discover
      </button>

      <button onClick={() => setPage("saved")}>
        Saved
      </button>

      <button className="btn-primary" onClick={() => setPage("new")}>
        Share a story
      </button>

      <button onClick={() => setPage("admin")}>
        Admin
      </button>

      {user ? (
        <>
          <button onClick={onViewProfile}>My profile</button>
          <button onClick={onSignOut}>Sign out</button>
        </>
      ) : (
        <button onClick={() => setPage("auth")}>Sign in</button>
      )}
    </header>
  )
}

export default Header