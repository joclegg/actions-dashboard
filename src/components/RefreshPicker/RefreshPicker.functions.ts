import type { RateLimit } from '@/common/github.types'
import {
  BACKOFF_MS,
  LOW_RATE_LIMIT_SHARE,
  REFRESH_OFF,
  REFRESH_OPTIONS,
} from '@/components/RefreshPicker/RefreshPicker.constants'

export function effectiveInterval({
  selected,
  rateLimit,
}: {
  selected: number
  rateLimit: RateLimit | null
}): number {
  if (selected === REFRESH_OFF || !isRateLimitLow(rateLimit)) {
    return selected
  }
  return Math.max(selected, BACKOFF_MS)
}

export function isRateLimitLow(rateLimit: RateLimit | null): boolean {
  return (
    rateLimit !== null &&
    rateLimit.remaining < rateLimit.limit * LOW_RATE_LIMIT_SHARE
  )
}

export function parseInterval(stored: string | null): number {
  const ms = Number(stored)
  return REFRESH_OPTIONS.some((option) => option.ms === ms) ? ms : REFRESH_OFF
}
