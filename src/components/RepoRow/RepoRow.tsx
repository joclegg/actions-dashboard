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
    <li className="flex flex-col gap-2 px-3 py-2 sm:flex-row sm:items-center">
      <span className="flex min-w-0 items-center gap-2 sm:w-56">
        <StatusIcon state={state} />
        <a
          href={`${repo.htmlUrl}/actions`}
          target="_blank"
          rel="noreferrer"
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
      <span className="flex min-w-0 flex-1 flex-wrap gap-1">
        {workflows.map((workflow) => (
          <a
            key={workflow.name}
            href={workflow.run.htmlUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-md border border-border px-1.5 py-0.5 text-xs hover:bg-muted"
          >
            <StatusIcon state={workflow.run.state} />
            {workflow.name}
          </a>
        ))}
      </span>
      <span className="shrink-0 text-xs text-muted-foreground">
        {lastRunAt ? timeAgo({ from: lastRunAt, now }) : 'Never run'}
      </span>
    </li>
  )
}
