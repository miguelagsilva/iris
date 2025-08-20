import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteGroup, getGroupById } from "@/lib/api";
import { SafeEmployeeDto, SafeGroupDto } from "@/types/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";

export function UserDashboardGroupView() {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [group, setGroup] = useState<SafeGroupDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [groupFields, setGroupFields] = useState<[string, string | SafeEmployeeDto[]][] | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const excludeFields = ['id', 'organizationId'];

  // TODO: Change from add and remove requests to move the logic to create and update dtos

  const handleDelete = async () => {
    if (!group) return;
    setIsDeleting(true)
    try {
      await deleteGroup(group.id)
      navigate('/user/dashboard/groups');
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

  useEffect(() => {
    if (!groupId) {
      navigate('/user/dashboard/groups');
      return;
    }
    const fetchGroup = async () => { 
      try {
        setIsLoading(true);
        const fetchedGroup = await getGroupById(groupId);
        setGroup(fetchedGroup);
        const groupFields = Object.entries(fetchedGroup).filter(([key]) => !excludeFields.includes(key));
        setGroupFields(groupFields);
        console.log(fetchedGroup);
      } catch {
        navigate('/user/dashboard/groups');
      } finally {
        setIsLoading(false);
      }
    }
    fetchGroup();
  }, [groupId, navigate]);

  return (
    <>
      <div className="flex flex-row justify-between">
        <Button 
          onClick={() => navigate(-1)} 
          variant="outline" 
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="space-x-2">
          <Button 
            onClick={() => navigate('edit')} 
            variant="outline" 
            className="mb-4"
          >
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger>
              <Button 
                variant="outline" 
                className="mb-4"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </AlertDialogTrigger>
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
        </div>
      </div>
      {isLoading || !group || !groupFields ?
        <GroupSkeleton />
        :
        <Card>
          <CardHeader>
            <CardTitle>Group Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              {groupFields.map(([key, value]) => (
                <div key={key} className="border-t border-gray-200 pt-4">
                  <dt className="font-medium text-gray-500 capitalize">{key.replace(/_/g, ' ')}</dt>
                  {value instanceof Array && value.length > 0 ? (
                    <div className="mt-1">
                      <ul className="list-disc list-inside">
                        {value.map((employee: SafeEmployeeDto) => (
                          <li key={employee.id} className="text-blue-600 hover:text-blue-800 hover:underline">
                            <Link to={`/user/dashboard/employees/${employee.id}`} target="_blank" rel="noopener noreferrer">
                              {employee.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                  :
                  <dd className="mt-1 text-gray-900">{value?.toString() || 'N/A'}</dd>
                  }
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      }
    </>
  );
}

function GroupSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Group Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="border-t border-gray-200 pt-4">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="mt-1 h-4 w-2/3" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
