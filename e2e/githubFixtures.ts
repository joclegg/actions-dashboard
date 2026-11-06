export const NOW = '2026-11-06T12:00:00Z'

export const SESSION = {
  accessToken: 'ghu_test',
  refreshToken: null,
  expiresAt: null,
}

export const USER = { login: 'jo', avatar_url: '' }

export const INSTALLATIONS = {
  installations: [{ id: 7, account: { login: 'acme', avatar_url: '' } }],
}

export const REPOS = [
  repo({ id: 1, name: 'web' }),
  repo({ id: 2, name: 'api' }),
  repo({ id: 3, name: 'docs' }),
  repo({ id: 4, name: 'old', archived: true }),
]

export const RUNS: Record<string, unknown[]> = {
  web: [
    run({
      id: 11,
      name: 'CI',
      title: 'Fix login',
      minutesAgo: 3,
      status: 'in_progress',
      conclusion: null,
    }),
    run({
      id: 12,
      name: 'Deploy',
      title: 'Ship it',
      minutesAgo: 40,
      conclusion: 'success',
    }),
  ],
  api: [
    run({
      id: 21,
      name: 'CI',
      title: 'Add rate limits',
      minutesAgo: 12,
      conclusion: 'failure',
    }),
    run({
      id: 22,
      name: 'CI',
      title: 'Try a branch',
      minutesAgo: 5,
      branch: 'feature',
      conclusion: 'success',
    }),
  ],
  docs: [],
}

function repo({
  id,
  name,
  archived = false,
}: {
  id: number
  name: string
  archived?: boolean
}) {
  return {
    id,
    name,
    full_name: `jo/${name}`,
    html_url: `https://github.com/jo/${name}`,
    default_branch: 'main',
    archived,
    fork: false,
    private: name === 'api',
  }
}

function run({
  id,
  name,
  title,
  minutesAgo,
  branch = 'main',
  status = 'completed',
  conclusion,
}: {
  id: number
  name: string
  title: string
  minutesAgo: number
  branch?: string
  status?: string
  conclusion: string | null
}) {
  const at = new Date(Date.parse(NOW) - minutesAgo * 60_000).toISOString()
  return {
    id,
    name,
    display_title: title,
    head_branch: branch,
    event: 'push',
    status,
    conclusion,
    html_url: `https://github.com/jo/x/actions/runs/${id}`,
    created_at: at,
    updated_at: at,
    actor: { login: 'jo' },
  }
}
