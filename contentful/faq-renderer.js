import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, INLINES } from '@contentful/rich-text-types'
import { Link } from '@studio-freight/compono'
import cn from 'clsx'
import s from './renderer.module.scss'

export const renderer = ({ json }) => {
  const document = json

  const options = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: function p(node, children) {
        return <p className="p">{children}</p>
      },
      [INLINES.HYPERLINK]: function hyperlink(node, children) {
        return (
          <Link href={node.data.uri} className={cn(s.link, 'decorate')}>
            {children}
          </Link>
        )
      },
    },
  }

  return documentToReactComponents(document, options)
}
