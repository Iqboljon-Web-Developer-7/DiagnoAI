"use client";

import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppStore } from "@/store/store";
import {
  Loader2,
  User as UserIcon,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Phone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRegisterMutation } from "./api";
import { ErrorResponse } from "./types";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";
import { useState } from "react";

const formSchema = z
  .object({
    first_name: z.string().min(2, "First name must be at least 2 characters"),
    phoneNumber: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .optional()
      .or(z.literal("")),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    acceptPrivacyPolicy: z.boolean().refine((val) => val === true, {
      message: "You must accept the Privacy Policy",
    }),
    acceptTermsOfUse: z.boolean().refine((val) => val === true, {
      message: "You must accept the Terms of Use",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

const RegisterPage = () => {
  const router = useRouter();
  const { setUser } = useAppStore();
  const t = useTranslations("Auth");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      acceptPrivacyPolicy: false,
      acceptTermsOfUse: false,
    },
  });

  const { mutate: registerMutate, isPending } = useRegisterMutation();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const payload = {
      ...values,
    };

    if (values.phoneNumber) {
      payload.phoneNumber = values.phoneNumber;
    } else {
      delete payload.phoneNumber;
    }

    // Remove checkbox values before sending to API
    delete payload.acceptPrivacyPolicy;
    delete payload.acceptTermsOfUse;

    registerMutate(payload, {
      onSuccess: (data) => {
        toast.success("Registration successful! Welcome aboard!");
        setUser({
          id: `user-${Date.now()}`,
          name: `${data.user.first_name} ${data.user.last_name}`,
          email: data.user.email,
          avatar: "/placeholder.svg?height=32&width=32",
          token: data.token,
        });
        router.push("/");
      },
      onError: (error: Error) => {
        try {
          const parsedError = JSON.parse(error.message);
          if (parsedError.status === 400) {
            handleErrorResponse(parsedError.data as ErrorResponse);
          } else {
            form.setError("root", { message: t("errors.general") });
          }
        } catch {
          form.setError("root", { message: t("errors.general") });
        }
      },
    });
  };

  const handleErrorResponse = (data: ErrorResponse) => {
    if (data.phone_number) {
      form.setError("phoneNumber", { message: data.phone_number[0] });
    }  
     else if (typeof data === "object") {
      const firstError = Object.values(data)[0];
      form.setError("root", {
        message: Array.isArray(firstError) ? firstError[0] : String(firstError),
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-200 via-blue-50 to-purple-200 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className="max-w-md overflow-auto">
        <Card className="relative  overflow-hidden space-y-5 border-neutral-300 dark:border-neutral-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xs animate-fade-in-down delay-200 opacity-0">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 bg-linear-to-r from-blue-500 to-purple-600 dark:from-blue-800 dark:to-purple-900 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <UserIcon className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-purple-900 dark:text-purple-300">
              {t("register.title")}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {t("register.description")}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-gray-100">
                          {t("register.username")}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                            <Input
                              className="border-neutral-300 dark:border-neutral-700 pl-10 dark:bg-gray-800 dark:text-gray-100"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-gray-100">
                        {t("register.phoneNumber")}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                          <Input
                            className="border-neutral-300 dark:border-neutral-700 pl-10 dark:bg-gray-800 dark:text-gray-100"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-gray-100">
                        {t("register.password")}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            className="pl-10 pr-10 dark:bg-gray-800 dark:text-gray-100 border-neutral-300 dark:border-neutral-700"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-gray-100">
                        {t("register.confirmPassword")}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            className="pl-10 pr-10 dark:bg-gray-800 dark:text-gray-100 border-neutral-300 dark:border-neutral-700"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 flex-wrap justify-between py-2">
                  <FormField
                    control={form.control}
                    name="acceptPrivacyPolicy"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                          className="dark:text-white"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm dark:text-gray-100">
                            {t("register.acceptTerms")}{" "}
                            <Link
                              href="privacy"
 className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {t("register.privacyPolicy")}
                            </Link>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="acceptTermsOfUse"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            className="dark:text-white"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm dark:text-gray-100">
                            {t("register.acceptTerms")}{" "}
                            <Link
                              href="/terms"
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {t("register.termsOfUse")}
                            </Link>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                {form.formState.errors.root && (
                  <>
                    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg"></div>
                    <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0" />
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {form.formState.errors.root.message}
                    </p>
                  </>
                )}

                <Button
                  type="submit"
                  disabled={isPending}
                  className="text-slate-100 w-full h-12 bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 dark:from-blue-800 dark:to-purple-900 dark:hover:from-blue-900 dark:hover:to-purple-950"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("register.loading")}
                    </>
                  ) : (
                    t("register.submit")
                  )}
                </Button>
              </form>
            </Form>

            <div className="text-center pt-4 border-t border-gray-100 dark:border-gray-800 mt-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span>{t("register.haveAccount")}</span>{" "}
                <Link
                  href="/auth/login"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {t("register.loginLink")}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
