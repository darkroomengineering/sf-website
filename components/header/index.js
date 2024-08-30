import { Link, Marquee } from '@studio-freight/compono'
import { useMediaQuery } from '@studio-freight/hamo'
import va from '@vercel/analytics'
import cn from 'clsx'
import { ContactForm } from 'components/header/contact-form'
import { Separator } from 'components/separator'
import { pad } from 'lib/maths'
import { useStore } from 'lib/store'
import dynamic from 'next/dynamic'
import s from './header.module.scss'

const SFLogo = dynamic(() => import('icons/sf-logo.svg'), { ssr: false })
const SFLogoMobile = dynamic(() => import('icons/sf-logo-mobile.svg'), {
  ssr: false,
})
const Stard = dynamic(() => import('icons/stard.svg'), { ssr: false })
const Monogram = dynamic(() => import('icons/sf-monogram.svg'), { ssr: false })
const StarDuotone = dynamic(() => import('icons/star-duotone.svg'), {
  ssr: false,
})

export const Header = ({ principles = [], contact }) => {
  const isMobile = useMediaQuery('(max-width: 800px)')

  // const visible = usePageAppear()
  const [contactIsOpen, setContactIsOpen] = useStore((state) => [
    state.contactIsOpen,
    state.setContactIsOpen,
  ])

  return (
    <header className={cn(s.container, 'layout-block')}>
      <div className={cn(s.top, 'layout-grid')}>
        <div className={s.eggs}>
          <Link
            name="easter egg"
            className={s.egg}
            href="https://github.com/studio-freight/sf-website"
          >
            <Stard />
          </Link>
          <Link
            name="easter egg - soundboard"
            className={s.egg}
            href="https://soundboard.studiofreight.com"
          >
            <Monogram />
          </Link>
          <Link
            name="easter egg - pale blue dot"
            className={s.egg}
            href="https://youtu.be/GO5FwsblpT8"
          >
            <StarDuotone />
          </Link>
        </div>
        {isMobile === false && (
          <Marquee className={s.marquee} duration={20}>
            {principles.map((principle, i) => (
              <p key={i} className={cn('p', s.principle)}>
                <span>{pad(i + 1)}</span>
                &nbsp;{principle}
                <span className={s.separator}>{'//'}</span>
              </p>
            ))}
          </Marquee>
        )}
        <button
          className={cn('button', s.cta)}
          onClick={() => {
            va.track('Opened Contact Form')
            setContactIsOpen(!contactIsOpen)
          }}
        >
          Contact
        </button>
      </div>
      <Separator />
      <div className={cn(s.header, 'layout-grid')}>
        {isMobile === true ? (
          <SFLogoMobile className={s.title} />
        ) : (
          <SFLogo className={s.title} />
        )}
      </div>
      <Separator />

      {isMobile === true && (
        <Marquee className={s.marquee} duration={20}>
          {principles.map((principle, i) => (
            <p key={i} className={cn('p', s.principle)}>
              <span>{pad(i + 1)}</span>
              &nbsp;{principle}
              <span className={s.separator}>{'//'}</span>
            </p>
          ))}
        </Marquee>
      )}
      <ContactForm data={contact} />
    </header>
  )
}
