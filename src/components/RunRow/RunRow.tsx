import { timeAgo } from '@/common/format.functions'
import type { Run } from '@/common/github.types'
import { StatusIcon } from '@/components/StatusIcon/StatusIcon'

export function RunRow({ run, now }: { run: Run; now: number }) {
  return (
    <li>
      <a
        href={run.htmlUrl}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-3 px-3 py-2 hover:bg-muted"
      >
        <StatusIcon state={run.state} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium">
            {run.title}
          </span>
          <span className="block truncate text-xs text-muted-foreground">
            {run.repo} · {run.workflow} · {run.branch} · {run.event}
          </span>
        </span>
        <span className="shrink-0 text-xs text-muted-foreground">
          {timeAgo({ from: run.createdAt, now })}
        </span>
      </a>
    </li>
  )
}
