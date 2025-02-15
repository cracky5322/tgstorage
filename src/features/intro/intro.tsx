import type { FunctionComponent as FC } from 'preact'
import { Fragment, h } from 'preact'
import { useCallback, useEffect, useMemo } from 'preact/hooks'

import { installApp, setAppRoute, setAppFeatureRendered } from '~/core/actions'
import { useTexts, useSettings, useAppInstall } from '~/core/hooks'
import { checkIsDesktop, checkIsWindows, checkIsIOS, checkIsAndroid } from '~/tools/detect-device'
import { Layout } from '~/ui/elements/layout'
import { LayoutBlock } from '~/ui/elements/layout-block'
import { Logo } from '~/ui/elements/logo'
import { Break } from '~/ui/elements/break'
import { Text } from '~/ui/elements/text'
import { PicturesGroup } from '~/ui/elements/pictures-group'
import { Picture } from '~/ui/elements/picture'
import { Button } from '~/ui/elements/button'
import { Icon } from '~/ui/elements/icon'

import { screens } from './screens'

const SCREEN_TYPES = ['avif', 'webp', 'png']
const SCREEN_LOCALES = ['en', 'ru']
const SCREEN_FALLBACK_LOCALE = 'en'

const Intro: FC = () => {
  const { texts } = useTexts('intro')
  const { locale } = useSettings()
  const { appInstallAvailable, appInstalled } = useAppInstall()

  const screenLocale = useMemo(() => {
    return SCREEN_LOCALES.includes(locale) ? locale : SCREEN_FALLBACK_LOCALE
  }, [locale])

  const handleContinue = useCallback(() => {
    setAppRoute('/app')
  }, [])

  useEffect(() => {
    setAppFeatureRendered()
  }, [])

  return (
    <Layout scroll center wide>
      <Break mSize={48} dSize={72} px/>

      <Logo/>
      <Break mSize={40} dSize={64} px/>

      <LayoutBlock narrow>
        <Text uppercase bold center>
          {texts.title}
        </Text>
        <Text center>
          {texts.subTitle}
        </Text>
      </LayoutBlock>
      <Break size={20} px/>

      <LayoutBlock narrow>
        <Text center>
          {texts.description}
        </Text>
      </LayoutBlock>
      <Break mSize={36} dSize={60} px/>

      <PicturesGroup>
        {['main', 'photos', 'shopping'].map(name => (
          <Picture
            key={name}
            sources={SCREEN_TYPES.map(type => ({
              type,
              src: screens[`${name}-${screenLocale}.${type}`]
            }))}
          />
        ))}
      </PicturesGroup>
      <Break mSize={36} dSize={60} px/>

      <LayoutBlock middle>
        <Text center withLink>
          {texts.appDescription0} <a
            href="https://github.com/sh-a-v/tgstorage"
            target="_blank"
            rel="noopener noreferrer"
          >GitHub</a>.
        </Text>
      </LayoutBlock>
      <Break mSize={40} dSize={60} px/>

      <LayoutBlock icons>
        <Icon icon="logo-apple" logo/>
        <Icon icon="logo-android" logo/>
        <Icon icon="logo-windows" logo/>
      </LayoutBlock>
      <Break size={20} px/>

      <LayoutBlock group narrow>
        <Text center>
          {texts.installDescription}
        </Text>

        {(appInstallAvailable && !appInstalled) && (
          <Button
            uppercase
            brand
            onClick={installApp}
          >
            {texts.installButton}
          </Button>
        )}

        {(!appInstallAvailable && !appInstalled) && (
          <Fragment>
            <Text center withLink small grey>
              {texts.installBrowsers}
              <br/>
              {checkIsWindows() && (
                <Fragment>
                  <a
                    href="https://www.microsoft.com/edge"
                    target="_blank"
                    rel="noopener noreferrer"
                  >Microsoft Edge</a>
                </Fragment>
              )}
              {checkIsDesktop() && (
                <Fragment>
                  <a
                    href="https://www.google.com/chrome"
                    target="_blank"
                    rel="noopener noreferrer"
                  >Google Chrome</a>
                </Fragment>
              )}
              {checkIsAndroid() && (
                <Fragment>
                  <a
                    href="market://details?id=com.android.chrome"
                    target="_top"
                    rel="noopener noreferrer"
                  >Google Chrome</a>
                </Fragment>
              )}
              {checkIsIOS() && (
                <Fragment>
                  <a
                    href="https://www.apple.com/safari"
                    target="_blank"
                    rel="noopener noreferrer"
                  >Safari</a>
                </Fragment>
              )}
            </Text>
          </Fragment>
        )}

        <Button
          uppercase
          brand
          outline={appInstallAvailable && !appInstalled}
          onClick={handleContinue}
        >
          {(appInstallAvailable && !appInstalled) ? texts.browserButton : texts.continueButton}
        </Button>
      </LayoutBlock>
      <Break mSize={48} dSize={72} px/>

      <LayoutBlock narrow>
        <Text center withLink>
          {texts.support} <a
            href="https://t.me/tgstorage_support"
            target="_blank"
            rel="noopener noreferrer"
          >TgStorage Support</a>.
        </Text>
      </LayoutBlock>

      <Break mSize={48} dSize={72} px/>
    </Layout>
  )
}

export default Intro
