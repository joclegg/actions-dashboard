import { RENEW_BEFORE_MS } from '@/common/auth.constants'
import type { Session } from '@/common/auth.types'

export function authorizeUrl({
  clientId,
  redirectUri,
  state,
}: {
  clientId: string
  redirectUri: string
  state: string
}): string {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
  })
  return `https://github.com/login/oauth/authorize?${params}`
}

export function isSession(value: unknown): value is Session {
  return (
    typeof value === 'object' &&
    value !== null &&
    'accessToken' in value &&
    typeof value.accessToken === 'string'
  )
}

export function needsRenewal({
  session,
  now,
}: {
  session: Session
  now: number
}): boolean {
  return (
    session.expiresAt !== null &&
    session.refreshToken !== null &&
    session.expiresAt - now < RENEW_BEFORE_MS
  )
}

export function readCallback(
  search: string,
): { code: string; state: string } | null {
  const params = new URLSearchParams(search)
  const code = params.get('code')
  const state = params.get('state')
  return code && state ? { code, state } : null
}

export function toSession({
  response,
  now,
}: {
  response: {
    access_token?: string
    refresh_token?: string
    expires_in?: number
  }
  now: number
}): Session | null {
  if (!response.access_token) {
    return null
  }
  return {
    accessToken: response.access_token,
    refreshToken: response.refresh_token ?? null,
    expiresAt: response.expires_in ? now + response.expires_in * 1000 : null,
  }
}
