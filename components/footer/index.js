import { Image, Link } from '@studio-freight/compono'
import { useMediaQuery } from '@studio-freight/hamo'
import va from '@vercel/analytics'
import cn from 'clsx'
import { Separator } from 'components/separator'
import s from './footer.module.scss'

export function Footer({ className, style, links, studioInfo }) {
  const isMobile = useMediaQuery('(max-width: 800px)')

  return (
    <footer className={s.container}>
      <Separator className="layout-block" />
      <div className={cn(s.footer, 'layout-grid', className)} style={style}>
        <a
          href="/StudioFreight-Capabilities.pdf"
          download
          className={cn(s.column, 'p-s text-accent')}
          onClick={() => va.track('Downloaded Capabilities deck')}
        >
          Capabilities Deck ↓
        </a>
        {isMobile === false && (
          <>
            <ul className={s.column}>
              {links.slice(0, 2).map((link, i) => (
                <li key={i}>
                  <Link className="p-s decorate" href={link.url}>
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className={s.column}>
              {links.slice(2, 4).map((link, i) => (
                <li key={i}>
                  <Link className="p-s decorate" href={link.url}>
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className={s.column}>
              {links.slice(4, 6).map((link, i) => (
                <li key={i}>
                  <Link className="p-s decorate" href={link.url}>
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        {isMobile === true && (
          <>
            <ul className={s.column}>
              <li className="p-s text-muted">
                &copy; {new Date().getFullYear()}
              </li>
            </ul>
            <ul className={s.column}>
              {links.slice(0, 3).map((link, i) => (
                <li key={i}>
                  <Link className="p-s decorate" href={link.url}>
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className={s.column}>
              {links.slice(3, 6).map((link, i) => (
                <li key={i}>
                  <Link className="p-s decorate" href={link.url}>
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        <ul className={s.column}>
          <li>
            <Link className="p-s decorate" href={`tel:${studioInfo.phone}`}>
              P: {studioInfo.phone}
            </Link>
          </li>
          <li>
            <Link className="p-s decorate" href={`mailto:${studioInfo.email}`}>
              E: {studioInfo.email}
            </Link>
          </li>
        </ul>

        {isMobile === false && (
          <ul className={s.column}>
            <li className="p-s text-muted">
              &copy; {new Date().getFullYear()}
            </li>
          </ul>
        )}
      </div>

      {isMobile === true && (
        <section className={s['footer-image']}>
          <Image
            src="/mobile-temp-images/footer.png"
            alt="studio freight"
            fill
            className={s.image}
          />
        </section>
      )}
    </footer>
  )
}
