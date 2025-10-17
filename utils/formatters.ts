export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export const formatMetric = (num: number, decimals = 2) => Number(num).toFixed(decimals)
