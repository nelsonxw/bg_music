import { useEffect, useState } from 'react'
import type { VisualStyle } from '@/lib/types'
import { VISUAL_CYCLE, STORAGE_KEY } from '@/lib/constants'

export function useVisualCycle() {
  const [visualStyle, setVisualStyle] = useState<VisualStyle>('nature')
  const [visualVariant, setVisualVariant] = useState<number | undefined>(0)

  useEffect(() => {
    const savedIndex = Number.parseInt(localStorage.getItem(STORAGE_KEY) ?? '0', 10)
    const index = Number.isFinite(savedIndex) ? savedIndex : 0
    const selection = VISUAL_CYCLE[index % VISUAL_CYCLE.length]
    setVisualStyle(selection.style)
    setVisualVariant(selection.variant)
    localStorage.setItem(STORAGE_KEY, String((index + 1) % VISUAL_CYCLE.length))
  }, [])

  return { visualStyle, visualVariant }
}
