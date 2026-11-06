import { describe, expect, it } from 'vitest'

import { parseOwner } from '@/views/DashboardView/DashboardView.functions'

describe('parseOwner', () => {
  it('reads a stored owner', () => {
    expect(
      parseOwner('{"login":"jo","avatarUrl":"","installationId":null}'),
    ).toEqual({ login: 'jo', avatarUrl: '', installationId: null })
  })

  it('ignores anything else', () => {
    expect(parseOwner(null)).toBeNull()
    expect(parseOwner('nope')).toBeNull()
    expect(parseOwner('{"login":"jo"}')).toBeNull()
  })
})
