import "../styles/header.css"

const ADMIN_ID = "51c6de19-c328-4ad3-a9e0-156c39ad1c65"

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

      {user?.id === ADMIN_ID && (
        <button onClick={() => setPage("admin")}>Admin</button>
      )}

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