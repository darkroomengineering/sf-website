import { useFrame } from '@studio-freight/hamo'
import { useEffect, useMemo, useRef } from 'react'
import { useWindowSize } from 'react-use'
import s from './noise.module.scss'

export function Noise() {
  const el = useRef()

  const { width: windowWidth, height: windowHeight } = useWindowSize()
  const canvas = useMemo(() => document.createElement('canvas'), [])
  const buffer = useMemo(() => document.createElement('canvas'), [])
  const context = useMemo(() => canvas.getContext('2d'), [])

  useEffect(() => {
    el.current.appendChild(canvas)

    return () => {
      canvas.remove()
    }
  }, [canvas])

  useEffect(() => {
    const dpr = Math.min(window.devicePixelRatio, 2)
    const width = windowWidth
    const height = windowHeight

    canvas.width = width
    canvas.height = height

    const image = context.createImageData(width * dpr, height * dpr)
    const buffer32 = new Uint32Array(image.data.buffer)

    for (let i = 0; i < buffer32.length; i++) {
      if (Math.random() < 0.5) buffer32[i] = 0xffffffff
    }

    buffer.width = width
    buffer.height = height
    buffer.getContext('2d').putImageData(image, 0, 0)

    // setImage(image)
  }, [buffer, windowWidth, windowHeight])

  useFrame(() => {
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.drawImage(
      buffer,
      -Math.random() * 200,
      -Math.random() * 200,
      canvas.width + 200,
      canvas.height + 200
    )
  })

  return <div ref={el} className={s.canvas} />
}
