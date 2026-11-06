import { describe, expect, it } from 'vitest'

import { cn } from '@/common/utils.functions'

describe('cn', () => {
  it('joins class names and drops falsy values', () => {
    expect(cn('a', false, 'b')).toBe('a b')
  })

  it('lets later Tailwind classes win', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })
})
