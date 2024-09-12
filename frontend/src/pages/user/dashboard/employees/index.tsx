import { Button } from "@/components/ui/button";
import { DataTable, PaginationState } from "@/components/ui/data-table";
import { ColumnDef, ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { Eye, PencilLine, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import { SafeEmployeeDto } from "@/types/api";
import { getOrganizationEmployees } from "@/lib/api";
import { useUser } from "@/hooks/user";

export function UserDashboardEmployees() {
  const navigate = useNavigate();
  const [data, setData] = useState<SafeEmployeeDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filtering, setFiltering] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({ elements: 0, pageCount: 0, pageIndex: 0, pageSize: 10});
  const { toast } = useToast()
  const { user } = useUser();

  const removeEmployeeFromOrganization = async (targetEmployee: string) => {
    try {
      await removeEmployeeFromOrganization(targetEmployee);
      toast({
        variant: "destructive",
        title: "Employee has been removed.",
        action: (
          <ToastAction altText="Undo">
            Undo
          </ToastAction>
        )
      })
      const newPagination = pagination;
      newPagination.pageIndex = 0;
      setPagination(newPagination);
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
            <Link 
              to={rowEmployee.id}
            >
              <Button 
                variant="outline" 
                className="h-8 w-8 p-0"
              >
                <span className="sr-only">View row</span>
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
            <Link 
              to={`${rowEmployee.id}/edit`}
            >
              <Button 
                variant="default" 
                className="h-8 w-8 p-0"
              >
                <span className="sr-only">Edit row</span>
                <PencilLine className="h-4 w-4" />
              </Button>
            </Link>
            <Button 
              variant="destructive" 
              className="h-8 w-8 p-0"
              onClick={() => removeEmployeeFromOrganization(rowEmployee.id)}
            >
              <span className="sr-only">Delete row</span>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
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
        <DataTable 
          enableSelection={false}
          columns={columns} 
          data={data} 
          filtering={filtering}
          sorting={sorting}
          pagination={pagination}
          fetchData={fetchData}
          buttonLabel="Add Employee"
          buttonAction={() => navigate("new")}
        />
      </div>
    </>
  );
}
