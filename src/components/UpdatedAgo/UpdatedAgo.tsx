import { timeAgo } from '@/common/format.functions'

export function UpdatedAgo({
  updatedAt,
  now,
}: {
  updatedAt: number | null
  now: number
}) {
  return (
    <span className="text-sm text-muted-foreground" aria-live="polite">
      {updatedAt === null
        ? 'Loading…'
        : `Updated ${timeAgo({ from: new Date(updatedAt).toISOString(), now })}`}
    </span>
  )
}
