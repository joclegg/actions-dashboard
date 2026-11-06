import type {
  ButtonSize,
  ButtonVariant,
} from '@/components/Button/Button.types'

export const BUTTON_VARIANT = {
  OUTLINE: 'outline',
  GHOST: 'ghost',
} as const

export const BUTTON_SIZE = {
  DEFAULT: 'default',
  ICON: 'icon',
} as const

export const BUTTON_BASE_CLASS =
  "inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

export const BUTTON_VARIANT_CLASS: Record<ButtonVariant, string> = {
  [BUTTON_VARIANT.OUTLINE]:
    'border-border bg-background hover:bg-muted hover:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
  [BUTTON_VARIANT.GHOST]:
    'hover:bg-muted hover:text-foreground dark:hover:bg-muted/50',
}

export const BUTTON_SIZE_CLASS: Record<ButtonSize, string> = {
  [BUTTON_SIZE.DEFAULT]: 'h-8 gap-1.5 px-2.5',
  [BUTTON_SIZE.ICON]: 'size-8',
}
