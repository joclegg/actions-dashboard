import { describe, expect, it } from 'vitest'

import {
  authorizeUrl,
  isSession,
  needsRenewal,
  readCallback,
  toSession,
} from '@/common/auth.functions'

describe('authorizeUrl', () => {
  it('sends the client, redirect and state', () => {
    const url = new URL(
      authorizeUrl({
        clientId: 'Iv1.abc',
        redirectUri: 'https://actions.joclegg.dev/',
        state: 'xyz',
      }),
    )
    expect(url.origin + url.pathname).toBe(
      'https://github.com/login/oauth/authorize',
    )
    expect(url.searchParams.get('client_id')).toBe('Iv1.abc')
    expect(url.searchParams.get('state')).toBe('xyz')
  })
})

describe('readCallback', () => {
  it('needs both code and state', () => {
    expect(readCallback('?code=a&state=b')).toEqual({ code: 'a', state: 'b' })
    expect(readCallback('?code=a')).toBeNull()
  })
})

describe('toSession', () => {
  it('works out when the token expires', () => {
    expect(
      toSession({
        response: {
          access_token: 'ghu_1',
          refresh_token: 'ghr_1',
          expires_in: 28800,
        },
        now: 1000,
      }),
    ).toEqual({
      accessToken: 'ghu_1',
      refreshToken: 'ghr_1',
      expiresAt: 28_801_000,
    })
    expect(toSession({ response: {}, now: 0 })).toBeNull()
  })
})

describe('needsRenewal', () => {
  it('renews within five minutes of expiry', () => {
    const session = {
      accessToken: 'a',
      refreshToken: 'r',
      expiresAt: 600_000,
    }
    expect(needsRenewal({ session, now: 0 })).toBe(false)
    expect(needsRenewal({ session, now: 400_000 })).toBe(true)
    expect(
      needsRenewal({ session: { ...session, expiresAt: null }, now: 0 }),
    ).toBe(false)
  })
})

describe('isSession', () => {
  it('checks the stored shape', () => {
    expect(isSession({ accessToken: 'a' })).toBe(true)
    expect(isSession({})).toBe(false)
    expect(isSession(null)).toBe(false)
  })
})
