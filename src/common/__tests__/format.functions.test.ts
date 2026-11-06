import { describe, expect, it } from 'vitest'

import { timeAgo } from '@/common/format.functions'

const NOW = Date.parse('2026-11-06T12:00:00Z')

describe('timeAgo', () => {
  it('rounds to the largest sensible unit', () => {
    expect(timeAgo({ from: '2026-11-06T11:59:30Z', now: NOW })).toBe('30s ago')
    expect(timeAgo({ from: '2026-11-06T11:15:00Z', now: NOW })).toBe('45m ago')
    expect(timeAgo({ from: '2026-11-05T12:00:00Z', now: NOW })).toBe('24h ago')
    expect(timeAgo({ from: '2026-11-01T12:00:00Z', now: NOW })).toBe('5d ago')
  })
})
