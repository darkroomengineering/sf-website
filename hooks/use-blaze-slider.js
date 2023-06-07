import BlazeSlider from 'blaze-slider'
import React from 'react'

export function useBlazeSlider(config) {
  const sliderRef = React.useRef()
  const elRef = React.useRef()

  React.useEffect(() => {
    // if not already initialized
    if (!sliderRef.current) {
      sliderRef.current = new BlazeSlider(elRef.current, config)
    }
  }, [])

  return elRef
}
