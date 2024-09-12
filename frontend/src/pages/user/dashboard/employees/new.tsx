import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
import { CreateEmployeeDto, CreateEmployeeSchema } from '@/types/api';
import { createEmployee } from '@/lib/api';
import { useUser } from "@/hooks/user";

export function UserDashboardEmployeeNew() {
  const { user } = useUser();
  const navigate = useNavigate();
  
  const form = useForm<CreateEmployeeDto>({
    resolver: zodResolver(CreateEmployeeSchema),
    defaultValues: {
      name: "",
      phone_number: "",
      organizationId: user?.organization.id || "",
    },
  });

  async function onSubmit(values: CreateEmployeeDto) {
    try {
      await createEmployee(values);
      toast({
        variant: "success",
        title: "Employee has been created.",
      })
      navigate('/user/dashboard/employees')
    } catch (error: any) {
      // Handle API errors
      if (error.response?.data?.message) {
        const backendErrors = error.response.data.message;
        backendErrors.forEach((err: any) => {
          form.setError(err.property as keyof CreateEmployeeDto, {
            type: 'backend',
            message: err.message
          });
        });
      } else {
        // Handle other types of errors
        console.error('An unexpected error occurred:', error);
      }
    }
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
            <BreadcrumbLink>
              <Link to="/user/dashboard/employees">Employees</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>New</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </>
  );
}
