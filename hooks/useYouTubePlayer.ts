import { useEffect, useRef } from 'react'
import type { YouTubePlayer } from '@/lib/types'
import { DEFAULT_MUSIC_SOURCE, YOUTUBE_EMBED_HOST } from '@/lib/constants'

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLDivElement,
        options: {
          videoId: string
          playerVars: Record<string, string | number>
          host?: string
          events: { onReady: (event: { target: YouTubePlayer }) => void }
        }
      ) => YouTubePlayer
    }
    onYouTubeIframeAPIReady?: () => void
  }
}

interface UseYouTubePlayerOptions {
  shouldPlay: boolean
  shouldUnmute: boolean
  onReady?: (player: YouTubePlayer) => void
}

export function useYouTubePlayer({ shouldPlay, shouldUnmute, onReady }: UseYouTubePlayerOptions) {
  const playerContainerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YouTubePlayer | null>(null)

  useEffect(() => {
    const createPlayer = () => {
      if (!window.YT || !playerContainerRef.current || playerRef.current) return
      playerRef.current = new window.YT.Player(playerContainerRef.current, {
        host: YOUTUBE_EMBED_HOST,
        videoId: DEFAULT_MUSIC_SOURCE.videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          loop: 1,
          playlist: DEFAULT_MUSIC_SOURCE.videoId,
          playsinline: 1,
          rel: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: ({ target }) => {
            playerRef.current = target
            if (shouldUnmute) target.unMute()
            else target.mute()
            if (shouldPlay) target.playVideo()
            onReady?.(target)
          },
        },
      })
    }

    if (window.YT) {
      createPlayer()
      return
    }

    const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]')
    if (!existingScript) {
      const script = document.createElement('script')
      script.src = 'https://www.youtube.com/iframe_api'
      document.body.appendChild(script)
    }
    window.onYouTubeIframeAPIReady = createPlayer

    return () => {
      window.onYouTubeIframeAPIReady = undefined
      playerRef.current = null
    }
  }, [shouldPlay, shouldUnmute, onReady])

  return { playerContainerRef, playerRef }
}
