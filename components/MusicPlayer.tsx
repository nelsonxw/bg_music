import type { MusicSource, YouTubePlayer } from '@/lib/types'

interface MusicPlayerProps {
  musicSource: MusicSource
  isPlaying: boolean
  isMuted: boolean
  isSwitching: boolean
  onTogglePlay: () => void
  onToggleMute: () => void
  onSwitchSource: () => void
  player: React.RefObject<YouTubePlayer | null>
}

export function MusicPlayer({
  musicSource,
  isPlaying,
  isMuted,
  isSwitching,
  onTogglePlay,
  onToggleMute,
  onSwitchSource,
  player,
}: MusicPlayerProps) {
  return (
    <>
      <div className="session-note">
        <span>Currently floating</span>
        <strong>{musicSource.channelTitle}</strong>
        <small>{musicSource.title}</small>
      </div>
      <div className="player glass-panel">
        <button className="control-button" onClick={onTogglePlay} aria-label={isPlaying ? 'Pause music' : 'Play music'}>
          {isPlaying ? 'Ⅱ' : '▶'}
        </button>
        <div className="track-info">
          <div className="track-title">
            <span>{musicSource.title}</span>
            <span className="live-label">YOUTUBE</span>
          </div>
          <div className="waveform" aria-hidden="true">
            {Array.from({ length: 30 }, (_, i) => (
              <i key={i} style={{ height: `${5 + ((i * 13) % 15)}px`, animationDelay: `${i * 0.08}s` }} />
            ))}
          </div>
        </div>
        <button className="sound-button" onClick={onToggleMute} aria-label={isMuted ? 'Unmute music' : 'Mute music'}>
          {isMuted ? '⌁' : '◖)'}
        </button>
        <button
          className="switch-button"
          onClick={onSwitchSource}
          disabled={isSwitching}
          aria-label="Switch to another music stream"
        >
          {isSwitching ? '…' : '↻'}
        </button>
      </div>
    </>
  )
}
