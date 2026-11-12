export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
