import * as RadixSelect from '@radix-ui/react-select'
import cn from 'clsx'
import dynamic from 'next/dynamic'
import { forwardRef, useState } from 'react'
import s from './select.module.scss'
const Chevron = dynamic(() => import('icons/chevron.svg'), { ssr: false })

export const Select = forwardRef(({ children, ...props }, forwardedRef) => {
  const [open, setOpen] = useState(false)

  return (
    <RadixSelect.Root
      {...props}
      onOpenChange={(value) => {
        setOpen(value)
      }}
    >
      <RadixSelect.Trigger className={s.trigger} ref={forwardedRef}>
        <RadixSelect.Value placeholder={props.placeholder} />
        <RadixSelect.Icon className={cn(s.icon, open && s.open)}>
          <Chevron />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        <RadixSelect.Content className={s.content}>
          <RadixSelect.Viewport className={s.viewport}>
            {children}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  )
})

Select.displayName = 'Select'

export const SelectItem = forwardRef(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <RadixSelect.Item
        className={cn(s.item, className)}
        {...props}
        ref={forwardedRef}
      >
        <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
      </RadixSelect.Item>
    )
  }
)

SelectItem.displayName = 'SelectItem'
