import React from 'react'
import { Badge } from '../ui/Badge'
import { getStatusColor, getStatusLabel } from '../../utils/status'

type Props = { status: string }

export function StatusBadge({ status }: Props) {
  return <Badge label={getStatusLabel(status)} color={getStatusColor(status)} />
}
