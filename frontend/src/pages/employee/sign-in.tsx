'use client'

import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/hooks/auth";
import { requestEmployeeOTP } from '@/lib/api';
import { RequestOTPEmployeeDto, RequestOTPEmployeeSchema, SignInEmployeeDto, SignInEmployeeSchema } from '@/types/api';
import { useToast } from "@/components/ui/use-toast";

export function EmployeeSignIn() {
  const [showOTP, setShowOTP] = useState(false);
  const { handleEmployeeSignIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const requestOTPForm = useForm<RequestOTPEmployeeDto>({
    resolver: zodResolver(RequestOTPEmployeeSchema),
    defaultValues: {
      phone_number: "",
    },
  });

  const signInForm = useForm<SignInEmployeeDto>({
    resolver: zodResolver(SignInEmployeeSchema),
    defaultValues: {
      phone_number: "",
      otp: "",
    },
  });

  async function onPhoneNumberSubmit(data: RequestOTPEmployeeDto) {
    try {
      await requestEmployeeOTP(data);
      signInForm.setValue("phone_number", data.phone_number);
      setShowOTP(true);
    } catch {
      requestOTPForm.setError("phone_number", { message: "Failed to send OTP. Please try again." });
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    }
  }

  async function onSignInSubmit(data: SignInEmployeeDto) {
    try {
      await handleEmployeeSignIn(data);
      toast({
        title: "Success",
        description: "You have successfully logged in.",
        variant: "success",
      });
      navigate("/employee/chat");
    } catch (error) {
      console.error(error);
      signInForm.setError("otp", { message: "Invalid OTP. Please try again." });
      toast({
        title: "Error",
        description: "Invalid OTP. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Employee Login</CardTitle>
          <CardDescription>
            {showOTP ? "Enter the OTP sent to your phone" : "Enter your phone number to receive an OTP"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showOTP ? (
            <Form {...signInForm}>
              <form onSubmit={signInForm.handleSubmit(onSignInSubmit)} className="space-y-4">
                <FormField
                  control={signInForm.control}
                  key="otp"
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>One-Time Password</FormLabel>
                      <FormControl>
                        <InputOTP
                          maxLength={6}
                          {...field}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Verify OTP
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...requestOTPForm}>
              <form onSubmit={requestOTPForm.handleSubmit(onPhoneNumberSubmit)} className="space-y-4">
                <FormField
                  control={requestOTPForm.control}
                  key="phone_number"
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="923456789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Send OTP
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          Need help? Contact support
        </CardFooter>
      </Card>
    </div>
  );
}
