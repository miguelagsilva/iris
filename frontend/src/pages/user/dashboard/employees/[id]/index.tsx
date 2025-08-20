import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteEmployee, getEmployeeById } from "@/lib/api";
import { SafeEmployeeDto } from "@/types/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";
import { toast } from "@/components/ui/use-toast";

export function UserDashboardEmployeeView() {
  const navigate = useNavigate();
  const { employeeId } = useParams();
  const [employee, setEmployee] = useState<SafeEmployeeDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [employeeFields, setEmployeeFields] = useState<[string, string][] | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const excludeFields = ['id', 'organizationId'];

  const handleDelete = async () => {
    if (!employee) return;
    setIsDeleting(true)
    try {
      await deleteEmployee(employee.id)
      navigate('/user/dashboard/employees');
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
    if (!employeeId) {
      navigate('/user/dashboard/employees');
      return;
    }
    const fetchEmployee = async () => { 
      try {
        setIsLoading(true);
        const fetchedEmployee = await getEmployeeById(employeeId);
        setEmployee(fetchedEmployee);
        const employeeFields = Object.entries(fetchedEmployee).filter(([key]) => !excludeFields.includes(key));
        setEmployeeFields(employeeFields);
      } catch {
        navigate('/user/dashboard/employees');
      } finally {
        setIsLoading(false);
      }
    }
    fetchEmployee();
  }, [employeeId, navigate]);

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
      {isLoading || !employee || !employeeFields ?
        <EmployeeSkeleton />
        :
        <Card>
          <CardHeader>
            <CardTitle>Employee Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              {employeeFields.map(([key, value]) => (
                <div key={key} className="border-t border-gray-200 pt-4">
                  <dt className="font-medium text-gray-500 capitalize">{key.replace(/_/g, ' ')}</dt>
                  <dd className="mt-1 text-gray-900">{value?.toString() || 'N/A'}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      }
    </>
  );
}

function EmployeeSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee Details</CardTitle>
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
