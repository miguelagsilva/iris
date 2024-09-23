import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SafeGroupDto } from "@/types/api";
import { deleteGroup, getOrganizationGroups } from "@/lib/api";
import { useUser } from "@/hooks/user";
import DataTable from "@/components/custom/data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export function UserDashboardGroups() {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<SafeGroupDto[]>([])
  const { user } = useUser();
  const navigate = useNavigate()

  const columns = [
    {
      id:"name",
      label: "Name",
    },
    {
      id: "employees",
      label: "Employees",
      count: true,
    }
  ]

  async function fetchData() {
    setIsLoading(true)
    try {
      const groups = await getOrganizationGroups(user.organization.id)
      console.log(groups)
      setData(groups)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNew = () => navigate('new');
  const handleView = (item: SafeGroupDto) => navigate(`${item.id}`);
  const handleEdit = (item: SafeGroupDto) => navigate(`${item.id}/edit`);
  const handleDelete = async (item: SafeGroupDto) => {
    await deleteGroup(item.id)
    fetchData()
  };

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <div className="flex flex-col">
      <div className="flex flew-row justify-between pt-2">
        <span className="font-semibold text-3xl">
          Groups
        </span>
        <Button 
          size="sm" 
          className="h-8 gap-1"
          onClick={handleNew}
        >
          <PlusCircle className="h-3.5 w-3.5" />
          Add new group
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
