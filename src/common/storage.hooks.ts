import { useCallback, useRef, useState } from 'react'

export function useStoredState<T>({
  key,
  parse,
  serialise,
}: {
  key: string
  parse: (stored: string | null) => T
  serialise: (value: T) => string | null
}): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => parse(readStored(key)))
  const serialiseRef = useRef(serialise)

  const update = useCallback(
    (next: T) => {
      setValue(next)
      writeStored({ key, value: serialiseRef.current(next) })
    },
    [key],
  )

  return [value, update]
}

function readStored(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStored({
  key,
  value,
}: {
  key: string
  value: string | null
}): void {
  try {
    if (value === null) {
      localStorage.removeItem(key)
    } else {
      localStorage.setItem(key, value)
    }
  } catch {
    return
  }
}
