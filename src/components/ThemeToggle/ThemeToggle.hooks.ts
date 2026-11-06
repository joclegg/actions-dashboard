import { useEffect, useState } from 'react'

import {
  DEFAULT_THEME,
  THEME,
  THEME_STORAGE_KEY,
} from '@/components/ThemeToggle/ThemeToggle.constants'
import { isTheme } from '@/components/ThemeToggle/ThemeToggle.functions'
import type { Theme } from '@/components/ThemeToggle/ThemeToggle.types'

export function useTheme(): [Theme, (theme: Theme) => void] {
  const [theme, setTheme] = useState<Theme>(readStoredTheme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  return [theme, setTheme]
}

function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle(THEME.DARK, theme === THEME.DARK)
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    return
  }
}

function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return isTheme(stored) ? stored : DEFAULT_THEME
  } catch {
    return DEFAULT_THEME
  }
}
