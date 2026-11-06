import { RefreshCw } from 'lucide-react'

import { cn } from '@/common/utils.functions'
import { Button } from '@/components/Button/Button'
import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
} from '@/components/Button/Button.constants'
import { REFRESH_OPTIONS } from '@/components/RefreshPicker/RefreshPicker.constants'

export function RefreshPicker({
  interval,
  loading,
  onIntervalChange,
  onRefresh,
}: {
  interval: number
  loading: boolean
  onIntervalChange: (ms: number) => void
  onRefresh: () => void
}) {
  return (
    <div className="flex items-center">
      <Button
        variant={BUTTON_VARIANT.OUTLINE}
        size={BUTTON_SIZE.ICON}
        className="rounded-r-none"
        aria-label="Refresh now"
        disabled={loading}
        onClick={onRefresh}
      >
        <RefreshCw className={cn(loading && 'animate-spin')} />
      </Button>
      <select
        aria-label="Auto-refresh"
        className="h-8 rounded-r-lg border border-l-0 border-border bg-background px-2 text-sm dark:border-input dark:bg-input/30"
        value={interval}
        onChange={(event) => onIntervalChange(Number(event.target.value))}
      >
        {REFRESH_OPTIONS.map((option) => (
          <option key={option.ms} value={option.ms}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
