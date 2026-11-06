import { GITHUB_APP_INSTALL_URL } from '@/common/github.constants'
import { useActions, useOwners } from '@/common/github.hooks'
import type { Owner } from '@/common/github.types'
import { useStoredState } from '@/common/storage.hooks'
import { useNow } from '@/common/time.hooks'
import { Button } from '@/components/Button/Button'
import { OwnerPicker } from '@/components/OwnerPicker/OwnerPicker'
import { RateLimitNote } from '@/components/RateLimitNote/RateLimitNote'
import { RefreshPicker } from '@/components/RefreshPicker/RefreshPicker'
import { effectiveInterval } from '@/components/RefreshPicker/RefreshPicker.functions'
import {
  useAutoRefresh,
  useRefreshInterval,
} from '@/components/RefreshPicker/RefreshPicker.hooks'
import { RepoList } from '@/components/RepoList/RepoList'
import { RunList } from '@/components/RunList/RunList'
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle'
import { UpdatedAgo } from '@/components/UpdatedAgo/UpdatedAgo'
import { parseOwner } from '@/views/DashboardView/DashboardView.functions'

export function DashboardView({
  getToken,
  onSignOut,
}: {
  getToken: () => Promise<string | null>
  onSignOut: () => void
}) {
  const { me, owners } = useOwners({ getToken })
  const [stored, setOwner] = useStoredState<Owner | null>({
    key: 'owner',
    parse: parseOwner,
    serialise: (value) => (value ? JSON.stringify(value) : null),
  })
  const owner =
    owners.find((candidate) => candidate.login === stored?.login) ??
    stored ??
    owners.find((candidate) => candidate.login === me) ??
    null
  const actions = useActions({ owner, getToken, onSignedOut: onSignOut })
  const [interval, setInterval] = useRefreshInterval()
  const running = effectiveInterval({
    selected: interval,
    rateLimit: actions.rateLimit,
  })
  useAutoRefresh({
    interval: running,
    lastRefresh: actions.updatedAt,
    refresh: () => void actions.refresh(),
  })
  const now = useNow(1000)

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4">
      <header className="flex flex-wrap items-center gap-3">
        <h1 className="mr-auto text-lg font-semibold">Actions dashboard</h1>
        <OwnerPicker owners={owners} value={owner} onChange={setOwner} />
        <UpdatedAgo updatedAt={actions.updatedAt} now={now} />
        <RefreshPicker
          interval={interval}
          loading={actions.loading}
          onIntervalChange={setInterval}
          onRefresh={() => void actions.refresh()}
        />
        <ThemeToggle />
        <Button onClick={onSignOut}>Sign out</Button>
      </header>
      <RateLimitNote
        rateLimit={actions.rateLimit}
        slowed={running !== interval}
      />
      {owner && owner.installationId === null && (
        <p className="text-sm text-muted-foreground">
          Showing public repositories only.{' '}
          <a
            className="underline"
            href={GITHUB_APP_INSTALL_URL}
            target="_blank"
            rel="noreferrer"
          >
            Install the app
          </a>{' '}
          on {owner.login} to include private ones.
        </p>
      )}
      {actions.error && (
        <p role="alert" className="text-sm text-destructive">
          {actions.error}
        </p>
      )}
      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <RepoList
          summaries={actions.summaries}
          hiddenCount={actions.hiddenCount}
          now={now}
        />
        <RunList runs={actions.recent} now={now} />
      </div>
    </main>
  )
}
