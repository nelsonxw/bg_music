interface HeroProps {
  onBeginListening: () => void
  isListening: boolean
}

export function Hero({ onBeginListening, isListening }: HeroProps) {
  return (
    <section className="hero">
      <p className="eyebrow">A little room for quiet</p>
      <h1>
        Let the day
        <br />
        <em>soften.</em>
      </h1>
      <p className="intro">Slow light and gentle sound for the spaces between thoughts.</p>
      <button className="listen-button" onClick={onBeginListening} aria-label="Start listening">
        <span className="play-icon">{isListening ? '◌' : '▶'}</span>
        <span>{isListening ? 'Listening now' : 'Begin listening'}</span>
        <span className="button-arrow">↗</span>
      </button>
    </section>
  )
}
