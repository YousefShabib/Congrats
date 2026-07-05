import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'congrats-sound-enabled'

function playTone(frequency: number, duration: number, volume = 0.04) {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = frequency
    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + duration)
    setTimeout(() => ctx.close(), (duration + 0.1) * 1000)
  } catch {
    // Audio not available
  }
}

export function useSoundSettings() {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(STORAGE_KEY) === 'true'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(enabled))
  }, [enabled])

  const toggle = useCallback(() => setEnabled((v) => !v), [])

  const playClick = useCallback(() => {
    if (!enabled) return
    playTone(520, 0.08, 0.03)
  }, [enabled])

  const playSuccess = useCallback(() => {
    if (!enabled) return
    playTone(660, 0.12, 0.035)
    setTimeout(() => playTone(880, 0.15, 0.03), 90)
  }, [enabled])

  return { enabled, toggle, playClick, playSuccess }
}
