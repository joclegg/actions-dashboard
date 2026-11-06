import { THEME } from '@/components/ThemeToggle/ThemeToggle.constants'
import type { Theme } from '@/components/ThemeToggle/ThemeToggle.types'

const THEMES: readonly string[] = Object.values(THEME)

export function isTheme(value: unknown): value is Theme {
  return typeof value === 'string' && THEMES.includes(value)
}
