import { useState, useEffect } from 'react'
import type { Transaction } from '@/features/transactions/types'

const UNDO_DURATION_MS = 4000

type PendingEntry = {
  tx: Transaction
  timeoutId: ReturnType<typeof setTimeout>
}

export function usePendingDelete(onDelete: (id: string | number) => void) {
  const [pending, setPending] = useState<Record<string | number, PendingEntry>>({})

  const markForDelete = (tx: Transaction) => {
    const timeoutId = setTimeout(() => {
      onDelete(tx.id)
      setPending((prev) => {
        const next = { ...prev }
        delete next[tx.id]
        return next
      })
    }, UNDO_DURATION_MS)

    setPending((prev) => ({ ...prev, [tx.id]: { tx, timeoutId } }))
  }

  const undoDelete = (id: string | number) => {
    setPending((prev) => {
      const entry = prev[id]
      if (entry) clearTimeout(entry.timeoutId)
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  // Clear all pending timeouts on unmount
  useEffect(() => {
    return () => {
      setPending((prev) => {
        Object.values(prev).forEach(({ timeoutId }) => clearTimeout(timeoutId))
        return {}
      })
    }
  }, [])

  return { pending, markForDelete, undoDelete }
}
