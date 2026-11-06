import { describe, expect, it } from 'vitest'

import {
  effectiveInterval,
  isRateLimitLow,
  parseInterval,
} from '@/components/RefreshPicker/RefreshPicker.functions'

describe('parseInterval', () => {
  it('keeps a listed interval', () => {
    expect(parseInterval('30000')).toBe(30_000)
  })

  it('falls back to off for anything else', () => {
    expect(parseInterval(null)).toBe(0)
    expect(parseInterval('1234')).toBe(0)
    expect(parseInterval('soon')).toBe(0)
  })
})

describe('isRateLimitLow', () => {
  it('is low under a tenth of the limit', () => {
    expect(isRateLimitLow({ limit: 5000, remaining: 499, resetAt: 0 })).toBe(
      true,
    )
    expect(isRateLimitLow({ limit: 5000, remaining: 500, resetAt: 0 })).toBe(
      false,
    )
    expect(isRateLimitLow(null)).toBe(false)
  })
})

describe('effectiveInterval', () => {
  const low = { limit: 5000, remaining: 10, resetAt: 0 }

  it('uses the chosen interval while the limit is healthy', () => {
    expect(effectiveInterval({ selected: 10_000, rateLimit: null })).toBe(
      10_000,
    )
  })

  it('slows to five minutes when the limit is low', () => {
    expect(effectiveInterval({ selected: 10_000, rateLimit: low })).toBe(
      300_000,
    )
    expect(effectiveInterval({ selected: 3_600_000, rateLimit: low })).toBe(
      3_600_000,
    )
  })

  it('stays off when off', () => {
    expect(effectiveInterval({ selected: 0, rateLimit: low })).toBe(0)
  })
})
