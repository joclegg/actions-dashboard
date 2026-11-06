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
        className="flex items-start gap-3 px-3 py-2 hover:bg-muted"
      >
        <span className="mt-0.5">
          <StatusIcon state={run.state} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="line-clamp-2 text-sm font-medium break-words">
            {run.title}
          </span>
          <span className="block text-xs break-words text-muted-foreground">
            {run.repo} · {run.workflow} · {run.branch} · {run.event}
          </span>
        </span>
        <span className="w-14 shrink-0 text-right text-xs whitespace-nowrap text-muted-foreground tabular-nums">
          {timeAgo({ from: run.createdAt, now })}
        </span>
      </a>
    </li>
  )
}
