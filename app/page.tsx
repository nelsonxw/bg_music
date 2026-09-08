'use client'

import { useEffect, useRef, useState } from 'react'

const YOUTUBE_VIDEO_ID = 'fslL-sjPr5g'
const YOUTUBE_EMBED_HOST = 'https://www.youtube-nocookie.com'

type YouTubePlayer = {
  playVideo: () => void
  pauseVideo: () => void
  mute: () => void
  unMute: () => void
  setVolume: (volume: number) => void
}

declare global {
  interface Window {
    YT?: {
      Player: new (element: HTMLDivElement, options: { videoId: string; playerVars: Record<string, string | number>; host?: string; events: { onReady: (event: { target: YouTubePlayer }) => void } }) => YouTubePlayer
    }
    onYouTubeIframeAPIReady?: () => void
  }
}

type VisualStyle = 'classical' | 'meditation' | 'liquid' | 'lofi' | 'nature' | 'cosmic' | 'seasonal' | 'geometric' | 'electronic'
type Particle = { x: number; y: number; radius: number; speed: number; drift: number; phase: number; alpha: number }
type VisualSelection = { style: VisualStyle; variant?: number }

const visualCycle: VisualSelection[] = [
  ...Array.from({ length: 4 }, (_, variant) => ({ style: 'nature' as const, variant })),
  ...Array.from({ length: 4 }, (_, variant) => ({ style: 'seasonal' as const, variant })),
  { style: 'classical' },
  { style: 'meditation' },
  { style: 'liquid' },
  { style: 'lofi' },
  { style: 'cosmic' },
  { style: 'geometric' },
  { style: 'electronic' },
]
const visualThemes: Record<VisualStyle, { glow: string; mid: string; particle: string; shadow: string }> = {
  classical: { glow: '181, 202, 220', mid: '73, 105, 139', particle: '220, 237, 255', shadow: '161, 203, 237' },
  meditation: { glow: '139, 232, 210', mid: '46, 110, 132', particle: '190, 255, 235', shadow: '121, 235, 211' },
  liquid: { glow: '80, 198, 190', mid: '57, 80, 158', particle: '190, 245, 255', shadow: '102, 213, 218' },
  lofi: { glow: '238, 157, 115', mid: '106, 66, 104', particle: '255, 212, 164', shadow: '239, 145, 108' },
  nature: { glow: '94, 190, 151', mid: '34, 102, 104', particle: '176, 242, 198', shadow: '82, 205, 168' },
  cosmic: { glow: '147, 124, 238', mid: '63, 55, 134', particle: '228, 222, 255', shadow: '151, 133, 255' },
  seasonal: { glow: '231, 173, 124', mid: '116, 77, 102', particle: '255, 221, 177', shadow: '238, 151, 112' },
  geometric: { glow: '89, 207, 224', mid: '45, 92, 160', particle: '194, 247, 255', shadow: '84, 208, 239' },
  electronic: { glow: '178, 143, 241', mid: '86, 65, 151', particle: '232, 216, 255', shadow: '175, 127, 255' },
}

function AmbientCanvas({ style, variant }: { style: VisualStyle; variant?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    let frameId = 0
    let width = 0
    let height = 0
    const theme = visualThemes[style]
    const particles: Particle[] = Array.from({ length: 105 }, (_, index) => ({
      x: Math.random(), y: Math.random(), radius: 1.5 + Math.random() * 3.5,
      speed: 0.00008 + Math.random() * 0.00018, drift: (Math.random() - 0.5) * 0.00012,
      phase: index * 0.73, alpha: 0.2 + Math.random() * 0.55,
    }))
    const natureMode = variant ?? Math.floor(Math.random() * 4)
    const seasonalMode = variant ?? Math.floor(Math.random() * 4)

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * ratio
      canvas.height = height * ratio
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const draw = (time: number) => {
      const breath = (Math.sin(time * 0.00055) + 1) / 2
      context.clearRect(0, 0, width, height)
      const glow = context.createRadialGradient(width * 0.52, height * 0.42, 0, width * 0.52, height * 0.42, Math.max(width, height) * 0.72)
      glow.addColorStop(0, `rgba(${theme.glow}, ${0.12 + breath * 0.05})`)
      glow.addColorStop(0.38, `rgba(${theme.mid}, 0.08)`)
      glow.addColorStop(1, 'rgba(3, 12, 27, 0)')
      context.fillStyle = glow
      context.fillRect(0, 0, width, height)

      if (style === 'classical') {
        context.strokeStyle = 'rgba(190, 220, 240, 0.22)'
        context.lineWidth = 1
        for (let i = 0; i < 46; i += 1) {
          const x = ((i * 137) % width)
          const y = ((i * 83 + time * (0.025 + (i % 3) * 0.008)) % (height + 80)) - 40
          context.beginPath(); context.moveTo(x, y); context.lineTo(x - 8, y + 42); context.stroke()
        }
        context.fillStyle = 'rgba(204, 222, 236, 0.12)'
        for (let i = 0; i < 5; i += 1) {
          const x = width * (0.12 + i * 0.22) + Math.sin(time * 0.00012 + i) * 35
          const y = height * (0.23 + (i % 2) * 0.16)
          context.beginPath(); context.ellipse(x, y, 130, 34, 0, 0, Math.PI * 2); context.fill()
        }
        context.strokeStyle = 'rgba(165, 214, 230, 0.28)'
        for (let i = 0; i < 4; i += 1) { context.beginPath(); context.ellipse(width * 0.72, height * 0.78, 60 + i * 22 + breath * 8, 15 + i * 6, 0, 0, Math.PI * 2); context.stroke() }
      } else if (style === 'meditation') {
        const bands = ['rgba(83, 207, 177, .12)', 'rgba(99, 142, 224, .10)', 'rgba(177, 120, 214, .08)']
        bands.forEach((color, index) => {
          context.fillStyle = color; context.beginPath(); context.moveTo(0, height * (0.28 + index * 0.11))
          for (let x = 0; x <= width; x += 24) context.lineTo(x, height * (0.28 + index * 0.11) + Math.sin(x * 0.008 + time * 0.00025 + index) * 35)
          context.lineTo(width, 0); context.lineTo(0, 0); context.fill()
        })
        drawParticles(context, particles, time, width, height, breath, theme)
      } else if (style === 'liquid') {
        const blobs = [
          { x: 0.2, y: 0.34, radius: 0.42, color: '68, 195, 176' },
          { x: 0.72, y: 0.3, radius: 0.36, color: '82, 121, 219' },
          { x: 0.52, y: 0.78, radius: 0.48, color: '113, 78, 178' },
        ]
        blobs.forEach((blob, index) => {
          const x = width * blob.x + Math.sin(time * 0.00016 + index * 2.1) * width * 0.08
          const y = height * blob.y + Math.cos(time * 0.00013 + index) * height * 0.06
          const gradient = context.createRadialGradient(x, y, 0, x, y, Math.max(width, height) * blob.radius)
          gradient.addColorStop(0, `rgba(${blob.color}, .22)`)
          gradient.addColorStop(.55, `rgba(${blob.color}, .08)`)
          gradient.addColorStop(1, `rgba(${blob.color}, 0)`)
          context.fillStyle = gradient; context.fillRect(0, 0, width, height)
        })
        context.strokeStyle = 'rgba(188, 241, 231, .13)'; context.lineWidth = 2
        for (let band = 0; band < 7; band += 1) {
          context.beginPath()
          for (let x = 0; x <= width; x += 18) {
            const y = height * (.23 + band * .1) + Math.sin(x * .006 + time * .00018 + band) * 30 + Math.sin(x * .017 - time * .00012) * 12
            if (x === 0) context.moveTo(x, y); else context.lineTo(x, y)
          }
          context.stroke()
        }
        drawParticles(context, particles, time, width, height, breath, theme)
      } else if (style === 'lofi') {
        context.fillStyle = 'rgba(5, 10, 23, .42)'; context.fillRect(0, height * 0.57, width, height * 0.43)
        for (let i = 0; i < 15; i += 1) {
          const buildingWidth = 38 + (i % 4) * 22; const x = i * (width / 13) - 20; const buildingHeight = 70 + ((i * 47) % 130)
          context.fillStyle = `rgba(11, 19, 38, ${0.65 + (i % 3) * .08})`; context.fillRect(x, height * .82 - buildingHeight, buildingWidth, buildingHeight)
          context.fillStyle = 'rgba(244, 182, 113, .45)'
          for (let row = 0; row < 4; row += 1) for (let col = 0; col < 2; col += 1) if ((row + col + i) % 3) context.fillRect(x + 10 + col * 17, height * .82 - buildingHeight + 16 + row * 24, 5, 7)
        }
        context.fillStyle = 'rgba(238, 220, 191, .72)'
        particles.forEach((particle) => { particle.y += particle.speed * 1.8; if (particle.y > 1.04) particle.y = -.04; context.beginPath(); context.arc(particle.x * width, particle.y * height, particle.radius * .7, 0, Math.PI * 2); context.fill() })
      } else if (style === 'nature') {
        context.fillStyle = 'rgba(5, 42, 43, .32)'; context.fillRect(0, height * .62, width, height * .38)
        for (let layer = 0; layer < 4; layer += 1) {
          context.beginPath(); context.moveTo(0, height * (.62 + layer * .08))
          for (let x = 0; x <= width; x += 20) context.lineTo(x, height * (.62 + layer * .08) + Math.sin(x * .012 + time * .0003 + layer) * (8 + layer * 4))
          context.lineTo(width, height); context.lineTo(0, height); context.fillStyle = `rgba(27, ${92 + layer * 18}, ${83 + layer * 12}, .18)`; context.fill()
        }
        if (natureMode === 0) {
          const sunlight = context.createLinearGradient(width * .2, 0, width * .55, height * .8)
          sunlight.addColorStop(0, 'rgba(235, 222, 159, .14)'); sunlight.addColorStop(1, 'rgba(235, 222, 159, 0)')
          context.fillStyle = sunlight; context.fillRect(0, 0, width, height)
          context.fillStyle = 'rgba(6, 35, 38, .48)'
          for (let i = 0; i < 9; i += 1) {
            const x = i * width / 8 + Math.sin(time * .0002 + i) * 12
            context.fillRect(x, height * .18, 12 + (i % 3) * 8, height * .62)
            context.beginPath(); context.arc(x + 8, height * .2, 54 + (i % 2) * 18, 0, Math.PI * 2); context.fill()
          }
          context.fillStyle = 'rgba(123, 204, 151, .42)'
          for (let i = 0; i < 18; i += 1) { const x = (i * 91) % width; const y = height * (.28 + ((i * 37) % 40) / 100); context.beginPath(); context.ellipse(x + Math.sin(time * .001 + i) * 8, y, 18, 8, i, 0, Math.PI * 2); context.fill() }
        } else if (natureMode === 1) {
          context.strokeStyle = 'rgba(178, 235, 207, .28)'; context.lineWidth = 2
          for (let i = 0; i < 6; i += 1) { context.beginPath(); context.moveTo(width * .08, height * (.7 + i * .045)); context.quadraticCurveTo(width * .5, height * (.64 + i * .05) + Math.sin(time * .0004 + i) * 10, width * 1.05, height * (.7 + i * .04)); context.stroke() }
        } else if (natureMode === 2) {
          context.strokeStyle = 'rgba(182, 222, 234, .24)'; context.lineWidth = 1
          for (let i = 0; i < 64; i += 1) { const x = (i * 73) % width; const y = ((i * 47 + time * (.035 + i % 3 * .01)) % (height + 70)) - 35; context.beginPath(); context.moveTo(x, y); context.lineTo(x - 7, y + 34); context.stroke() }
        } else {
          context.fillStyle = 'rgba(57, 168, 170, .22)'
          for (let i = 0; i < 7; i += 1) { const x = (i * width / 6 + time * (.012 + i * .001)) % (width + 130) - 70; const y = height * (.25 + (i % 4) * .11); context.beginPath(); context.ellipse(x, y, 22, 9, 0, 0, Math.PI * 2); context.fill(); context.beginPath(); context.moveTo(x - 18, y); context.lineTo(x - 34, y - 10); context.lineTo(x - 28, y + 10); context.fill() }
          context.strokeStyle = 'rgba(174, 235, 218, .35)'; context.lineWidth = 1
          for (let i = 0; i < 14; i += 1) { const x = (i * 97) % width; const y = ((i * 53 - time * .02) % height + height) % height; context.beginPath(); context.arc(x, y, 3 + i % 4, 0, Math.PI * 2); context.stroke() }
        }
        context.fillStyle = 'rgba(162, 235, 203, .5)'
        particles.forEach((particle) => { particle.y -= particle.speed * .45; if (particle.y < -.04) particle.y = 1.04; context.beginPath(); context.arc(particle.x * width, particle.y * height, particle.radius * .6, 0, Math.PI * 2); context.fill() })
      } else if (style === 'cosmic') {
        const stars = particles.slice(0, 72)
        stars.forEach((star) => {
          star.y -= star.speed * .18; star.x += Math.sin(time * .00008 + star.phase) * .000008
          if (star.y < -.03) star.y = 1.03
          const twinkle = .35 + Math.max(0, Math.sin(time * .001 + star.phase)) * .65
          context.fillStyle = `rgba(235, 229, 255, ${star.alpha * twinkle})`
          context.beginPath(); context.arc(star.x * width, star.y * height, Math.max(1, star.radius * .45), 0, Math.PI * 2); context.fill()
        })
        const nebula = context.createRadialGradient(width * .68, height * .38, 0, width * .68, height * .38, width * .45)
        nebula.addColorStop(0, 'rgba(181, 94, 209, .16)'); nebula.addColorStop(.45, 'rgba(71, 91, 205, .08)'); nebula.addColorStop(1, 'rgba(25, 23, 72, 0)')
        context.fillStyle = nebula; context.fillRect(0, 0, width, height)
        context.save(); context.translate(width * .66, height * .45); context.rotate(time * .00003); context.strokeStyle = 'rgba(191, 168, 255, .22)'; context.lineWidth = 2
        for (let arm = 0; arm < 2; arm += 1) { context.beginPath(); for (let t = 0; t < Math.PI * 3.5; t += .08) { const radius = 8 + t * 17; const x = Math.cos(t + arm * Math.PI) * radius; const y = Math.sin(t + arm * Math.PI) * radius * .52; if (t === 0) context.moveTo(x, y); else context.lineTo(x, y) } context.stroke() }
        context.restore()
        context.fillStyle = 'rgba(194, 157, 255, .3)'; context.beginPath(); context.arc(width * .23, height * .3, 42 + breath * 4, 0, Math.PI * 2); context.fill()
        const planet = context.createRadialGradient(width * .23 - 12, height * .3 - 14, 2, width * .23, height * .3, 48); planet.addColorStop(0, 'rgba(245, 220, 190, .85)'); planet.addColorStop(1, 'rgba(103, 76, 164, .65)'); context.fillStyle = planet; context.beginPath(); context.arc(width * .23, height * .3, 34, 0, Math.PI * 2); context.fill()
      } else if (style === 'seasonal') {
        if (seasonalMode === 0) {
          context.strokeStyle = 'rgba(62, 43, 48, .55)'; context.lineWidth = 8; context.beginPath(); context.moveTo(width * .12, height * .82); context.quadraticCurveTo(width * .27, height * .4, width * .55, height * .25); context.stroke()
          context.fillStyle = 'rgba(247, 172, 196, .62)'
          for (let i = 0; i < 28; i += 1) { const x = width * (.18 + ((i * 41) % 60) / 100) + Math.sin(time * .0004 + i) * 14; const y = height * (.2 + ((i * 29) % 43) / 100); context.beginPath(); context.arc(x, y, 5 + i % 4, 0, Math.PI * 2); context.fill() }
        } else if (seasonalMode === 1) {
          context.fillStyle = 'rgba(70, 50, 34, .52)'; context.fillRect(width * .48, height * .32, 16, height * .52)
          for (let i = 0; i < 22; i += 1) { const x = width * (.2 + ((i * 53) % 70) / 100) + Math.sin(time * .0003 + i) * 10; const y = height * (.25 + ((i * 31) % 48) / 100); context.fillStyle = `rgba(${190 + i % 4 * 12}, ${91 + i % 3 * 16}, 42, .6)`; context.beginPath(); context.ellipse(x, y, 12, 7, i, 0, Math.PI * 2); context.fill() }
        } else if (seasonalMode === 2) {
          context.fillStyle = 'rgba(232, 171, 126, .2)'; context.fillRect(0, height * .45, width, height * .55)
          context.fillStyle = 'rgba(30, 56, 82, .52)'; context.beginPath(); context.moveTo(0, height * .55); context.lineTo(width * .28, height * .26); context.lineTo(width * .48, height * .55); context.lineTo(width * .72, height * .2); context.lineTo(width, height * .55); context.lineTo(width, height); context.lineTo(0, height); context.fill()
          context.strokeStyle = 'rgba(187, 222, 224, .3)'; context.lineWidth = 2
          for (let i = 0; i < 5; i += 1) { context.beginPath(); context.moveTo(width * .1, height * (.68 + i * .05)); context.quadraticCurveTo(width * .5, height * (.64 + i * .045) + Math.sin(time * .0003 + i) * 8, width * .9, height * (.68 + i * .05)); context.stroke() }
        } else {
          context.fillStyle = 'rgba(7, 15, 30, .55)'; context.fillRect(0, height * .56, width, height * .44)
          for (let i = 0; i < 13; i += 1) { const buildingHeight = 55 + (i * 37) % 145; const x = i * width / 12; context.fillStyle = 'rgba(9, 19, 36, .78)'; context.fillRect(x, height * .84 - buildingHeight, 45 + i % 3 * 18, buildingHeight); context.fillStyle = 'rgba(246, 185, 112, .38)'; context.fillRect(x + 12, height * .84 - buildingHeight + 18, 5, 7) }
          context.fillStyle = 'rgba(241, 231, 185, .65)'; context.beginPath(); context.arc(width * .76, height * .22, 30, 0, Math.PI * 2); context.fill()
        }
      } else if (style === 'geometric') {
        const rhythm = (Math.sin(time * .0075) + 1) / 2
        const pulse = Math.max(0, Math.sin(time * .0075)) ** 10
        context.strokeStyle = `rgba(${theme.particle}, .18)`; context.lineWidth = 1
        for (let i = 0; i < 8; i += 1) {
          context.beginPath()
          for (let x = 0; x <= width; x += 18) {
            const y = height * (.24 + i * .07) + Math.sin(x * .01 + time * .00045 + i) * (9 + rhythm * 18)
            if (x === 0) context.moveTo(x, y); else context.lineTo(x, y)
          }
          context.stroke()
        }
        context.strokeStyle = `rgba(${theme.particle}, ${.16 + pulse * .2})`; context.lineWidth = 1.5
        for (let ring = 0; ring < 5; ring += 1) { context.beginPath(); context.arc(width * .55, height * .48, 35 + ring * 36 + rhythm * 12 + pulse * 20, 0, Math.PI * 2); context.stroke() }
        context.fillStyle = `rgba(${theme.glow}, ${.08 + pulse * .1})`; context.beginPath(); context.arc(width * .55, height * .48, 18 + pulse * 12, 0, Math.PI * 2); context.fill()
        context.strokeStyle = `rgba(${theme.shadow}, ${.3 + pulse * .35})`; context.beginPath(); context.moveTo(width * .18, height * .78); context.lineTo(width * .36, height * (.78 - pulse * .12)); context.lineTo(width * .54, height * .78); context.lineTo(width * .72, height * (.78 + pulse * .12)); context.lineTo(width * .9, height * .78); context.stroke()
      } else {
        context.strokeStyle = `rgba(${theme.particle}, .18)`; context.lineWidth = 1
        for (let i = 0; i < 9; i += 1) {
          context.beginPath(); for (let x = 0; x <= width; x += 16) { const y = height * (.28 + i * .055) + Math.sin(x * .012 + time * .001 + i) * (12 + i * 2); if (x === 0) context.moveTo(x, y); else context.lineTo(x, y) } context.stroke()
        }
        context.strokeStyle = `rgba(${theme.particle}, .32)`
        for (let i = 0; i < 4; i += 1) { context.beginPath(); context.arc(width * .72, height * .45, 55 + i * 34 + breath * 18, 0, Math.PI * 2); context.stroke() }
        drawParticles(context, particles, time, width, height, breath, theme)
      }
      context.shadowBlur = 0
      frameId = requestAnimationFrame(draw)
    }

    function drawParticles(context: CanvasRenderingContext2D, particles: Particle[], time: number, width: number, height: number, breath: number, theme: typeof visualThemes[VisualStyle]) {
      const tempoPulse = (Math.sin(time * 0.0075) + 1) / 2
      const musicalPeak = Math.max(0, Math.sin(time * 0.0075)) ** 24
      particles.forEach((particle) => {
        const isPeakParticle = Math.sin(particle.phase * 4.7) > 0.9
        const notePulse = isPeakParticle ? musicalPeak : 0
        const tempoSpeed = 0.82 + tempoPulse * 0.34
        particle.y -= particle.speed * tempoSpeed
        particle.x += particle.drift + Math.sin(time * 0.00022 + particle.phase) * 0.000012 * tempoSpeed
        if (particle.y < -0.04) particle.y = 1.04
        if (particle.x < -0.04) particle.x = 1.04
        if (particle.x > 1.04) particle.x = -0.04
        const shimmer = 0.62 + Math.sin(time * 0.0008 + particle.phase) * 0.25 + notePulse * 0.65
        const radius = particle.radius * (0.88 + breath * 0.2 + notePulse * 0.55)
        const x = particle.x * width
        const y = particle.y * height
        context.beginPath(); context.arc(x, y, radius, 0, Math.PI * 2)
        context.fillStyle = `rgba(${theme.particle}, ${particle.alpha * shimmer})`
        context.shadowBlur = 10 + notePulse * 22; context.shadowColor = `rgba(${theme.shadow}, ${0.45 + notePulse * 0.4})`; context.fill()
        if (notePulse > 0.9) {
          const sparkleSize = 2 + notePulse * 5
          context.strokeStyle = `rgba(${theme.particle}, ${notePulse * 0.7})`
          context.lineWidth = 1
          context.beginPath(); context.moveTo(x - sparkleSize, y); context.lineTo(x + sparkleSize, y); context.moveTo(x, y - sparkleSize); context.lineTo(x, y + sparkleSize); context.stroke()
        }
      })
    }

    resize()
    window.addEventListener('resize', resize)
    frameId = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(frameId); window.removeEventListener('resize', resize) }
  }, [style, variant])

  return <canvas ref={canvasRef} aria-hidden="true" className="ambient-canvas" />
}

export default function Home() {
  const playerContainerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YouTubePlayer | null>(null)
  const shouldPlayRef = useRef(true)
  const shouldUnmuteRef = useRef(true)
  const [playing, setPlaying] = useState(true)
  const [muted, setMuted] = useState(true)
  const [started, setStarted] = useState(false)
  const [visualStyle, setVisualStyle] = useState<VisualStyle>('nature')
  const [visualVariant, setVisualVariant] = useState<number | undefined>(0)

  useEffect(() => {
    const storageKey = 'lumen-visual-cycle-index'
    const savedIndex = Number.parseInt(localStorage.getItem(storageKey) ?? '0', 10)
    const index = Number.isFinite(savedIndex) ? savedIndex : 0
    const selection = visualCycle[index % visualCycle.length]
    setVisualStyle(selection.style)
    setVisualVariant(selection.variant)
    localStorage.setItem(storageKey, String((index + 1) % visualCycle.length))
  }, [])

  useEffect(() => {
    const createPlayer = () => {
      if (!window.YT || !playerContainerRef.current || playerRef.current) return
      playerRef.current = new window.YT.Player(playerContainerRef.current, {
        host: YOUTUBE_EMBED_HOST,
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
          autoplay: 1,
          controls: 0,
          loop: 1,
          playlist: YOUTUBE_VIDEO_ID,
          playsinline: 1,
          rel: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: ({ target }) => {
            playerRef.current = target
            if (shouldUnmuteRef.current) target.unMute()
            else target.mute()
            if (shouldPlayRef.current) target.playVideo()
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
  }, [])

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

  return (
    <main className={`experience style-${visualStyle}`}>
      <AmbientCanvas style={visualStyle} variant={visualVariant} />
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />
      <header className="topbar">
        <div className="brand"><span className="brand-mark" /> Lumen</div>
        <div className="status"><span className="status-dot" /> ambient session <span className="status-divider">/</span> 01</div>
      </header>

      <section className="hero">
        <p className="eyebrow">A little room for quiet</p>
        <h1>Let the day<br /><em>soften.</em></h1>
        <p className="intro">Slow light and gentle sound for the spaces between thoughts.</p>
        <button className="listen-button" onClick={beginListening} aria-label="Start listening">
          <span className="play-icon">{started ? '◌' : '▶'}</span>
          <span>{started ? 'Listening now' : 'Begin listening'}</span>
          <span className="button-arrow">↗</span>
        </button>
      </section>

      <div className="bottom-area">
        <div className="session-note"><span>Currently floating</span><strong>lofi hip hop radio</strong><small>beats to relax / study to</small></div>
        <div className="player glass-panel">
          <button className="control-button" onClick={togglePlaying} aria-label={playing ? 'Pause music' : 'Play music'}>{playing ? 'Ⅱ' : '▶'}</button>
          <div className="track-info"><div className="track-title"><span>Chill beats for a quiet mind</span><span className="live-label">LIVE</span></div><div className="waveform" aria-hidden="true">{Array.from({ length: 30 }, (_, i) => <i key={i} style={{ height: `${5 + ((i * 13) % 15)}px`, animationDelay: `${i * 0.08}s` }} />)}</div></div>
          <button className="sound-button" onClick={toggleMuted} aria-label={muted ? 'Unmute music' : 'Mute music'}>{muted ? '⌁' : '◖)'}</button>
        </div>
      </div>

      <div ref={playerContainerRef} aria-hidden="true" className="youtube-player" />
      {!started && <div className="autoplay-hint">Sound begins muted by your browser <span>·</span> tap above to open the room</div>}
    </main>
  )
}
