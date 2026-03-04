function StoryCard({story, onClick}) {
  return (

    <div className='story-card' onClick={onClick}>

    <h3>{story.headline}</h3>

    <p>{story.summary}</p>

    <p className="company-row">
        <strong>{story.company}</strong>
        <span> • {story.role}</span>
    </p>

    </div>

  )
}
export default StoryCard