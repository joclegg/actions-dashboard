import type { Owner } from '@/common/github.types'

export function parseOwner(stored: string | null): Owner | null {
  if (!stored) {
    return null
  }
  try {
    const value: unknown = JSON.parse(stored)
    return isOwner(value) ? value : null
  } catch {
    return null
  }
}

function isOwner(value: unknown): value is Owner {
  return (
    typeof value === 'object' &&
    value !== null &&
    'login' in value &&
    typeof value.login === 'string' &&
    'installationId' in value &&
    (value.installationId === null || typeof value.installationId === 'number')
  )
}
