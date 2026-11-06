import { Button } from '@/components/Button/Button'
import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
} from '@/components/Button/Button.constants'
import { THEME_OPTION } from '@/components/ThemeToggle/ThemeToggle.constants'
import { useTheme } from '@/components/ThemeToggle/ThemeToggle.hooks'

export function ThemeToggle() {
  const [theme, setTheme] = useTheme()
  const { next, label, icon: Icon } = THEME_OPTION[theme]

  return (
    <Button
      variant={BUTTON_VARIANT.OUTLINE}
      size={BUTTON_SIZE.ICON}
      aria-label={label}
      onClick={() => setTheme(next)}
    >
      <Icon />
    </Button>
  )
}
