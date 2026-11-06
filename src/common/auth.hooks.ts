import { useEffect, useRef, useState } from 'react'

import { SESSION_STORAGE_KEY, STATE_STORAGE_KEY } from '@/common/auth.constants'
import {
  authorizeUrl,
  isSession,
  needsRenewal,
  readCallback,
  toSession,
} from '@/common/auth.functions'
import type { Session } from '@/common/auth.types'
import { AUTH_URL, GITHUB_APP_CLIENT_ID } from '@/common/github.constants'
import { useStoredState } from '@/common/storage.hooks'

export function useSession() {
  const [session, setSession] = useStoredState<Session | null>({
    key: SESSION_STORAGE_KEY,
    parse: parseSession,
    serialise: (value) => (value ? JSON.stringify(value) : null),
  })
  const [callback] = useState(readPendingCallback)
  const [error, setError] = useState<string | null>(
    callback?.code === null
      ? 'Sign-in was interrupted. Please try again.'
      : null,
  )
  const [signingIn, setSigningIn] = useState(Boolean(callback?.code))
  const renewal = useRef<Promise<string | null> | null>(null)

  useEffect(() => {
    if (!callback) {
      return
    }
    history.replaceState(null, '', redirectUri())
    if (!callback.code) {
      return
    }
    exchange({ code: callback.code })
      .then((next) => {
        if (next) {
          setSession(next)
        } else {
          setError('GitHub did not accept the sign-in. Please try again.')
        }
      })
      .catch(() => setError('Could not reach the sign-in service.'))
      .finally(() => setSigningIn(false))
  }, [callback, setSession])

  async function token(): Promise<string | null> {
    const current = session
    if (!current) {
      return null
    }
    if (!needsRenewal({ session: current, now: Date.now() })) {
      return current.accessToken
    }
    renewal.current ??= exchange({ refreshToken: current.refreshToken })
      .catch(() => null)
      .then((renewed) => {
        setSession(renewed)
        return renewed?.accessToken ?? null
      })
      .finally(() => {
        renewal.current = null
      })
    return renewal.current
  }

  function signIn() {
    const state = crypto.randomUUID()
    try {
      sessionStorage.setItem(STATE_STORAGE_KEY, state)
    } catch {
      setError('Sign-in needs browser storage turned on.')
      return
    }
    location.assign(
      authorizeUrl({
        clientId: GITHUB_APP_CLIENT_ID,
        redirectUri: redirectUri(),
        state,
      }),
    )
  }

  function signOut() {
    setSession(null)
  }

  return { session, error, signingIn, signIn, signOut, token }
}

async function exchange(body: {
  code?: string
  refreshToken?: string | null
}): Promise<Session | null> {
  const response = await fetch(`${AUTH_URL}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code: body.code,
      refresh_token: body.refreshToken,
      redirect_uri: redirectUri(),
    }),
  })
  if (!response.ok) {
    return null
  }
  return toSession({ response: await response.json(), now: Date.now() })
}

function parseSession(stored: string | null): Session | null {
  if (!stored) {
    return null
  }
  try {
    const value: unknown = JSON.parse(stored)
    return isSession(value) ? value : null
  } catch {
    return null
  }
}

function readPendingCallback(): { code: string | null } | null {
  const callback = readCallback(location.search)
  if (!callback) {
    return null
  }
  const expected = readSessionStorage(STATE_STORAGE_KEY)
  return { code: callback.state === expected ? callback.code : null }
}

function readSessionStorage(key: string): string | null {
  try {
    return sessionStorage.getItem(key)
  } catch {
    return null
  }
}

function redirectUri(): string {
  return `${location.origin}${location.pathname}`
}
