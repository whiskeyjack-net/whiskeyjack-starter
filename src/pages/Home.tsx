import { useTranslation } from 'react-i18next'
import { Card, CardContent, Button, ConfirmButton, EmptyState } from '@whiskeyjack-net/design-system'
import { Sparkle, AppWindow, Palette, Translate, DeviceMobile } from '@phosphor-icons/react'

// The starter landing page: a small showcase of what the stack gives you.
// Replace it with your app's first screen.
export function Home() {
  const { t } = useTranslation()

  const features = [
    { icon: AppWindow, key: 'shell' },
    { icon: Palette, key: 'theme' },
    { icon: Translate, key: 'i18n' },
    { icon: DeviceMobile, key: 'tauri' },
  ] as const

  return (
    <div className="space-y-6">
      <header className="pt-4">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]">
          {t('home.title')}
        </h1>
        <p className="mt-1 text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]">
          {t('home.subtitle')}
        </p>
      </header>

      <section>
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-[var(--color-text-muted-light)] dark:text-[var(--color-text-muted-dark)]">
          {t('home.whatsHere')}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {features.map(({ icon: Icon, key }) => (
            <Card key={key}>
              <CardContent className="flex items-start gap-3 p-4">
                <div className="shrink-0 rounded-lg bg-[var(--color-accent-50)] p-2 dark:bg-[var(--color-neutral-800)]">
                  <Icon size={20} weight="bold" className="text-[var(--color-accent-600)]" />
                </div>
                <p className="text-sm text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]">
                  {t(`home.features.${key}`)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="flex flex-wrap items-center gap-3">
        <Button variant="accent">
          <Sparkle size={16} weight="bold" className="mr-1.5" />
          {t('home.primaryCta')}
        </Button>
        <ConfirmButton
          label={t('home.confirmDelete')}
          touchConfirmLabel={t('home.tapAgain')}
          mouseConfirmLabel={t('home.clickAgain')}
          onConfirm={() => {}}
        />
      </section>

      <Card>
        <CardContent className="p-0">
          <EmptyState
            icon={<Sparkle size={28} weight="bold" className="text-[var(--color-accent-600)]" />}
            title={t('home.emptyTitle')}
            subtitle={t('home.emptySubtitle')}
            ctaLabel={t('home.emptyCta')}
            onCta={() => {}}
          />
        </CardContent>
      </Card>
    </div>
  )
}
