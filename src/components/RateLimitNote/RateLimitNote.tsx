import type { RateLimit } from '@/common/github.types'
import { isRateLimitLow } from '@/components/RefreshPicker/RefreshPicker.functions'

export function RateLimitNote({
  rateLimit,
  slowed,
}: {
  rateLimit: RateLimit | null
  slowed: boolean
}) {
  if (!rateLimit) {
    return null
  }
  const low = isRateLimitLow(rateLimit)
  return (
    <p
      className={
        low
          ? 'text-sm text-amber-700 dark:text-amber-400'
          : 'text-sm text-muted-foreground'
      }
    >
      {rateLimit.remaining.toLocaleString('en-GB')} of{' '}
      {rateLimit.limit.toLocaleString('en-GB')} GitHub requests left this hour
      {slowed ? '. Auto-refresh slowed to every 5 minutes.' : '.'}
    </p>
  )
}
