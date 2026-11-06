import { useEffect, useEffectEvent, useRef, useState } from 'react'

import {
  FETCH_CONCURRENCY,
  GITHUB_API,
  RECENT_RUN_LIMIT,
  RUNS_PER_REPO,
} from '@/common/github.constants'
import {
  nextPageUrl,
  readRateLimit,
  recentRuns,
  sortSummaries,
  summariseRepo,
  toOwner,
  toRepo,
  toRun,
} from '@/common/github.functions'
import type {
  ActionsData,
  CachedPage,
  Owner,
  RateLimit,
  RawAccount,
  RawRepo,
  RawRun,
} from '@/common/github.types'

const SIGNED_OUT = 'SignedOut'

const EMPTY_DATA = {
  summaries: [],
  recent: [],
  hiddenCount: 0,
  updatedAt: null,
}

export function useActions({
  owner,
  getToken,
  onSignedOut,
}: {
  owner: Owner | null
  getToken: () => Promise<string | null>
  onSignedOut: () => void
}) {
  const [data, setData] = useState<ActionsData | null>(null)
  const [loadingLogin, setLoadingLogin] = useState<string | null>(null)
  const [rateLimit, setRateLimit] = useState<RateLimit | null>(null)
  const cache = useRef(new Map<string, CachedPage>())
  const inFlight = useRef<string | null>(null)
  const login = owner?.login ?? null

  async function refresh() {
    if (!owner || inFlight.current === owner.login) {
      return
    }
    const target = owner
    inFlight.current = target.login
    setLoadingLogin(target.login)
    try {
      const token = await getToken()
      if (!token) {
        onSignedOut()
        return
      }
      const result = await loadActions({
        owner: target,
        token,
        cache: cache.current,
        onRateLimit: setRateLimit,
      })
      setData({ ...result, login: target.login, error: null })
    } catch (cause) {
      if (isSignedOut(cause)) {
        onSignedOut()
        return
      }
      setData((previous) => ({
        ...(previous?.login === target.login ? previous : EMPTY_DATA),
        login: target.login,
        error: cause instanceof Error ? cause.message : 'Something went wrong.',
      }))
    } finally {
      if (inFlight.current === target.login) {
        inFlight.current = null
      }
      setLoadingLogin((current) => (current === target.login ? null : current))
    }
  }

  const refreshForOwner = useEffectEvent(() => {
    void refresh()
  })

  useEffect(() => {
    if (login) {
      refreshForOwner()
    }
  }, [login])

  const current = data && data.login === login ? data : null
  return {
    summaries: current?.summaries ?? [],
    recent: current?.recent ?? [],
    hiddenCount: current?.hiddenCount ?? 0,
    updatedAt: current?.updatedAt ?? null,
    error: current?.error ?? null,
    loading: loadingLogin !== null && loadingLogin === login,
    rateLimit,
    refresh,
  }
}

export function useOwners({
  getToken,
}: {
  getToken: () => Promise<string | null>
}) {
  const [owners, setOwners] = useState<Owner[]>([])
  const [me, setMe] = useState<string | null>(null)
  const readToken = useEffectEvent(() => getToken())

  useEffect(() => {
    let cancelled = false
    async function load() {
      const token = await readToken()
      if (!token) {
        return
      }
      const auth: string = token
      const cache = new Map<string, CachedPage>()
      function get(url: string) {
        return getPages({ url, token: auth, cache })
      }
      const [user] = (await get(`${GITHUB_API}/user`)) as RawAccount[]
      const installations = (
        (await get(`${GITHUB_API}/user/installations?per_page=100`)) as {
          installations: { id: number; account: RawAccount }[]
        }[]
      ).flatMap((page) => page.installations)
      const byLogin = new Map<string, Owner>()
      byLogin.set(user.login, toOwner({ ...user, installationId: null }))
      for (const { id, account } of installations) {
        byLogin.set(account.login, toOwner({ ...account, installationId: id }))
      }
      if (!cancelled) {
        setMe(user.login)
        setOwners([...byLogin.values()])
      }
    }
    load().catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [])

  return { me, owners }
}

async function errorMessage(response: Response): Promise<string> {
  if (response.status === 404) {
    return 'No user or organisation with that name.'
  }
  if (
    (response.status === 403 || response.status === 429) &&
    response.headers.get('x-ratelimit-remaining') === '0'
  ) {
    return 'GitHub rate limit reached. It resets within the hour.'
  }
  try {
    const body = (await response.json()) as { message?: string }
    return body.message ?? `GitHub returned ${response.status}.`
  } catch {
    return `GitHub returned ${response.status}.`
  }
}

async function getPages({
  url,
  token,
  cache,
  onRateLimit,
}: {
  url: string
  token: string
  cache: Map<string, CachedPage>
  onRateLimit?: (rateLimit: RateLimit) => void
}): Promise<unknown[]> {
  const pages: unknown[] = []
  let next: string | null = url
  while (next) {
    const cached = cache.get(next)
    const response: Response = await fetch(next, {
      cache: 'no-store',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        ...(cached ? { 'If-None-Match': cached.etag } : {}),
      },
    })
    const rateLimit = readRateLimit(response.headers)
    if (rateLimit) {
      onRateLimit?.(rateLimit)
    }
    if (response.status === 401) {
      throw Object.assign(new Error('Signed out'), { name: SIGNED_OUT })
    }
    if (response.status === 304 && cached) {
      pages.push(cached.body)
      next = cached.next
      continue
    }
    if (!response.ok) {
      throw new Error(await errorMessage(response))
    }
    const body: unknown = await response.json()
    const page = {
      etag: response.headers.get('etag') ?? '',
      body,
      next: nextPageUrl(response.headers.get('link')),
    }
    if (page.etag) {
      cache.set(next, page)
    }
    pages.push(body)
    next = page.next
  }
  return pages
}

function isSignedOut(cause: unknown): boolean {
  return cause instanceof Error && cause.name === SIGNED_OUT
}

async function listRepos({
  owner,
  get,
}: {
  owner: Owner
  get: (url: string) => Promise<unknown[]>
}): Promise<RawRepo[]> {
  if (owner.installationId !== null) {
    const pages = (await get(
      `${GITHUB_API}/user/installations/${owner.installationId}/repositories?per_page=100`,
    )) as { repositories: RawRepo[] }[]
    return pages.flatMap((page) => page.repositories)
  }
  const pages = (await get(
    `${GITHUB_API}/users/${encodeURIComponent(owner.login)}/repos?per_page=100&type=owner`,
  )) as RawRepo[][]
  return pages.flat()
}

async function loadActions({
  owner,
  token,
  cache,
  onRateLimit,
}: {
  owner: Owner
  token: string
  cache: Map<string, CachedPage>
  onRateLimit: (rateLimit: RateLimit) => void
}) {
  function get(url: string) {
    return getPages({ url, token, cache, onRateLimit })
  }
  const repos = (await listRepos({ owner, get })).map(toRepo)
  const shown = repos.filter((repo) => !repo.archived && !repo.fork)
  const runsByRepo = await mapLimit({
    items: shown,
    limit: FETCH_CONCURRENCY,
    task: async (repo) => {
      try {
        const [page] = (await get(
          `${GITHUB_API}/repos/${repo.fullName}/actions/runs?per_page=${RUNS_PER_REPO}`,
        )) as { workflow_runs?: RawRun[] }[]
        return (page.workflow_runs ?? []).map((raw) =>
          toRun({ raw, repo: repo.name }),
        )
      } catch (cause) {
        if (isSignedOut(cause)) {
          throw cause
        }
        return []
      }
    },
  })
  return {
    summaries: sortSummaries(
      shown.map((repo, index) =>
        summariseRepo({ repo, runs: runsByRepo[index] }),
      ),
    ),
    recent: recentRuns({ runs: runsByRepo.flat(), limit: RECENT_RUN_LIMIT }),
    hiddenCount: repos.length - shown.length,
    updatedAt: Date.now(),
  }
}

async function mapLimit<T, R>({
  items,
  limit,
  task,
}: {
  items: T[]
  limit: number
  task: (item: T) => Promise<R>
}): Promise<R[]> {
  const results: R[] = new Array(items.length)
  let index = 0
  async function worker() {
    while (index < items.length) {
      const current = index
      index += 1
      results[current] = await task(items[current])
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, worker),
  )
  return results
}
