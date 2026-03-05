import "../styles/header.css"
function Header({ setPage }) {
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
    </header>
  )
}

export default Header