'use client'

import { useState, useRef } from 'react'
import type { VisualStyle, MusicSource, YouTubePlayer } from '@/lib/types'
import { DEFAULT_MUSIC_SOURCE } from '@/lib/constants'
import { useYouTubePlayer } from '@/hooks/useYouTubePlayer'
import { useVisualCycle } from '@/hooks/useVisualCycle'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { MusicPlayer } from '@/components/MusicPlayer'
import { AmbientCanvas } from '@/components/AmbientCanvas'

export default function Home() {
  const shouldPlayRef = useRef(true)
  const shouldUnmuteRef = useRef(true)
  const [playing, setPlaying] = useState(true)
  const [muted, setMuted] = useState(true)
  const [started, setStarted] = useState(false)
  const [musicSource, setMusicSource] = useState<MusicSource>(DEFAULT_MUSIC_SOURCE)
  const [switchingSource, setSwitchingSource] = useState(false)
  const [musicError, setMusicError] = useState<string | null>(null)

  const { visualStyle, visualVariant } = useVisualCycle()
  const { playerContainerRef, playerRef } = useYouTubePlayer({
    shouldPlay: shouldPlayRef.current,
    shouldUnmute: shouldUnmuteRef.current,
  })

  const command = (action: 'playVideo' | 'pauseVideo' | 'mute' | 'unMute') => {
    playerRef.current?.[action]()
  }

  const beginListening = () => {
    shouldPlayRef.current = true
    shouldUnmuteRef.current = true
    playerRef.current?.setVolume(100)
    command('unMute')
    command('playVideo')
    setMuted(false)
    setStarted(true)
  }

  const togglePlaying = () => {
    const nextPlaying = !playing
    shouldPlayRef.current = nextPlaying
    command(nextPlaying ? 'playVideo' : 'pauseVideo')
    setPlaying(nextPlaying)
  }

  const toggleMuted = () => {
    const nextMuted = !muted
    shouldUnmuteRef.current = !nextMuted
    command(nextMuted ? 'mute' : 'unMute')
    if (!nextMuted) {
      playerRef.current?.setVolume(100)
      command('playVideo')
    }
    setMuted(nextMuted)
    setStarted(true)
  }

  const switchMusicSource = async () => {
    if (switchingSource) return
    setSwitchingSource(true)
    setMusicError(null)
    try {
      const response = await fetch(`/api/music-source?exclude=${encodeURIComponent(musicSource.videoId)}`)
      if (!response.ok) throw new Error('Music source request failed')
      const nextSource = (await response.json()) as MusicSource
      playerRef.current?.loadVideoById(nextSource.videoId)
      if (!shouldPlayRef.current) command('pauseVideo')
      if (shouldUnmuteRef.current) command('unMute')
      else command('mute')
      setMusicSource(nextSource)
      setStarted(true)
    } catch {
      setMusicError('Unable to find another stream right now.')
    } finally {
      setSwitchingSource(false)
    }
  }

  return (
    <main className={`experience style-${visualStyle}`}>
      <AmbientCanvas style={visualStyle} variant={visualVariant} />
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />
      <Header />
      <Hero onBeginListening={beginListening} isListening={started} />
      <div className="bottom-area">
        <MusicPlayer
          musicSource={musicSource}
          isPlaying={playing}
          isMuted={muted}
          isSwitching={switchingSource}
          onTogglePlay={togglePlaying}
          onToggleMute={toggleMuted}
          onSwitchSource={switchMusicSource}
          player={playerRef}
        />
        {musicError && <p className="music-error" role="status">{musicError}</p>}
      </div>
      <div ref={playerContainerRef} aria-hidden="true" className="youtube-player" />
      {!started && <div className="autoplay-hint">Sound begins muted by your browser <span>·</span> tap above to open the room</div>}
    </main>
  )
}
