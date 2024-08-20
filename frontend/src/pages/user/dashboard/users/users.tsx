import { Button } from "@/components/ui/button";
import { DataTable, PaginationState } from "@/components/ui/data-table";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { Eye, PencilLine, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { SafeUserDto } from "@/lib/Api";
import { api } from "@/services/apiService";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

export function UserDashboardUsers() {
  const [data, setData] = useState<SafeUserDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    elements: 0,
    pageCount: 0,
    pageIndex: 0,
    pageSize: 10,
  });
  const { toast } = useToast();
  const { user } = useAuth();

  const removeUserFromOrganization = async (targetUser: string) => {
    try {
      if (!user?.organizationId) {
        throw new Error("User has no organization ID.");
      }
      const response =
        await api.api.organizationsControllerRemoveUserFromOrganization(
          user.organizationId,
          targetUser,
        );
      if (response.status == 200) {
        toast({
          variant: "destructive",
          title: "User has been removed.",
          action: <ToastAction altText="Undo">Undo</ToastAction>,
        });
      }
      const newPagination = pagination;
      newPagination.pageIndex = 0;
      setPagination(newPagination);
      fetchData(pagination, sorting);
    } catch (err) {
      setError("Failed to fetch users. Please try again later.");
    }
  };

  const columns: ColumnDef<SafeUserDto>[] = [
    {
      accessorKey: "firstName",
      header: "First Name",
    },
    {
      accessorKey: "lastName",
      header: "Last Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const rowUser = row.original;

        return (
          <div className="justify-end flex flex-row gap-1 pr-10">
            <Button variant="outline" className="h-8 w-8 p-0">
              <span className="sr-only">View row</span>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="default" className="h-8 w-8 p-0">
              <span className="sr-only">Edit row</span>
              <PencilLine className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              className="h-8 w-8 p-0"
              onClick={() => removeUserFromOrganization(rowUser.id)}
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

  const fetchData = async (
    newPagination: Partial<PaginationState>,
    newSorting: SortingState,
  ) => {
    try {
      if (!user?.organizationId) {
        throw new Error("User has no organization ID.");
      }
      const response = await api.api.organizationsControllerGetPaginatedUsers(
        user?.organizationId,
        {
          page: (newPagination.pageIndex ?? pagination.pageIndex) + 1,
          limit: newPagination.pageSize ?? pagination.pageSize,
          sortBy: newSorting[0]?.id,
          sortOrder: newSorting[0]?.desc ? "ASC" : "DESC",
        },
        {},
      );
      setData(response.data.items as SafeUserDto[]);
      setPagination({
        elements: response.data.total,
        pageCount: response.data.pages,
        pageIndex: newPagination.pageIndex ?? pagination.pageIndex,
        pageSize: newPagination.pageSize ?? pagination.pageSize,
      });
      setSorting(newSorting);
      setError(null);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch users. Please try again later.");
    }
  };

  useEffect(() => {
    fetchData(pagination, sorting);
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
            <BreadcrumbLink>
              <Link to="/user/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Users</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="container mx-auto py-10">
        <DataTable
          modelName={"User"}
          columns={columns}
          data={data}
          sorting={sorting}
          pagination={pagination}
          fetchData={fetchData}
        />
      </div>
    </>
  );
}
