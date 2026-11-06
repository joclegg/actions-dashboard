import type {
  BUTTON_SIZE,
  BUTTON_VARIANT,
} from '@/components/Button/Button.constants'

export type ButtonSize = (typeof BUTTON_SIZE)[keyof typeof BUTTON_SIZE]

export type ButtonVariant = (typeof BUTTON_VARIANT)[keyof typeof BUTTON_VARIANT]
