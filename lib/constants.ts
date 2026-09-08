import type { VisualStyle, VisualSelection, VisualTheme, MusicSource } from './types'

export const DEFAULT_MUSIC_SOURCE: MusicSource = {
  videoId: 'fslL-sjPr5g',
  title: 'Chill beats for a quiet mind',
  channelTitle: 'lofi hip hop radio',
}

export const YOUTUBE_EMBED_HOST = 'https://www.youtube-nocookie.com'

export const VISUAL_CYCLE: VisualSelection[] = [
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

export const VISUAL_THEMES: Record<VisualStyle, VisualTheme> = {
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

export const STORAGE_KEY = 'lumen-visual-cycle-index'
