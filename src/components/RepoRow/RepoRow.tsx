import { Lock } from 'lucide-react'

import { timeAgo } from '@/common/format.functions'
import type { RepoSummary } from '@/common/github.types'
import { StatusIcon } from '@/components/StatusIcon/StatusIcon'

export function RepoRow({
  summary,
  now,
}: {
  summary: RepoSummary
  now: number
}) {
  const { repo, state, lastRunAt, workflows } = summary
  return (
    <li className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2">
      <span className="flex min-w-0 flex-1 items-center gap-2 sm:w-56 sm:flex-none">
        <StatusIcon state={state} />
        <a
          href={`${repo.htmlUrl}/actions`}
          target="_blank"
          rel="noreferrer"
          title={repo.name}
          className="truncate text-sm font-medium hover:underline"
        >
          {repo.name}
        </a>
        {repo.private && (
          <Lock
            role="img"
            aria-label="Private"
            className="size-3 shrink-0 text-muted-foreground"
          />
        )}
      </span>
      <span className="order-last flex w-full min-w-0 flex-wrap gap-1 sm:order-none sm:w-auto sm:flex-1">
        {workflows.map((workflow) => (
          <a
            key={workflow.name}
            href={workflow.run.htmlUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex max-w-full items-center gap-1 rounded-md border border-border px-1.5 py-0.5 text-xs hover:bg-muted"
          >
            <StatusIcon state={workflow.run.state} />
            <span className="truncate">{workflow.name}</span>
          </a>
        ))}
      </span>
      <span className="w-14 shrink-0 text-right text-xs whitespace-nowrap text-muted-foreground tabular-nums">
        {lastRunAt ? timeAgo({ from: lastRunAt, now }) : 'Never run'}
      </span>
    </li>
  )
}
