import { Button } from "@/components/ui/button";
import DataTableDemo, { DataTable } from "@/components/custom/data-table";
import { ColumnDef, ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { Eye, PencilLine } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import { SafeEmployeeDto } from "@/types/api";
import { deleteEmployee, getOrganizationEmployees } from "@/lib/api";
import { useUser } from "@/hooks/user";
import RemovalAlert from "@/components/custom/removal-alert";

export function UserDashboardEmployees() {
  const navigate = useNavigate();
  const [data, setData] = useState<SafeEmployeeDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filtering, setFiltering] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<any>({ elements: 0, pageCount: 0, pageIndex: 0, pageSize: 10});
  const { user } = useUser();

  const removeEmployeeFromOrganization = async (targetEmployee: string) => {
    try {
      await deleteEmployee(targetEmployee);
      setPagination(newPagination => ({ ...newPagination, pageIndex: 0 }));
      fetchData(pagination, sorting, filtering);
    } catch (err) {
      setError("Failed to fetch users. Please try again later.");
    } 
  }

  const columns: ColumnDef<SafeEmployeeDto>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "phone_number",
      header: "Phone number",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const rowEmployee = row.original;

        return (
          <div className="justify-end flex flex-row gap-1 pr-10">
            <Button 
              variant="outline" 
              className="h-8 w-8 p-0"
              onClick={() => navigate(rowEmployee.id)}
            >
              <span className="sr-only">View row</span>
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              variant="default" 
              className="h-8 w-8 p-0"
              onClick={() => navigate(`${rowEmployee.id}/edit`)}
            >
              <span className="sr-only">Edit row</span>
              <PencilLine className="h-4 w-4" />
            </Button>
            <RemovalAlert
              itemName={rowEmployee.name}
              itemType="Employee"
              description="This action cannot be undone. This will permanently remove the employee's account and all associated data from our servers."
              onConfirmRemoval={() => removeEmployeeFromOrganization(rowEmployee.id)}
            />
          </div>
        );
      },
    },
  ];

  const fetchData = async (newPagination: Partial<PaginationState>, newSorting: SortingState, newFiltering: ColumnFiltersState) => {
    try {
      const paginatedEmployees = await getOrganizationEmployees(
        user.organization.id, 
        { 
          page: (newPagination.pageIndex ?? pagination.pageIndex)+1,
          limit: newPagination.pageSize ?? pagination.pageSize, 
          filterBy: newFiltering[0]?.id,
          filterValue: newFiltering[0]?.value as string,
          sortBy: newSorting[0]?.id,
          sortOrder: newSorting[0]?.desc ? "ASC" : "DESC",
        },
      )
      setData(paginatedEmployees.items);
      setPagination({
        elements: paginatedEmployees.total,
        pageCount: paginatedEmployees.pages,
        pageIndex: newPagination.pageIndex ?? pagination.pageIndex,
        pageSize: newPagination.pageSize ?? pagination.pageSize,
      })
      setFiltering(newFiltering);
      setSorting(newSorting);
      console.log("filtering", filtering);
      setError(null);
    } catch (err) {
      console.log(err)
      setError("Failed to fetch users. Please try again later.");
    } 
  }

  useEffect(() => {
    fetchData(pagination, sorting, filtering);
    // TODO USE MEMOIZATION TO AVOID HAVING THAT eslint-disable-next-line
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink><Link to="/user/dashboard">Dashboard</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Employees</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="container mx-auto py-10">
        <DataTableDemo/>
      </div>
    </>
  );
}
