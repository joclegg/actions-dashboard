import { useEffect, useEffectEvent } from 'react'

import { useStoredState } from '@/common/storage.hooks'
import { REFRESH_STORAGE_KEY } from '@/components/RefreshPicker/RefreshPicker.constants'
import { parseInterval } from '@/components/RefreshPicker/RefreshPicker.functions'

export function useAutoRefresh({
  interval,
  lastRefresh,
  refresh,
}: {
  interval: number
  lastRefresh: number | null
  refresh: () => void
}): void {
  const tick = useEffectEvent(() => refresh())
  const isStale = useEffectEvent(
    () => lastRefresh === null || Date.now() - lastRefresh >= interval,
  )

  useEffect(() => {
    if (!interval) {
      return
    }
    let timer: ReturnType<typeof setInterval> | undefined
    function start() {
      stop()
      timer = setInterval(tick, interval)
    }
    function stop() {
      if (timer !== undefined) {
        clearInterval(timer)
        timer = undefined
      }
    }
    function onVisibilityChange() {
      if (document.hidden) {
        stop()
        return
      }
      if (isStale()) {
        tick()
      }
      start()
    }
    if (!document.hidden) {
      start()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [interval])
}

export function useRefreshInterval(): [number, (ms: number) => void] {
  return useStoredState({
    key: REFRESH_STORAGE_KEY,
    parse: parseInterval,
    serialise: String,
  })
}
