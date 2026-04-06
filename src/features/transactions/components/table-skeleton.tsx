import { Skeleton } from '@/components/ui/skeleton'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { PAGE_SIZE } from '@/features/transactions/constants'

export function TableSkeleton({ showActions = false }: { showActions?: boolean }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent border-border/40">
          <TableHead className="text-[13px] font-medium text-muted-foreground">Date</TableHead>
          <TableHead className="text-[13px] font-medium text-muted-foreground">Category</TableHead>
          <TableHead className="text-[13px] font-medium text-muted-foreground">Type</TableHead>
          <TableHead className="text-[13px] font-medium text-muted-foreground text-right">Amount</TableHead>
          {showActions && (
            <TableHead className="text-[13px] font-medium text-muted-foreground text-right">Actions</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: PAGE_SIZE }).map((_, i) => (
          <TableRow key={i} className="border-border/30">
            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
            <TableCell><Skeleton className="h-4 w-28" /></TableCell>
            <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
            <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
            {showActions && (
              <TableCell className="text-right"><Skeleton className="h-6 w-12 ml-auto rounded-full" /></TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
