import type { FunctionComponent as FC } from 'preact'
import { h } from 'preact'
import { memo } from 'preact/compat'
import { useRef, useEffect, useMemo } from 'preact/hooks'
import cn from 'classnames'

import { checkIsIOS } from '~/tools/detect-device'
import type { Props as MenuProps } from '~/ui/elements/menu'
import { Menu } from '~/ui/elements/menu'
import { Loader } from '~/ui/elements/loader'
import { Icon } from '~/ui/elements/icon'
import { getColor, animationClassName } from '~/ui/styles'

import styles from './sidebar-item.styl'

type Props = {
  title: string
  description: string
  emptyDescription: string
  index?: number
  menu?: MenuProps | null
  disabled?: boolean
  loading?: boolean
  group?: boolean
  grouped?: boolean
  expanded?: boolean
  toggling?: boolean
  onClick?: () => void
}

export const SidebarItem: FC<Props> = memo(({
  title,
  description,
  emptyDescription,
  index,
  menu,
  disabled,
  loading,
  group,
  grouped,
  expanded,
  toggling,
  onClick
}) => {
  const elRef = useRef<HTMLDivElement>(null)
  const innerElRef = useRef<HTMLDivElement>(null)
  const color = getColor(index)
  const isPerformance = useMemo(() => checkIsIOS(), [])

  useEffect(() => {
    if (!grouped || !expanded) return

    const animation = innerElRef.current?.animate?.([
      { opacity: 0, zIndex: -1, maxHeight: '0', transform: 'translateY(-64px)' },
      { opacity: 0, zIndex: -1, offset: 0.7 },
      { opacity: 0.5, zIndex: 3, offset: 0.9 },
      { zIndex: 3, offset: 0.99 },
      { opacity: 1, zIndex: 4, maxHeight: '65px', transform: 'translateY(0)' }
    ], {
      duration: 200,
      fill: 'forwards',
      easing: 'ease-out'
    })

    return () => animation?.reverse()
  }, [grouped, expanded])

  return (
    <div
      class={cn(
        styles.root,
        disabled && styles._disabled,
        group && styles._group,
        grouped && styles._grouped,
        expanded && styles._expanded,
        toggling && styles._toggling
      )}
      ref={elRef}
      onClick={onClick}
    >
      <div
        class={cn(
          styles.inner,
          styles[animationClassName],
          isPerformance && styles._performance,
        )}
        ref={innerElRef}
      >
        <div
          class={styles.icon}
          style={{ borderColor: color, color }}
        >
          <Icon icon="folder" style={{ fill: color }}/>
        </div>
        <div class={styles.content}>
          <div class={styles.title}>
            {title}
          </div>
          {(description || emptyDescription) && (
            <div class={styles.description}>
              {description || emptyDescription}
            </div>
          )}
        </div>
      </div>
      {(menu && !disabled && !loading) && (
        <Menu
          {...menu}
          class={styles.menu}
          parentRef={elRef}
          withEvent
        />
      )}
      {loading && (
        <Loader class={styles.loader} grey/>
      )}
    </div>
  )
})
