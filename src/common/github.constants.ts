export const GITHUB_API = 'https://api.github.com'

export const GITHUB_APP_CLIENT_ID = 'Iv23liFmd68l3R393OhD'

export const GITHUB_APP_INSTALL_URL =
  'https://github.com/apps/joclegg-actions-dashboard/installations/new'

export const AUTH_URL = 'https://actions-auth.joclegg.dev'

export const RUNS_PER_REPO = 20

export const RECENT_RUN_LIMIT = 50

export const FETCH_CONCURRENCY = 8

export const RUN_STATE = {
  FAILED: 'failed',
  RUNNING: 'running',
  QUEUED: 'queued',
  CANCELLED: 'cancelled',
  PASSED: 'passed',
  SKIPPED: 'skipped',
  NONE: 'none',
} as const

export const RUN_STATE_ORDER = [
  RUN_STATE.FAILED,
  RUN_STATE.RUNNING,
  RUN_STATE.QUEUED,
  RUN_STATE.CANCELLED,
  RUN_STATE.PASSED,
  RUN_STATE.SKIPPED,
  RUN_STATE.NONE,
] as const

export const PENDING_STATUSES = ['queued', 'waiting', 'requested', 'pending']

export const FAILED_CONCLUSIONS = [
  'failure',
  'timed_out',
  'startup_failure',
  'action_required',
]

export const SKIPPED_CONCLUSIONS = ['skipped', 'neutral', 'stale']
