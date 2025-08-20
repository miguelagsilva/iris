import { useEffect, useState } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import { SafeEmployeeDto } from "@/types/api";
import { deleteEmployee, getOrganizationEmployees } from "@/lib/api";
import { useUser } from "@/hooks/user";
import DataTable from "@/components/custom/data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export function UserDashboardEmployees() {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<SafeEmployeeDto[]>([])
  const { user } = useUser();
  const navigate = useNavigate()

  const columns = [
    {
      id:"name",
      label: "Name",
    },
    {
      id:"phone_number",
      label: "Phone number",
    }
  ]

  async function fetchData() {
    setIsLoading(true)
    try {
      const employees = await getOrganizationEmployees(user.organization.id)
      setData(employees)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNew = () => navigate('new');
  const handleView = (item: SafeEmployeeDto) => navigate(`${item.id}`);
  const handleEdit = (item: SafeEmployeeDto) => navigate(`${item.id}/edit`);
  const handleDelete = async (item: SafeEmployeeDto) => {
    await deleteEmployee(item.id)
    fetchData()
  };

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <div className="flex flex-col">
      <div className="flex flew-row justify-between pt-2">
        <span className="font-semibold text-3xl">
          Employees
        </span>
        <Button 
          size="sm" 
          className="h-8 gap-1"
          onClick={handleNew}
        >
          <PlusCircle className="h-3.5 w-3.5" />
          Add new employee
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}
