import * as Accordion from '@radix-ui/react-accordion'
import { Link } from '@studio-freight/compono'
import cn from 'clsx'
import { ComposableImage } from 'components/composable-image'
import Slider from 'components/slider'
import { renderer } from 'contentful/renderer'
import { slugify } from 'lib/slugify'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import s from './project-accordion.module.scss'

const Arrow = dynamic(() => import('icons/arrow.svg'), { ssr: false })

export const ProjectAccordion = ({ data }) => {
  const [active, setActive] = useState(0)

  return (
    <div className={s.accordion}>
      <p className="p text-bold text-uppercase text-muted">Projects</p>

      <Accordion.Root type="single" className={s['accordion-root']} collapsible>
        {data.map((item, i) => (
          <Accordion.Item value={slugify(item.name)} key={i} className={s.item}>
            <Accordion.Header asChild>
              <Accordion.Trigger
                onClick={() => {
                  setActive(active === i ? false : i)
                }}
                className={s.trigger}
              >
                <p>{item.name}</p>
                <div className={s.category}>
                  <span className="p-s">{item.industry}</span>
                  <svg
                    className={s.icon}
                    viewBox="0 0 26 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M11 1H1V11" stroke="var(--green)" />
                    <path d="M15 1H25V11" stroke="var(--green)" />
                    <path d="M15 25L25 25L25 15" stroke="var(--green)" />
                    <path d="M11 25L1 25L1 15" stroke="var(--green)" />
                    <g className={s.x}>
                      <path
                        d="M8.75684 8.75745L17.2421 17.2427"
                        stroke="var(--green)"
                      />
                      <path
                        d="M17.2422 8.75745L8.75691 17.2427"
                        stroke="var(--green)"
                      />
                    </g>
                  </svg>
                </div>
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className={s['accordion-content']}>
              <Slider enableAutoplay={!!active} className={s.slides}>
                {item.assetsCollection.items.map((asset, i) => (
                  <ComposableImage
                    sources={asset.imagesCollection}
                    key={i}
                    width={343}
                    height={211}
                    small
                  />
                ))}
              </Slider>
              {item?.link && (
                <Link href={item?.link} className={cn('p-s', s.external)}>
                  site
                  <Arrow className={s.arrow} />
                </Link>
              )}
              {item.body && (
                <div className={s.description}>{renderer(item.body)}</div>
              )}
              {item.testimonial && (
                <div className={s.testimonial}>
                  <p
                    className={cn(
                      s.title,
                      'p text-muted text-uppercase text-bold',
                    )}
                  >
                    Testimonial
                  </p>
                  <p className="p">{item.testimonial}</p>
                </div>
              )}

              <div className={s.info}>
                {item?.services?.length > 0 && (
                  <div className={s.services}>
                    <p
                      className={cn(
                        s.title,
                        'p text-muted text-uppercase text-bold',
                      )}
                    >
                      Services
                    </p>
                    <p className="p-s text-uppercase">
                      {item?.services?.map((service, i) =>
                        i === item.services.length - 1
                          ? service
                          : `${service}, `,
                      )}
                    </p>
                  </div>
                )}
                {item?.stack?.length > 0 && (
                  <div className={s.stack}>
                    <p
                      className={cn(
                        s.title,
                        'p text-muted text-uppercase text-bold',
                      )}
                    >
                      Stack
                    </p>
                    <p className="p-s text-uppercase">
                      {item?.stack?.map((stack, i) =>
                        i === item.stack.length - 1 ? stack : `${stack}, `,
                      )}
                    </p>
                  </div>
                )}
              </div>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  )
}
