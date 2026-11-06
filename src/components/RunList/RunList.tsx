import type { Run } from '@/common/github.types'
import { RunRow } from '@/components/RunRow/RunRow'

export function RunList({ runs, now }: { runs: Run[]; now: number }) {
  return (
    <section aria-labelledby="recent-runs" className="min-w-0">
      <h2 id="recent-runs" className="mb-2 text-sm font-semibold">
        Recent runs
      </h2>
      {runs.length === 0 ? (
        <p className="text-sm text-muted-foreground">No runs yet.</p>
      ) : (
        <ol className="divide-y divide-border overflow-hidden rounded-lg border border-border">
          {runs.map((run) => (
            <RunRow key={run.id} run={run} now={now} />
          ))}
        </ol>
      )}
    </section>
  )
}
