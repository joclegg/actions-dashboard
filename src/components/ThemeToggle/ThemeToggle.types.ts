import type { LucideIcon } from 'lucide-react'

import type { THEME } from '@/components/ThemeToggle/ThemeToggle.constants'

export type Theme = (typeof THEME)[keyof typeof THEME]

export interface ThemeOption {
  next: Theme
  label: string
  icon: LucideIcon
}
