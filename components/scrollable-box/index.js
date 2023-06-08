import { useFrame } from '@studio-freight/hamo'
import Lenis from '@studio-freight/lenis'
import cn from 'clsx'
import { useEffect, useRef, useState } from 'react'
import s from './scrollable-box.module.scss'

export function ScrollableBox({ children, className, infinite, reset }) {
  const [lenis, setLenis] = useState()
  const wrapperRef = useRef()
  const contentRef = useRef()

  useEffect(() => {
    const lenis = new Lenis({
      wrapper: wrapperRef.current, // element which has overflow
      content: contentRef.current, // usually wrapper's direct child
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      infinite,
    })
    lenis.start()
    setLenis(lenis)

    return () => {
      lenis.destroy()
    }
  }, [])

  useFrame((time) => {
    lenis?.raf(time)
  }, [])

  useEffect(() => {
    if (reset) {
      lenis?.scrollTo(0, { immediate: true })
    }
  }, [reset])

  return (
    <div className={cn(s.hi, className)} ref={wrapperRef}>
      <div ref={contentRef}>{children}</div>
    </div>
  )
}
