import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SafeEmployeeDto, UpdateEmployeeDto, UpdateEmployeeSchema } from '@/types/api';
import { getEmployeeById, updateEmployee } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { useUser } from "@/hooks/user";

export function UserDashboardEmployeeEdit() {
  const navigate = useNavigate();
  const { employeeId } = useParams();
  const [employee, setEmployee] = useState<SafeEmployeeDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<UpdateEmployeeDto>({
    resolver: zodResolver(UpdateEmployeeSchema),
    defaultValues: {
      name: "",
      phone_number: "",
    },
  });

  useEffect(() => {
    if (!employeeId) {
      navigate("/user/dashboard/employees");
      return;
    }
    const fetchEmployee = async () => {
      try {
        setIsLoading(true);
        const fetchedEmployee = await getEmployeeById(employeeId);
        setEmployee(fetchedEmployee);
        form.reset({
          name: fetchedEmployee.name,
          phone_number: fetchedEmployee.phone_number,
        });
      } catch (error: any) {
        setError(error.message || "Failed to fetch employee data");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch employee data",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployee();
  }, [employeeId, navigate, form]);

  async function onSubmit(values: UpdateEmployeeDto) {
    setError(null);
    setIsLoading(true);
    try {
      await updateEmployee(employeeId!, values);
      toast({
        variant: "success",
        title: "Success",
        description: "Employee has been updated.",
      });
      navigate(`/user/dashboard/employees/${employeeId}`);
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Button 
        onClick={() => navigate(-1)} 
        variant="outline" 
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      {isLoading || !employee ?
        <EmployeeSkeleton />
        :
        <Card>
          <CardHeader>
            <CardTitle>Edit Employee: {employee.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update Employee'}
                </Button>
              </form>
            </Form>
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
        <Skeleton className="h-6 w-1/4" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-4 w-1/5" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
          <Skeleton className="h-10 w-1/4" />
        </div>
      </CardContent>
    </Card>
  );
}
