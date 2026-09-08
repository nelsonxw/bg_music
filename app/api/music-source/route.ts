import { NextResponse } from 'next/server'
import type { MusicSource } from '@/lib/types'

const SEARCH_TERMS = [
  'lofi chill beats',
  'ambient relaxing music',
  'soft piano music',
  'calm background music',
  'sleep music',
] as const

type YouTubeSearchResponse = {
  items?: Array<{
    id?: { videoId?: string }
    snippet?: { title?: string; channelTitle?: string }
  }>
}

function getRandomSearchTerm(): string {
  return SEARCH_TERMS[Math.floor(Math.random() * SEARCH_TERMS.length)]
}

function filterCandidates(items: YouTubeSearchResponse['items'], excludedVideoId: string | null) {
  return (items ?? []).filter((item) => {
    const videoId = item.id?.videoId
    return videoId && videoId !== excludedVideoId
  })
}

function selectRandomCandidate(candidates: YouTubeSearchResponse['items']): MusicSource | null {
  if (!candidates || candidates.length === 0) return null
  const selected = candidates[Math.floor(Math.random() * candidates.length)]
  if (!selected?.id?.videoId) return null
  return {
    videoId: selected.id.videoId,
    title: selected.snippet?.title ?? 'Relaxing background music',
    channelTitle: selected.snippet?.channelTitle ?? 'YouTube live stream',
  }
}

export async function GET(request: Request) {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'YOUTUBE_API_KEY is not configured.' }, { status: 500 })
  }

  const url = new URL(request.url)
  const excludedVideoId = url.searchParams.get('exclude')
  const query = getRandomSearchTerm()
  const searchParams = new URLSearchParams({
    key: apiKey,
    part: 'snippet',
    q: query,
    type: 'video',
    videoDuration: 'long',
    videoEmbeddable: 'true',
    safeSearch: 'strict',
    maxResults: '25',
    order: 'relevance',
  })

  try {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${searchParams}`, {
      next: { revalidate: 60 },
    })
    if (!response.ok) {
      return NextResponse.json({ error: 'YouTube search failed.' }, { status: response.status })
    }

    const data = (await response.json()) as YouTubeSearchResponse
    const candidates = filterCandidates(data.items, excludedVideoId)
    const selected = selectRandomCandidate(candidates)
    if (!selected) {
      return NextResponse.json({ error: 'No suitable music streams were found.' }, { status: 404 })
    }

    return NextResponse.json(selected)
  } catch (error) {
    console.error('YouTube API error:', error)
    return NextResponse.json({ error: 'Unable to reach YouTube.' }, { status: 502 })
  }
}
