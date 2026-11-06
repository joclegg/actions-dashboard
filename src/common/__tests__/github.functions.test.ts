import { describe, expect, it } from 'vitest'

import { RUN_STATE } from '@/common/github.constants'
import {
  nextPageUrl,
  readRateLimit,
  recentRuns,
  runState,
  sortSummaries,
  summariseRepo,
} from '@/common/github.functions'
import type { Repo, Run } from '@/common/github.types'

const REPO: Repo = {
  id: 1,
  name: 'app',
  fullName: 'jo/app',
  htmlUrl: 'https://github.com/jo/app',
  defaultBranch: 'main',
  archived: false,
  fork: false,
  private: false,
}

describe('runState', () => {
  it('reads running and queued runs', () => {
    expect(runState({ status: 'in_progress', conclusion: null })).toBe(
      RUN_STATE.RUNNING,
    )
    expect(runState({ status: 'waiting', conclusion: null })).toBe(
      RUN_STATE.QUEUED,
    )
  })

  it('reads completed runs by conclusion', () => {
    expect(runState({ status: 'completed', conclusion: 'success' })).toBe(
      RUN_STATE.PASSED,
    )
    expect(runState({ status: 'completed', conclusion: 'timed_out' })).toBe(
      RUN_STATE.FAILED,
    )
    expect(runState({ status: 'completed', conclusion: 'cancelled' })).toBe(
      RUN_STATE.CANCELLED,
    )
    expect(runState({ status: 'completed', conclusion: 'skipped' })).toBe(
      RUN_STATE.SKIPPED,
    )
  })
})

describe('summariseRepo', () => {
  it('takes each workflow’s latest run on the default branch', () => {
    const summary = summariseRepo({
      repo: REPO,
      runs: [
        run({ id: 3, workflow: 'CI', state: RUN_STATE.PASSED, at: '03' }),
        run({ id: 2, workflow: 'CI', state: RUN_STATE.FAILED, at: '02' }),
        run({ id: 1, workflow: 'Deploy', state: RUN_STATE.FAILED, at: '01' }),
        run({ id: 4, workflow: 'CI', branch: 'pr', at: '04' }),
      ],
    })
    expect(summary.workflows.map((workflow) => workflow.run.id)).toEqual([3, 1])
    expect(summary.state).toBe(RUN_STATE.FAILED)
    expect(summary.lastRunAt).toBe('2026-11-04T00:00:00Z')
  })

  it('has no state without default-branch runs', () => {
    const summary = summariseRepo({ repo: REPO, runs: [] })
    expect(summary.state).toBe(RUN_STATE.NONE)
    expect(summary.lastRunAt).toBeNull()
  })
})

describe('sortSummaries', () => {
  it('puts failures first, then the most recent', () => {
    const sorted = sortSummaries([
      summary({ name: 'old', state: RUN_STATE.PASSED, at: '01' }),
      summary({ name: 'new', state: RUN_STATE.PASSED, at: '02' }),
      summary({ name: 'broken', state: RUN_STATE.FAILED, at: '01' }),
    ])
    expect(sorted.map((item) => item.repo.name)).toEqual([
      'broken',
      'new',
      'old',
    ])
  })
})

describe('recentRuns', () => {
  it('lists the newest runs first, up to the limit', () => {
    const runs = recentRuns({
      runs: [
        run({ id: 1, at: '01' }),
        run({ id: 2, at: '03' }),
        run({ id: 3, at: '02' }),
      ],
      limit: 2,
    })
    expect(runs.map((item) => item.id)).toEqual([2, 3])
  })
})

describe('nextPageUrl', () => {
  it('finds the next link', () => {
    expect(
      nextPageUrl(
        '<https://api.github.com/x?page=2>; rel="next", <https://api.github.com/x?page=5>; rel="last"',
      ),
    ).toBe('https://api.github.com/x?page=2')
    expect(nextPageUrl(null)).toBeNull()
  })
})

describe('readRateLimit', () => {
  it('reads GitHub’s headers', () => {
    const headers = new Headers({
      'x-ratelimit-limit': '5000',
      'x-ratelimit-remaining': '4990',
      'x-ratelimit-reset': '100',
    })
    expect(readRateLimit(headers)).toEqual({
      limit: 5000,
      remaining: 4990,
      resetAt: 100_000,
    })
    expect(readRateLimit(new Headers())).toBeNull()
  })
})

function run({
  id,
  at,
  workflow = 'CI',
  branch = 'main',
  state = RUN_STATE.PASSED,
}: {
  id: number
  at: string
  workflow?: string
  branch?: string
  state?: Run['state']
}): Run {
  return {
    id,
    repo: 'app',
    workflow,
    title: `Run ${id}`,
    branch,
    event: 'push',
    actor: 'jo',
    state,
    htmlUrl: `https://github.com/jo/app/actions/runs/${id}`,
    createdAt: `2026-11-${at}T00:00:00Z`,
    updatedAt: `2026-11-${at}T00:00:00Z`,
  }
}

function summary({
  name,
  state,
  at,
}: {
  name: string
  state: Run['state']
  at: string
}) {
  return {
    repo: { ...REPO, name },
    state,
    lastRunAt: `2026-11-${at}T00:00:00Z`,
    workflows: [],
  }
}
