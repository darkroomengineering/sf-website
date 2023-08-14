import * as Accordion from '@radix-ui/react-accordion'
import cn from 'clsx'
import { Hubspot } from 'components/hubspot'
import { ScrollableBox } from 'components/scrollable-box'
import { Separator } from 'components/separator'
import { renderer } from 'contentful/faq-renderer'
import { renderer as globalRenderer } from 'contentful/renderer'
import { slugify } from 'lib/slugify'
import { useStore } from 'lib/store'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import s from './contact-form.module.scss'

export function ContactForm({ data }) {
  const menuRef = useRef(null)
  const router = useRouter()
  const { contact } = router.query
  const [contactIsOpen, setContactIsOpen, showThanks, setShowThanks] = useStore(
    (state) => [
      state.contactIsOpen,
      state.setContactIsOpen,
      state.showThanks,
      state.setShowThanks,
    ],
  )

  const closeContactTab = () => {
    setContactIsOpen(false)
    router.push({
      pathname: router.pathname, // not router.asPath
      query: { confirm: true },
      shallow: true,
    })
    if (showThanks) setShowThanks(false)
  }

  useEffect(() => {
    const escFunction = (event) => {
      if (event.keyCode === 27) {
        closeContactTab()
      }
    }

    document.addEventListener('keydown', escFunction, false)
    return () => document.removeEventListener('keydown', escFunction, false)
  }, [])

  useEffect(() => {
    setContactIsOpen(contact)
  }, [contact])

  return (
    <div className={cn(s.container, contactIsOpen && s.open)}>
      <div className={s.overlay} onClick={closeContactTab} />
      <div className={cn(s.wrapper, contactIsOpen && s.open)} ref={menuRef}>
        <div className={s.heading}>
          <button className={cn('button', s.cta)} onClick={closeContactTab}>
            close
          </button>
          <Separator className={s.separator} />
        </div>
        {showThanks ? (
          <ScrollableBox className={s.scrollable} shadow={false}>
            <div className={s.content}>
              {globalRenderer(data.thankYouMessage)}
            </div>
          </ScrollableBox>
        ) : (
          <ScrollableBox className={s.scrollable} shadow={false}>
            <div className={s.content}>{globalRenderer(data.description)}</div>
            <Hubspot {...data.form} className={s.form}>
              {({ ...helpers }) => (
                <Hubspot.Form className={s.form} {...helpers} />
              )}
            </Hubspot>
            <div className={s.accordion}>
              <p className="p text-uppercase text-bold text-muted">FAQ</p>
              <Accordion.Root
                type="single"
                className={s['accordion-root']}
                collapsible
              >
                {data.faqsCollection.items.map((faq, i) => (
                  <Accordion.Item
                    value={slugify(faq.title)}
                    key={i}
                    className={s.item}
                  >
                    <Accordion.Header>
                      <Accordion.Trigger className={s.trigger}>
                        <p className="p text-bold text-uppercase">
                          {faq.title}
                        </p>
                        <svg
                          className={s.icon}
                          viewBox="0 0 26 26"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M11 1H1V11" stroke="#00FF6A" />
                          <path d="M15 1H25V11" stroke="#00FF6A" />
                          <path d="M15 25L25 25L25 15" stroke="#00FF6A" />
                          <path d="M11 25L1 25L1 15" stroke="#00FF6A" />
                          <g className={s.x}>
                            <path
                              d="M8.75684 8.75745L17.2421 17.2427"
                              stroke="#00FF6A"
                            />
                            <path
                              d="M17.2422 8.75745L8.75691 17.2427"
                              stroke="#00FF6A"
                            />
                          </g>
                        </svg>
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content className={s['accordion-content']}>
                      {renderer(faq.content)}
                    </Accordion.Content>
                  </Accordion.Item>
                ))}
              </Accordion.Root>
            </div>
          </ScrollableBox>
        )}
      </div>
    </div>
  )
}
