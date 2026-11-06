import type { RefreshOption } from '@/components/RefreshPicker/RefreshPicker.types'

export const REFRESH_STORAGE_KEY = 'refreshInterval'

export const REFRESH_OFF = 0

export const REFRESH_OPTIONS: RefreshOption[] = [
  { label: 'Off', ms: REFRESH_OFF },
  { label: '10s', ms: 10_000 },
  { label: '30s', ms: 30_000 },
  { label: '1m', ms: 60_000 },
  { label: '5m', ms: 300_000 },
  { label: '15m', ms: 900_000 },
  { label: '30m', ms: 1_800_000 },
  { label: '1h', ms: 3_600_000 },
]

export const LOW_RATE_LIMIT_SHARE = 0.1

export const BACKOFF_MS = 300_000
