import type { FunctionComponent as FC, RefObject } from 'preact'
import { h } from 'preact'
import { memo, createPortal } from 'preact/compat'
import { useEffect } from 'preact/hooks'
import cn from 'classnames'
import KeenSlider from 'keen-slider'
import 'keen-slider/keen-slider.css'

import { useStateRef, useUpdatableRef } from '~/tools/hooks'
import { Slide, useSlide } from '~/ui/elements/slide'
import { Button } from '~/ui/elements/button'
import { Text } from '~/ui/elements/text'

import styles from './gallery.styl'

type Props = {
  initialIndex: number
  currentIndex: number
  currentName?: string
  size: number
  galleryRef: RefObject<HTMLDivElement>
  isFullscreen?: boolean
  isFakeFullscreen?: boolean
  onChangeIndex: (index: number) => void
  onClose: () => void
}

const bodyEl = self.document.body

export const Gallery: FC<Props> = memo(({
  children,
  initialIndex,
  currentIndex,
  currentName,
  size,
  galleryRef,
  isFullscreen,
  isFakeFullscreen,
  onChangeIndex,
  onClose
}) => {
  const { closeSlide, closeSlideRef } = useSlide()
  const [gallery, _setGallery, _galleryRef, setGalleryRef] = useStateRef<any>(null)
  const initialIndexRef = useUpdatableRef(initialIndex)
  const onChangeIndexRef = useUpdatableRef(onChangeIndex)

  useEffect(() => {
    if (!galleryRef.current) return

    const initialIndex = initialIndexRef.current || 0
    const closeSlide = () => closeSlideRef.current?.()
    const onChangeIndex = (index: number) => onChangeIndexRef.current?.(index)

    const gallery = new KeenSlider(galleryRef.current, {
      renderMode: 'performance',
      initial: initialIndex,
      slideChanged: slider => onChangeIndex(slider.track.details.rel)
    })

    const handleKeyDown = ev => {
      if (ev.defaultPrevented) return
      switch(ev.key) {
        case 'ArrowLeft':
          gallery?.prev()
          break
        case 'ArrowRight':
          gallery?.next()
          break
        case 'Escape':
          closeSlide()
          break
      }
      ev.preventDefault()
    }

    setGalleryRef.current?.(gallery)
    self.document.addEventListener('keydown', handleKeyDown)

    return () => {
      gallery?.destroy()
      self.document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return createPortal((
    <Slide
      name="gallery"
      class={cn(
        styles.root,
        isFullscreen && 'fullscreen',
        (isFullscreen && isFakeFullscreen) && 'fakeFullscreen'
      )}
      onClose={onClose}
    >
      <div
        class={cn(
          styles.gallery,
          'keen-slider'
        )}
        ref={galleryRef}
      >
        {children}
      </div>

      <div class={styles.header}>
        <Button
          class={styles.backButton}
          icon="back"
          square
          onClick={closeSlide}
        />
        <Text ellipsis>
          {currentName}
        </Text>
        <Button
          class={styles.closeButton}
          icon="cross"
          square
          onClick={closeSlide}
        />
      </div>

      {currentIndex !== 0 && (
        <Button
          class={cn(styles.navButton, styles._left)}
          icon="arrow"
          square
          onClick={gallery?.prev}
        />
      )}
      {currentIndex !== size - 1 && (
        <Button
          class={cn(styles.navButton, styles._right)}
          icon="arrow"
          square
          onClick={gallery?.next}
        />
      )}
    </Slide>
  ), bodyEl)
})
