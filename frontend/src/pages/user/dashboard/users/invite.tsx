import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/components/ui/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { InviteUserSchema, type InviteUserDto } from "@/types/api";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { useUser } from "@/hooks/user";

export function UserDashboardUserInvite() {
  const { user } = useUser();

  const form = useForm<InviteUserDto>({
    resolver: zodResolver(InviteUserSchema),
    defaultValues: {
      email: "",
      organizationId: user?.organization.id || "",
    },
  });

  async function onSubmit(values: InviteUserDto) {
    try {
      console.log(values);
      // Call API to invite the user
      // await api.inviteUser(values);
      toast({
        variant: "success",
        title: "User has been invited.",
      });
    } catch (error: any) {
      // Handle API errors
      if (error.response?.data?.message) {
        const backendErrors = error.response.data.message;
        backendErrors.forEach((err: any) => {
          form.setError(err.property as keyof InviteUserDto, {
            type: 'backend',
            message: err.message
          });
        });
      } else {
        console.error('An unexpected error occurred:', error);
        toast({
          variant: "destructive",
          title: "An error occurred while inviting the user.",
        });
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
              <Link to="/user/dashboard/users">Users</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Invite</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="pt-6">
        <p className="text-xl mb-6 font-bold">
          Enter the recipient's email to send an invitation.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
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
