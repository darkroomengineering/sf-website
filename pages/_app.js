import { RealViewport } from '@studio-freight/compono'
import { useLenis } from '@studio-freight/react-lenis'
import Tempus from '@studio-freight/tempus'
import { Analytics } from '@vercel/analytics/react'
import 'blaze-slider/dist/blaze.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { useStore } from 'lib/store'
// import { ProjectProvider, RafDriverProvider } from 'lib/theatre'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import 'styles/global.scss'

const Noise = dynamic(
  () => import('components/noise').then(({ Noise }) => Noise),
  {
    ssr: false,
  },
)

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
  ScrollTrigger.defaults({ markers: process.env.NODE_ENV === 'development' })

  // merge rafs
  gsap.ticker.lagSmoothing(0)
  gsap.ticker.remove(gsap.updateRoot)
  Tempus.add((time) => {
    gsap.updateRoot(time / 1000)
  }, 0)

  // reset scroll position
  window.scrollTo(0, 0)
  window.history.scrollRestoration = 'manual'

  window.CREDIT_ME = {
    id: location.hostname,
    url: 'https://studiofreight.com',
    credits: [
      {
        name: 'Studio Freight',
        email: 'hello@studiofreight.com',
        website: 'https://studiofreight.com',
      },
    ],
  }
}

function MyApp({ Component, pageProps }) {
  const overflow = useStore(({ overflow }) => overflow)
  const lenis = useLenis(ScrollTrigger.update)
  useEffect(ScrollTrigger.refresh, [lenis])

  useEffect(() => {
    if (overflow) {
      lenis?.start()
      document.documentElement.style.removeProperty('overflow')
    } else {
      lenis?.stop()
      document.documentElement.style.setProperty('overflow', 'hidden')
    }
  }, [lenis, overflow])

  return (
    <>
      {/* <PageTransition /> */}
      <RealViewport />
      <Noise />
      {/* <ProjectProvider
        id="Satus"
        config="/config/Satus-2023-04-17T12_55_21.json"
      >
        <RafDriverProvider id="default"> */}
      <Component {...pageProps} />
      {/* </RafDriverProvider>
      </ProjectProvider> */}
      <Analytics />
    </>
  )
}

export default MyApp
