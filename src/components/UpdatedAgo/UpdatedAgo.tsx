import { timeAgo } from '@/common/format.functions'

export function UpdatedAgo({
  updatedAt,
  now,
}: {
  updatedAt: number | null
  now: number
}) {
  return (
    <span className="w-32 text-right text-sm whitespace-nowrap text-muted-foreground tabular-nums">
      {updatedAt === null
        ? 'Loading…'
        : `Updated ${timeAgo({ from: new Date(updatedAt).toISOString(), now })}`}
    </span>
  )
}
