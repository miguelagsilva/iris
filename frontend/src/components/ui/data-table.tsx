import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
  Table as ReactTable,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import React, { ReactNode, useState } from "react";
import { Input } from "./input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./dropdown-menu";
import {
  ChevronLeft,
  ChevronRight,
  Settings2,
  Search,
  PlusCircle,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from "lucide-react";
import { Checkbox } from "./checkbox";
import { Link } from "react-router-dom";

export type PaginationState = {
  elements: number;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
};

const createSelectColumn = <TData,>(): ColumnDef<TData> => ({
  id: "select",
  header: ({ table }) => (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && "indeterminate")
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
    />
  ),
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
    />
  ),
  enableSorting: false,
  enableHiding: false,
});

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  enableColumnVisibility?: boolean;
  enableSelection?: boolean;
  enablePagination?: boolean;
  enableFiltering?: boolean;
  enableSorting?: boolean;
  filtering: ColumnFiltersState;
  sorting: SortingState;
  pagination: PaginationState;
  fetchData: (
    pagination: Partial<PaginationState>,
    sorting: SortingState,
    filtering: ColumnFiltersState,
  ) => Promise<void>;
  buttonLabel?: string,
  buttonAction?: () => void,
}

export function DataTable<TData, TValue>({
  columns,
  data,
  enableColumnVisibility = false,
  enableSelection = true,
  enablePagination = true,
  enableFiltering = true,
  enableSorting = true,
  filtering,
  sorting,
  pagination,
  fetchData,
  buttonLabel,
  buttonAction,
}: DataTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);

  const allColumns = React.useMemo(() => {
    if (enableSelection) {
      return [createSelectColumn<TData>(), ...columns];
    }
    return columns;
  }, [enableSelection, columns]);

  const table = useReactTable({
    data,
    columns: allColumns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    enableSorting,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    state: {
      sorting,
      pagination,
      columnVisibility,
      rowSelection,
    },
    onColumnFiltersChange: (updater) => {
      setIsLoading(true);
      if (updater instanceof Function) {
        const newFiltering = updater(filtering);
        fetchData(pagination, sorting, newFiltering);
      } else {
        fetchData(pagination, sorting, updater);
      }
      setIsLoading(false);
    },
    onSortingChange: (updater) => {
      setIsLoading(true);
      if (updater instanceof Function) {
        const newSorting = updater(sorting);
        fetchData(pagination, newSorting, filtering);
      } else {
        fetchData(pagination, updater, filtering);
      }
      setIsLoading(false);
    },
    onPaginationChange: (updater) => {
      setIsLoading(true);
      if (updater instanceof Function) {
        const newPagination = updater(pagination);
        fetchData(newPagination, sorting, filtering);
      } else {
        fetchData(updater, sorting, filtering);
      }
      setIsLoading(false);
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center py-4">
        {enableFiltering &&
          <DataTableFilteringInput<TData> table={table} />
        }
        <div className="ml-auto flex items-center gap-2">
          {enableColumnVisibility && (
            <DataTableColumnVisibilityButton<TData> table={table} />
          )}
          {buttonLabel &&
            <Button 
              size="sm" 
              className="h-8 gap-1"
              onClick={buttonAction}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              {buttonLabel}
            </Button>
          }
        </div>
      </div>
      <div className="rounded-md border border-gray-200">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div className="flex items-center">
                          {typeof header.column.columnDef.header ===
                          "function" ? (
                            flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )
                          ) : (
                            <Button
                              variant="ghost"
                              onClick={header.column.getToggleSortingHandler()}
                              disabled={!header.column.getCanSort()}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                              {header.column.getCanSort() && (
                                <span className="ml-2">
                                  {header.column.getIsSorted() === "asc" ? (
                                    <ArrowUp className="h-4 w-4" />
                                  ) : header.column.getIsSorted() === "desc" ? (
                                    <ArrowDown className="h-4 w-4" />
                                  ) : (
                                    <ArrowUpDown className="h-4 w-4" />
                                  )}
                                </span>
                              )}
                            </Button>
                          )}
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={allColumns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {enablePagination && <DataTablePagination table={table} />}
    </div>
  );
}

const DataTableColumnVisibilityButton = <TData,>({
  table,
}: {
  table: ReactTable<TData>;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Settings2 className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Columns
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Columns visible</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const DataTablePagination = <TData,>({
  table,
}: {
  table: ReactTable<TData>;
}) => {
  const pagination = table.getState().pagination as PaginationState;
  const currentPage = pagination.pageIndex + 1;
  const totalPages = pagination.pageCount;

  const generatePageNumbers = () => {
    const pageNumbers = [];
    const pagesToShow = 5;
    const sidePages = Math.floor((pagesToShow - 1) / 2);

    let startPage = Math.max(currentPage - sidePages, 1);
    const endPage = Math.min(startPage + pagesToShow - 1, totalPages);

    if (endPage - startPage + 1 < pagesToShow) {
      startPage = Math.max(endPage - pagesToShow + 1, 1);
    }

    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) {
        pageNumbers.push("...");
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="columns-3 w-full px-2 pt-4">
      <div className="text-sm text-muted-foreground w-full">
        {pagination.elements} row(s).
      </div>
      <div className="w-full">
        <div className="flex items-center justify-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {generatePageNumbers().map((pageNumber, index) => (
            <React.Fragment key={index}>
              {pageNumber === "..." ? (
                <span className="px-2">...</span>
              ) : (
                <Button
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => table.setPageIndex((pageNumber as number) - 1)}
                  disabled={currentPage === pageNumber}
                >
                  {pageNumber}
                </Button>
              )}
            </React.Fragment>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const DataTableFilteringInput = <TData,>({
  table,
}: {
    table: ReactTable<TData>;
  }) => {
  const [inputValue, setInputValue] = useState(table.getAllColumns()[1]?.getFilterValue() as string ?? "");

  const handleFilterSubmit = (event: any) => {
    event.preventDefault();
    table.getAllColumns()[1]?.setFilterValue(inputValue);
    console.log("Form submitted with value:", inputValue);
  };

  return (
    <form onSubmit={handleFilterSubmit} className="relative w-full md:w-auto">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={`Filter by ${table.getAllColumns()[1].columnDef.header?.toString().toLowerCase()}...`}
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
      />
    </form>
  );
}
