import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, INLINES } from '@contentful/rich-text-types'
import { Link } from '@studio-freight/compono'
import cn from 'clsx'
import s from './renderer.module.scss'

export const renderer = ({ json }) => {
  const document = json

  const options = {
    renderNode: {
      [BLOCKS.HEADING_1]: function p(node, children) {
        return (
          <h2 className={cn('p text-uppercase text-muted text-bold', s.row)}>
            {children}
          </h2>
        )
      },
      [BLOCKS.PARAGRAPH]: function p(node, children) {
        return <p className={cn('p', s.row)}>{children}</p>
      },
      [BLOCKS.UL_LIST]: function ul(node, children) {
        return <ul className={cn('p', s.row)}>{children}</ul>
      },
      [BLOCKS.LIST_ITEM]: function li(node, children) {
        return <li className={cn('p', s.item)}>{children}</li>
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
