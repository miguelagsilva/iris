import * as React from "react"
import {
  Table as ReactTable,
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronLeft, ChevronRight, ArrowDown, ArrowUp, ArrowUpDown, ChevronDown, MoreHorizontal, Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog"
import { useToast } from "../ui/use-toast"

interface DataTableProps<TData> {
  columns: { 
    id: string,
    label: string,
    count?: boolean
  }[]
  data: TData[]
  isLoading?: boolean
  onView: (item: TData) => void
  onEdit: (item: TData) => void
  onDelete: (item: TData) => Promise<void>
}

export default function DataTable<TData extends { id: string }>({
  columns,
  data,
  isLoading = false,
  onView,
  onEdit,
  onDelete,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const { toast } = useToast()

  const tableColumns: ColumnDef<TData>[] = React.useMemo(
    () => [
      ...columns.map((col): ColumnDef<TData> => ({
        accessorKey: col.id.toLowerCase(),
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={column.getToggleSortingHandler()}
              disabled={!column.getCanSort()}
            >
              {col.label}
              {column.getCanSort() &&
                column.getIsSorted() === "asc" ? (
                  <ArrowUp className="ml-2 h-4 w-4" />
                ) : column.getIsSorted() === "desc" ? (
                  <ArrowDown className="ml-2 h-4 w-4" />
                ) : (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )
              }
            </Button>
          )
        },
        cell: ({ row }) => {
          const value = row.getValue(col.id.toLowerCase());
          if (col.count && Array.isArray(value)) {
            const names = value.map(item => item.name);
            const displayedNames = names.join(', ').slice(0, 40);
            console.log(displayedNames)
            const hasMore = displayedNames.length < names.join(', ').length;
            const moreIndicator = hasMore ? '...' : '';
            console.log(value)
            return <div className="text-ellipsis overflow-hidden">({value.length}) {displayedNames}{moreIndicator}</div>;
          }
          return <div>{value as React.ReactNode}</div>;
        },
      })),
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const item = row.original
          const [isAlertOpen, setIsAlertOpen] = React.useState(false)
          const [isDeleting, setIsDeleting] = React.useState(false)

          const handleDelete = async () => {
            setIsDeleting(true)
            try {
              await onDelete(item)
              setIsAlertOpen(false)
              table.setPageIndex(0)
              toast({
                title: "Item deleted",
                description: "The item has been successfully deleted.",
                variant: "success",
              })
            } catch (error) {
              toast({
                title: "Error",
                description: "Failed to delete the item. Please try again.",
                variant: "destructive",
              })
            } finally {
              setIsDeleting(false)
            }
          }

          return (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onView(item)}>
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(item)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setIsAlertOpen(true)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogHeader>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the item and all of its data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                      {isDeleting ? "Removing..." : "Continue"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )
        },
      },
    ],
    [columns, onView, onEdit, onDelete]
  )

  const table = useReactTable({
    data,
    columns: tableColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex items-center py-4">
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="ml-auto h-8 w-[100px]" />
        </div>
        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.id}>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 10 }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton className="h-8 w-[100px]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Skeleton className="h-8 w-[100px]" />
          <Skeleton className="h-8 w-[70px]" />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 py-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Filter ${columns[0].label.toLowerCase()}...`}
            value={(table.getColumn(columns[0].id.toLowerCase())?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn(columns[0].id.toLowerCase())?.setFilterValue(event.target.value)
            }
            className="w-full pl-8 sm:w-[200px] lg:w-[250px] border rounded-md"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {columns.find((col) => col.id === column.id)?.label}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-x-auto rounded-md border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}

interface DataTablePaginationProps<TData> {
  table: ReactTable<TData>
}

function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 py-4">
      <div className="flex items-center justify-center space-x-2 overflow-x-auto">
        <p className="text-sm font-medium">Rows per page</p>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value))
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-center space-x-2 overflow-x-auto">
        <Button
          variant="outline"
          className="h-8 w-8 p-0 sm:flex"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to first page</span>
          <ChevronLeft className="h-4 w-4" />
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center justify-center space-x-2 overflow-x-auto">
          {Array.from({ length: table.getPageCount() }, (_, i) => i + 1)
            .filter(page => 
              page === 1 || 
                page === table.getPageCount() || 
                Math.abs(page - (table.getState().pagination.pageIndex + 1)) <= 1
            )
            .map((page, index, array) => (
              <React.Fragment key={page}>
                {index > 0 && array[index - 1] !== page - 1 && (
                  <span className="px-1">...</span>
                )}
                <Button
                  variant={page === table.getState().pagination.pageIndex + 1 ? "default" : "outline"}
                  className="h-8 w-8 p-0"
                  onClick={() => table.setPageIndex(page - 1)}
                >
                  {page}
                </Button>
              </React.Fragment>
            ))
          }
        </div>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0 sm:flex"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to last page</span>
          <ChevronRight className="h-4 w-4" />
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center justify-center sm:justify-end">
        <div className="text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
      </div>
    </div>
  )
}
