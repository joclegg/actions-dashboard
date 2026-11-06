import { useState } from 'react'

import type { Owner } from '@/common/github.types'
import { Button } from '@/components/Button/Button'
import { BUTTON_VARIANT } from '@/components/Button/Button.constants'

export function OwnerPicker({
  owners,
  value,
  onChange,
}: {
  owners: Owner[]
  value: Owner | null
  onChange: (owner: Owner) => void
}) {
  const [typed, setTyped] = useState('')
  const listed = owners.some((owner) => owner.login === value?.login)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        aria-label="User or organisation"
        className="h-8 rounded-lg border border-border bg-background px-2 text-sm dark:border-input dark:bg-input/30"
        value={value?.login ?? ''}
        onChange={(event) => {
          const owner = owners.find(
            (candidate) => candidate.login === event.target.value,
          )
          if (owner) {
            onChange(owner)
          }
        }}
      >
        {!value && <option value="">Choose…</option>}
        {value && !listed && <option value={value.login}>{value.login}</option>}
        {owners.map((owner) => (
          <option key={owner.login} value={owner.login}>
            {owner.login}
            {owner.installationId === null ? '' : ' (installed)'}
          </option>
        ))}
      </select>
      <form
        className="flex items-center gap-1"
        onSubmit={(event) => {
          event.preventDefault()
          const login = typed.trim()
          if (login) {
            onChange(
              owners.find(
                (owner) => owner.login.toLowerCase() === login.toLowerCase(),
              ) ?? { login, avatarUrl: '', installationId: null },
            )
            setTyped('')
          }
        }}
      >
        <input
          aria-label="Any user or organisation"
          placeholder="Any user or org"
          className="h-8 w-40 rounded-lg border border-border bg-background px-2 text-sm dark:border-input dark:bg-input/30"
          value={typed}
          onChange={(event) => setTyped(event.target.value)}
        />
        <Button type="submit" variant={BUTTON_VARIANT.OUTLINE}>
          Show
        </Button>
      </form>
    </div>
  )
}
