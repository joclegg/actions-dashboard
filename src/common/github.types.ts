import type { RUN_STATE } from '@/common/github.constants'

export interface ActionsData {
  login: string
  summaries: RepoSummary[]
  recent: Run[]
  hiddenCount: number
  updatedAt: number | null
  error: string | null
}

export interface CachedPage {
  etag: string
  body: unknown
  next: string | null
}

export interface Owner {
  login: string
  avatarUrl: string
  installationId: number | null
}

export interface RateLimit {
  limit: number
  remaining: number
  resetAt: number
}

export interface RawAccount {
  login: string
  avatar_url: string
}

export interface RawRepo {
  id: number
  name: string
  full_name: string
  html_url: string
  default_branch: string
  archived: boolean
  fork: boolean
  private: boolean
}

export interface RawRun {
  id: number
  name: string | null
  display_title: string
  head_branch: string | null
  event: string
  status: string
  conclusion: string | null
  html_url: string
  created_at: string
  updated_at: string
  actor: { login: string } | null
}

export interface Repo {
  id: number
  name: string
  fullName: string
  htmlUrl: string
  defaultBranch: string
  archived: boolean
  fork: boolean
  private: boolean
}

export interface RepoSummary {
  repo: Repo
  state: RunState
  lastRunAt: string | null
  workflows: WorkflowSummary[]
}

export interface Run {
  id: number
  repo: string
  workflow: string
  title: string
  branch: string
  event: string
  actor: string
  state: RunState
  htmlUrl: string
  createdAt: string
  updatedAt: string
}

export type RunState = (typeof RUN_STATE)[keyof typeof RUN_STATE]

interface WorkflowSummary {
  name: string
  run: Run
}
