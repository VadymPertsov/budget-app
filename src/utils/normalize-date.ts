import { parseISO, format } from 'date-fns'

export const normalizeDate = (isoDate: string) =>
  format(parseISO(isoDate), 'dd.MM.yy/HH:mm')
