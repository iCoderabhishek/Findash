export function paginate<T>(items: T[], page: number, pageSize: number) {
  const total = items.length
  const totalPages = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const paginatedData = items.slice(start, end)

  return {
    data: paginatedData,
    total,
    totalPages,
    range: `${start + 1}-${Math.min(end, total)} of ${total}`,
  }
}
