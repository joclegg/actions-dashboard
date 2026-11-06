import type { RunState } from '@/common/github.types'
import { cn } from '@/common/utils.functions'
import { STATUS_STYLE } from '@/components/StatusIcon/StatusIcon.constants'

export function StatusIcon({ state }: { state: RunState }) {
  const { label, icon: Icon, className } = STATUS_STYLE[state]
  return (
    <Icon
      role="img"
      aria-label={label}
      className={cn('size-4 shrink-0', className)}
    />
  )
}
