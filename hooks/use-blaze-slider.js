import BlazeSlider from 'blaze-slider'
import { useEffect, useRef } from 'react'

export function useBlazeSlider(config) {
  const sliderRef = useRef()
  const elRef = useRef()

  useEffect(() => {
    // if not already initialized
    if (!sliderRef.current) {
      sliderRef.current = new BlazeSlider(elRef.current, config)
    }
  }, [])

  return elRef
}
