import React, { memo, useMemo } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table'
import { Button } from './button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface OptimizedTableProps<T> {
  data: T[]
  columns: {
    key: keyof T
    label: string
    render?: (value: any, item: T) => React.ReactNode
  }[]
  pagination?: {
    page: number
    totalPages: number
    onPageChange: (page: number) => void
  }
  loading?: boolean
}

// Tabla optimizada con virtualización básica y memoización
function OptimizedTableComponent<T extends { id: string | number }>({
  data,
  columns,
  pagination,
  loading
}: OptimizedTableProps<T>) {
  // Memoizar las filas para evitar re-renders innecesarios
  const memoizedRows = useMemo(() => {
    return data.map((item) => (
      <TableRow key={item.id}>
        {columns.map((column) => (
          <TableCell key={String(column.key)}>
            {column.render 
              ? column.render(item[column.key], item)
              : String(item[column.key] || '')
            }
          </TableCell>
        ))}
      </TableRow>
    ))
  }, [data, columns])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={String(column.key)}>{column.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {memoizedRows}
        </TableBody>
      </Table>

      {pagination && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Página {pagination.page + 1} de {pagination.totalPages}
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export const OptimizedTable = memo(OptimizedTableComponent) as typeof OptimizedTableComponent