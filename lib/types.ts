export type VisualStyle = 'classical' | 'meditation' | 'liquid' | 'lofi' | 'nature' | 'cosmic' | 'seasonal' | 'geometric' | 'electronic'

export type Particle = {
  x: number
  y: number
  radius: number
  speed: number
  drift: number
  phase: number
  alpha: number
}

export type VisualSelection = {
  style: VisualStyle
  variant?: number
}

export type MusicSource = {
  videoId: string
  title: string
  channelTitle: string
}

export type YouTubePlayer = {
  loadVideoById: (videoId: string) => void
  playVideo: () => void
  pauseVideo: () => void
  mute: () => void
  unMute: () => void
  setVolume: (volume: number) => void
}

export type VisualTheme = {
  glow: string
  mid: string
  particle: string
  shadow: string
}
