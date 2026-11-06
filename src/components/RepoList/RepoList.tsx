import type { RepoSummary } from '@/common/github.types'
import { RepoRow } from '@/components/RepoRow/RepoRow'

export function RepoList({
  summaries,
  hiddenCount,
  now,
}: {
  summaries: RepoSummary[]
  hiddenCount: number
  now: number
}) {
  return (
    <section aria-labelledby="repositories" className="min-w-0">
      <h2 id="repositories" className="mb-2 text-sm font-semibold">
        Repositories
      </h2>
      {summaries.length === 0 ? (
        <p className="text-sm text-muted-foreground">No repositories.</p>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border">
          {summaries.map((summary) => (
            <RepoRow key={summary.repo.id} summary={summary} now={now} />
          ))}
        </ul>
      )}
      {hiddenCount > 0 && (
        <p className="mt-2 text-xs text-muted-foreground">
          {hiddenCount} archived or forked{' '}
          {hiddenCount === 1 ? 'repository' : 'repositories'} hidden.
        </p>
      )}
    </section>
  )
}
