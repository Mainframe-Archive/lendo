// @flow
import { format } from 'date-fns'

export default function toShortDate(date: Date | string | number): string {
  return format(date, 'MM/DD/YYYY')
}
