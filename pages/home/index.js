import { Link } from '@studio-freight/compono'
import { useMediaQuery } from '@studio-freight/hamo'
import va from '@vercel/analytics'
import cn from 'clsx'
import { ComposableImage } from 'components/composable-image'
import { ClientOnly } from 'components/isomorphic'
import { LayoutMobile } from 'components/layout-mobile'
import { ScrollableBox } from 'components/scrollable-box'
import { renderer } from 'contentful/renderer'
import { Layout } from 'layouts/default'
import { slugify } from 'lib/slugify'
import { useStore } from 'lib/store'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import s from './home.module.scss'

const Arrow = dynamic(() => import('icons/arrow.svg'), { ssr: false })

const Gallery = dynamic(
  () => import('components/gallery').then(({ Gallery }) => Gallery),
  {
    ssr: false,
  },
)

export default function Home({ studioFreight, footer, contact, projects }) {
  const router = useRouter()

  const [showInfoModal, setShowInfoModal] = useState(false)
  const [resetScroll, setResetScroll] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 800px)')
  const [selectedProject, setSelectedProject] = useStore((state) => [
    state.selectedProject,
    state.setSelectedProject,
  ])
  const [setGalleryVisible] = useStore((state) => [state.setGalleryVisible])

  useEffect(() => {
    const searchTerm = router.asPath.substring(router.asPath.indexOf('#') + 1)

    const matchingItem = projects.items.find((item) =>
      slugify(item.name).includes(searchTerm),
    )

    setSelectedProject(matchingItem || projects.items[0])
  }, [router.asPath])

  useEffect(() => {
    if (selectedProject) {
      setResetScroll(true)
      setTimeout(() => {
        setResetScroll(false)
      }, 100)
    }
  }, [selectedProject])

  return (
    <Layout
      theme="dark"
      principles={studioFreight.principles}
      studioInfo={{
        phone: studioFreight.phoneNumber,
        email: studioFreight.email,
      }}
      contactData={contact}
      footerLinks={footer.linksCollection.items}
    >
      {!isDesktop ? (
        <LayoutMobile studioFreight={studioFreight} projects={projects} />
      ) : (
        <ClientOnly>
          <div className={cn(s.content, 'layout-grid')}>
            <section className={s.about}>
              <p
                className={cn(s.title, 'p text-bold text-uppercase text-muted')}
              >
                About
              </p>
              <ScrollableBox className={s.description}>
                {renderer(studioFreight.about)}
              </ScrollableBox>
            </section>
            <section className={s.projects}>
              <p
                className={cn(s.title, 'p text-bold text-uppercase text-muted')}
              >
                Projects
              </p>
              <ScrollableBox className={s.list}>
                <ul>
                  {projects.items.map((project) => (
                    <li
                      key={project.sys.id}
                      className={cn(
                        selectedProject?.sys?.id === project.sys.id && s.active,
                        s['list-item'],
                      )}
                    >
                      <button
                        onClick={() => {
                          va.track('Selected:', {
                            project: project.name,
                          })
                          setSelectedProject(project)
                        }}
                      >
                        <p className="p text-bold text-uppercase">
                          {project.name}
                        </p>
                        <p className="p-xs text-uppercase">
                          {project.industry}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              </ScrollableBox>
            </section>
            <section className={s['project-details']}>
              <div className={s.heading}>
                <p
                  className={cn(
                    s.title,
                    'p text-bold text-uppercase text-muted',
                  )}
                >
                  Project detail
                </p>
                <div className={s.actions}>
                  <button
                    className="p-s decorate"
                    onClick={() => {
                      va.track('Read info:', {
                        project: selectedProject.name,
                      })
                      setShowInfoModal(!showInfoModal)
                    }}
                  >
                    {showInfoModal ? 'close' : 'info'}
                  </button>
                  {selectedProject?.link && (
                    <Link
                      href={selectedProject?.link}
                      className={cn('p-s decorate', s.external)}
                    >
                      site
                      <Arrow className={s.arrow} />
                    </Link>
                  )}
                </div>
              </div>
              <div className={s['details-content']}>
                <div className={cn(s.images, !showInfoModal && s.visible)}>
                  <button
                    className={cn(s['modal-trigger'], 'p-s')}
                    onClick={() => {
                      va.track('Opened Gallery:', {
                        project: selectedProject.name,
                      })
                      setGalleryVisible(true)
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 26 26"
                    >
                      <path
                        stroke="var(--green)"
                        d="M11 1H1v10M15 1h10v10M15 25h10V15M11 25H1V15m12-8v12m6-6H7"
                      />
                    </svg>
                    Enlarge
                  </button>
                  <ScrollableBox reset={showInfoModal || resetScroll}>
                    {selectedProject?.assetsCollection?.items.map(
                      (asset, i) => (
                        <button
                          className={s.assetButton}
                          key={i}
                          onClick={() => {
                            va.track('Opened Gallery:', {
                              project: selectedProject.name,
                            })
                            setGalleryVisible(true)
                          }}
                        >
                          <ComposableImage
                            sources={asset.imagesCollection}
                            priority={i === 0}
                            width={1026}
                            height={604}
                          />
                        </button>
                      ),
                    )}
                  </ScrollableBox>
                </div>
                <ScrollableBox
                  className={cn(s.info, showInfoModal && s.visible)}
                  reset={!showInfoModal || resetScroll}
                >
                  {selectedProject.body && (
                    <div className={s.description}>
                      {renderer(selectedProject.body)}
                    </div>
                  )}
                  {selectedProject.testimonial && (
                    <div className={s.testimonial}>
                      <p
                        className={cn(
                          s.title,
                          'p text-muted text-uppercase text-bold',
                        )}
                      >
                        Testimonial
                      </p>
                      <p className="p">{selectedProject.testimonial}</p>
                    </div>
                  )}
                  {selectedProject?.services?.length > 0 && (
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
                        {selectedProject?.services?.map((service, i) =>
                          i === selectedProject.services.length - 1
                            ? service
                            : `${service}, `,
                        )}
                      </p>
                    </div>
                  )}
                  {selectedProject?.stack?.length > 0 && (
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
                        {selectedProject?.stack?.map((item, i) =>
                          i === selectedProject.stack.length - 1
                            ? item
                            : `${item}, `,
                        )}
                      </p>
                    </div>
                  )}
                </ScrollableBox>
              </div>
            </section>
          </div>
        </ClientOnly>
      )}

      <Gallery />
    </Layout>
  )
}

export async function getStaticProps({ preview = false }) {
  // const [{ studioFreight }, { footer }, { contact }, { projectList }] =
  //   await Promise.all([
  //     fetchCmsQuery(studioFreightEntryQuery, {
  //       preview,
  //     }),
  //     fetchCmsQuery(footerEntryQuery, {
  //       preview,
  //     }),
  //     fetchCmsQuery(contactEntryQuery, {
  //       preview,
  //     }),
  //     fetchCmsQuery(projectListEntryQuery, {
  //       preview,
  //     }),
  //   ])

  // contact.form = await getForm(contact.form)
  console.log('studioFreight', preview)

  return {
    props: {
      studioFreight: {
        about: {
          nodeType: 'document',
          content: [
            {
              nodeType: 'paragraph',
              content: [
                {
                  nodeType: 'text',
                  value: 'Hello',
                  marks: [{ type: 'bold' }],
                },
                {
                  nodeType: 'text',
                  value: ' world!',
                  marks: [{ type: 'italic' }],
                },
              ],
            },
          ],
        },
        email: 'wdqwdwq',
        phoneNumber: 'dqdqwdq',
        principles: ['@3', '23', '23', '23'],
      },
      footer: {
        linksCollection: {
          items: [{ text: 'dwdw', url: 'dwdw' }],
        },
      },
      contact: {
        form: {
          portalId: 'dqwdqwdwqdqw',
          form: {
            portalId: 'dqwdqwdwqdqw',
            id: 'dwdw',
            submitButton: {
              text: 'dewdeqwdqw',
            },
            inputs: [{ name: 'dwdw', type: 'dwdw' }],
          },
          fields: [{ name: 'dwdw', type: 'dwdw', portalId: 'dqwdqwdwqdqw' }],
          action: 'dwdw',
        },
        description: 'dwdw',
        thankYouMessage: 'dwdw',
        body: 'dwdw',
        faqsCollection: {
          items: [{ title: 'dwdw', body: 'dwdw', content: 'wdwdqdq' }],
          form: {
            fields: [{ name: 'dwdw', type: 'dwdw' }],
            action: 'dwdw',
            portalId: 'Dqdqwdqw',
            id: 'dwdw',
            inputs: [{ name: 'dwdw', type: 'dwdw' }],
          },
        },
      },
      projects: {
        items: [
          {
            name: 'Path Robotics 4A',
            industry: 'Manufacturing',
            link: 'dwdw',
            sys: {
              id: 'wdqdwq',
            },
            assetsCollection: {
              items: [
                {
                  imagesCollection: {
                    items: [
                      {
                        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtnvAOajH9gS4C30cRF7rD_voaTAKly2Ntaw&s',
                      },
                    ],
                  },
                  services: ['dwdw'],
                  stack: ['dwdw'],
                  testimonial: 'dwdw',
                  body: 'dwdw',
                },
              ],
            },
          },
          {
            name: 'Path Robotics 2A',
            industry: 'Manufacturing2',
            link: 'dwdw',
            sys: {
              id: 'dq;ldmqw;ldqw',
            },
            assetsCollection: {
              items: [
                {
                  imagesCollection: {
                    items: [
                      {
                        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtnvAOajH9gS4C30cRF7rD_voaTAKly2Ntaw&s',
                      },
                    ],
                  },
                  services: ['dwdw'],
                  stack: ['dwdw'],
                  testimonial: 'dwdw',
                  body: 'dwdw',
                },
              ],
            },
          },
        ],
      },
      id: 'home',
    },
    revalidate: 30,
  }
}
