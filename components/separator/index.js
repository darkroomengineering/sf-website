import cn from 'clsx'
import s from './separator.module.scss'

export function Separator({ className }) {
  return (
    <div className={cn(s.separator, className)}>
      <div className={s.icon} />
      <span className={s.line} />
      <div className={s.icon} />
    </div>
  )
}
