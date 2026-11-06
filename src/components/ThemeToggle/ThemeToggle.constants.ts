import { Moon, Sun } from 'lucide-react'

import type {
  Theme,
  ThemeOption,
} from '@/components/ThemeToggle/ThemeToggle.types'

export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
} as const

export const DEFAULT_THEME: Theme = THEME.DARK

export const THEME_STORAGE_KEY = 'theme'

export const THEME_OPTION: Record<Theme, ThemeOption> = {
  [THEME.DARK]: { next: THEME.LIGHT, label: 'Switch to light mode', icon: Sun },
  [THEME.LIGHT]: { next: THEME.DARK, label: 'Switch to dark mode', icon: Moon },
}
