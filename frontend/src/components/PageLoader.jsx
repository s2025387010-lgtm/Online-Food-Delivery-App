import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

export default function PageLoader() {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const location = useLocation()
  const timers = useRef([])

  const clearTimers = () => timers.current.forEach(clearTimeout)

  useEffect(() => {
    clearTimers()
    setVisible(true)
    setProgress(5)

    timers.current = [
      setTimeout(() => setProgress(30), 80),
      setTimeout(() => setProgress(65), 250),
      setTimeout(() => setProgress(85), 500),
      setTimeout(() => setProgress(100), 800),
      setTimeout(() => setVisible(false), 1050),
    ]

    return clearTimers
  }, [location.pathname, location.search])

  if (!visible) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] h-[3px] pointer-events-none">
      <div
        className="h-full bg-orange-500 transition-all ease-out rounded-r-full"
        style={{
          width: `${progress}%`,
          transitionDuration: progress === 100 ? '150ms' : '350ms',
          boxShadow: '0 0 10px 1px rgba(249,115,22,0.6)',
        }}
      />
    </div>
  )
}
