import {
  Ban,
  CircleCheck,
  CircleDashed,
  CircleDot,
  CircleMinus,
  CircleX,
  LoaderCircle,
} from 'lucide-react'

import { RUN_STATE } from '@/common/github.constants'
import type { RunState } from '@/common/github.types'
import type { StatusStyle } from '@/components/StatusIcon/StatusIcon.types'

export const STATUS_STYLE: Record<RunState, StatusStyle> = {
  [RUN_STATE.FAILED]: {
    label: 'Failed',
    icon: CircleX,
    className: 'text-red-600 dark:text-red-400',
  },
  [RUN_STATE.RUNNING]: {
    label: 'Running',
    icon: LoaderCircle,
    className: 'animate-spin text-amber-600 dark:text-amber-400',
  },
  [RUN_STATE.QUEUED]: {
    label: 'Queued',
    icon: CircleDot,
    className: 'text-amber-600 dark:text-amber-400',
  },
  [RUN_STATE.CANCELLED]: {
    label: 'Cancelled',
    icon: Ban,
    className: 'text-muted-foreground',
  },
  [RUN_STATE.PASSED]: {
    label: 'Passed',
    icon: CircleCheck,
    className: 'text-green-600 dark:text-green-400',
  },
  [RUN_STATE.SKIPPED]: {
    label: 'Skipped',
    icon: CircleMinus,
    className: 'text-muted-foreground',
  },
  [RUN_STATE.NONE]: {
    label: 'No runs on the default branch',
    icon: CircleDashed,
    className: 'text-muted-foreground',
  },
}
