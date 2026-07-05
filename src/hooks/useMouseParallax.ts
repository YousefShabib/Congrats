import { useEffect, useState } from 'react'

interface ParallaxOffset {
  x: number
  y: number
}

export function useMouseParallax(intensity = 0.02): ParallaxOffset {
  const [offset, setOffset] = useState<ParallaxOffset>({ x: 0, y: 0 })

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const x = (e.clientX - window.innerWidth / 2) * intensity
      const y = (e.clientY - window.innerHeight / 2) * intensity
      setOffset({ x, y })
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMove)
  }, [intensity])

  return offset
}
