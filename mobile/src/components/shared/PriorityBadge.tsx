import React from 'react'
import { Badge } from '../ui/Badge'
import { getPriorityColor } from '../../utils/status'

type Props = { priority: string }

export function PriorityBadge({ priority }: Props) {
  return <Badge label={priority} color={getPriorityColor(priority)} />
}
