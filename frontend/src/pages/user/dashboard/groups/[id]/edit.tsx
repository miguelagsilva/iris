import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SafeGroupDto, UpdateGroupDto, UpdateGroupSchema, SafeEmployeeDto } from '@/types/api';
import { getGroupById, updateGroup, addEmployeeToGroup, removeEmployeeFromGroup, getOrganizationEmployees } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export function UserDashboardGroupEdit() {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [group, setGroup] = useState<SafeGroupDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [allEmployees, setAllEmployees] = useState<SafeEmployeeDto[]>([]);

  const form = useForm<UpdateGroupDto>({
    resolver: zodResolver(UpdateGroupSchema),
    defaultValues: {
      name: "",
      employeesIds: [],
    },
  });

  const { employeesIds } = form.watch();

  useEffect(() => {
    if (!groupId) {
      navigate("/user/dashboard/groups");
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const fetchedGroup = await getGroupById(groupId);
        setGroup(fetchedGroup);

        const employees = await getOrganizationEmployees(fetchedGroup.organizationId);
        setAllEmployees(employees);

        form.reset({
          name: fetchedGroup.name,
          employeesIds: fetchedGroup.employees.map(e => e.id),
        });
      } catch (error: any) {
        setError(error.message || "Failed to fetch data");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch data",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [groupId, navigate, form]);

  async function onSubmit(values: UpdateGroupDto) {
    setError(null);
    setIsLoading(true);
    try {
      await updateGroup(groupId!, values);
      toast({
        variant: "success",
        title: "Success",
        description: "Group has been updated.",
      });
      navigate(`/user/dashboard/groups/${groupId}`);
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  }

  const handleSelect = (value: string) => {
    const currentIds = form.getValues("employeesIds")
    if (!currentIds.includes(value)) {
      form.setValue("employeesIds", [...employeesIds, value])
    }
  }

  const handleRemove = (id: string) => {
    const currentIds = form.getValues("employeesIds")
    form.setValue("employeesIds", currentIds.filter((thingId) => thingId !== id))
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
      {isLoading || !group || !employeesIds ?
        <GroupSkeleton />
        :
        <div className="flex flex-row justify-between gap-2">
          <Card className="flex-1 h-fit">
            <CardHeader>
              <CardTitle>Edit group fields</CardTitle>
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
                    name="employeesIds"
                    render={() => (
                      <FormItem>
                        <FormLabel>Employees</FormLabel>
                        <Select onValueChange={handleSelect}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an employee" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {allEmployees
                              .filter(emp => !employeesIds.find(id => id === emp.id))
                              .map((employee) => (
                                <SelectItem key={employee.id} value={employee.id}>
                                  {employee.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select employees from the list.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    {employeesIds.map((id) => {
                      const employee = allEmployees.find((e) => e.id === id)
                      return (
                        <div key={id} className="flex items-center justify-between p-2 border rounded">
                          <Link 
                            to={`/user/dashboard/employees/${employee?.name}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="underline hover:text-blue-700"
                          >
                            {employee?.name}
                          </Link>
                          <Button variant="default" size="sm" onClick={() => handleRemove(id)}>
                            Remove
                          </Button>
                        </div>
                      )
                    })}
                  </div>

                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Update Group'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      }
    </>
  );
}

function GroupSkeleton() {
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
