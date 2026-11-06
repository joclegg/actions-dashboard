import { Button as ButtonPrimitive } from '@base-ui/react/button'

import { cn } from '@/common/utils.functions'
import {
  BUTTON_BASE_CLASS,
  BUTTON_SIZE,
  BUTTON_SIZE_CLASS,
  BUTTON_VARIANT,
  BUTTON_VARIANT_CLASS,
} from '@/components/Button/Button.constants'
import type {
  ButtonSize,
  ButtonVariant,
} from '@/components/Button/Button.types'

export function Button({
  className,
  variant = BUTTON_VARIANT.GHOST,
  size = BUTTON_SIZE.DEFAULT,
  ...props
}: ButtonPrimitive.Props & { variant?: ButtonVariant; size?: ButtonSize }) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(
        BUTTON_BASE_CLASS,
        BUTTON_VARIANT_CLASS[variant],
        BUTTON_SIZE_CLASS[size],
        className,
      )}
      {...props}
    />
  )
}
