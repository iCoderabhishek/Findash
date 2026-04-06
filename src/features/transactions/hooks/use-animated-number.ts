import { useState, useEffect, useRef } from 'react'

export function useAnimatedNumber(target: number, duration = 600) {
  const [value, setValue] = useState(target)
  const prevRef = useRef(target)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (prevRef.current === target) return
    const from = prevRef.current
    prevRef.current = target
    const start = performance.now()

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setValue(from + (target - from) * eased)
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setValue(target)
      }
    }

    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [target, duration])

  return value
}
