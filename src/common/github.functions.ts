import {
  FAILED_CONCLUSIONS,
  PENDING_STATUSES,
  RUN_STATE,
  RUN_STATE_ORDER,
  SKIPPED_CONCLUSIONS,
} from '@/common/github.constants'
import type {
  Owner,
  RateLimit,
  RawRepo,
  RawRun,
  Repo,
  RepoSummary,
  Run,
  RunState,
} from '@/common/github.types'

export function nextPageUrl(link: string | null): string | null {
  const match = link?.match(/<([^>]+)>;\s*rel="next"/)
  return match ? match[1] : null
}

export function readRateLimit(headers: Headers): RateLimit | null {
  const limit = Number(headers.get('x-ratelimit-limit'))
  const remaining = Number(headers.get('x-ratelimit-remaining'))
  const reset = Number(headers.get('x-ratelimit-reset'))
  if (!headers.has('x-ratelimit-remaining') || !limit) {
    return null
  }
  return { limit, remaining, resetAt: reset * 1000 }
}

export function recentRuns({
  runs,
  limit,
}: {
  runs: Run[]
  limit: number
}): Run[] {
  return [...runs]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit)
}

export function runState({
  status,
  conclusion,
}: {
  status: string
  conclusion: string | null
}): RunState {
  if (status === 'in_progress') {
    return RUN_STATE.RUNNING
  }
  if (PENDING_STATUSES.includes(status)) {
    return RUN_STATE.QUEUED
  }
  if (conclusion === 'success') {
    return RUN_STATE.PASSED
  }
  if (conclusion === 'cancelled') {
    return RUN_STATE.CANCELLED
  }
  if (conclusion && FAILED_CONCLUSIONS.includes(conclusion)) {
    return RUN_STATE.FAILED
  }
  if (conclusion && SKIPPED_CONCLUSIONS.includes(conclusion)) {
    return RUN_STATE.SKIPPED
  }
  return RUN_STATE.NONE
}

export function sortSummaries(summaries: RepoSummary[]): RepoSummary[] {
  return [...summaries].sort(
    (a, b) =>
      stateRank(a.state) - stateRank(b.state) ||
      (b.lastRunAt ?? '').localeCompare(a.lastRunAt ?? '') ||
      a.repo.name.localeCompare(b.repo.name),
  )
}

export function summariseRepo({
  repo,
  runs,
}: {
  repo: Repo
  runs: Run[]
}): RepoSummary {
  const latest = new Map<string, Run>()
  for (const run of runs) {
    if (run.branch === repo.defaultBranch && !latest.has(run.workflow)) {
      latest.set(run.workflow, run)
    }
  }
  const workflows = [...latest]
    .map(([name, run]) => ({ name, run }))
    .sort((a, b) => a.name.localeCompare(b.name))
  const state = workflows.reduce<RunState>(
    (worst, { run }) =>
      stateRank(run.state) < stateRank(worst) ? run.state : worst,
    RUN_STATE.NONE,
  )
  const lastRunAt = runs.reduce<string | null>(
    (last, run) => (!last || run.createdAt > last ? run.createdAt : last),
    null,
  )
  return { repo, state, lastRunAt, workflows }
}

export function toOwner({
  login,
  avatar_url,
  installationId,
}: {
  login: string
  avatar_url: string
  installationId: number | null
}): Owner {
  return { login, avatarUrl: avatar_url, installationId }
}

export function toRepo(raw: RawRepo): Repo {
  return {
    id: raw.id,
    name: raw.name,
    fullName: raw.full_name,
    htmlUrl: raw.html_url,
    defaultBranch: raw.default_branch,
    archived: raw.archived,
    fork: raw.fork,
    private: raw.private,
  }
}

export function toRun({ raw, repo }: { raw: RawRun; repo: string }): Run {
  return {
    id: raw.id,
    repo,
    workflow: raw.name ?? 'Workflow',
    title: raw.display_title,
    branch: raw.head_branch ?? '',
    event: raw.event,
    actor: raw.actor?.login ?? '',
    state: runState({ status: raw.status, conclusion: raw.conclusion }),
    htmlUrl: raw.html_url,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  }
}

function stateRank(state: RunState): number {
  return RUN_STATE_ORDER.indexOf(state)
}
