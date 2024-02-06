import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Warning } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { ServerResponse } from "@/types/global";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import PageTheme from "@/components/custom/PageTheme";

const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .refine((password) => /[A-Z]/.test(password), {
    message: "Password must contain at least one uppercase letter",
  })
  .refine((password) => /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password), {
    message:
      "Password must contain at least one symbol (!@#$%^&*()_+{}[]:;<>,.?~-)",
  });

const formSchema = z.object({
  username: z.string(),
  password: passwordSchema,
  email: z.string().email(),
  cpassword: z.string(),
  name: z.string(),
});

const Signup = () => {
  const nav = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [error, setError] = useState({
    display: false,
    message: "",
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.password !== values.cpassword) {
      return form.setError("cpassword", {
        message: "confirm password did not match",
      });
    }

    try {
      const res = await axios.post<
        ServerResponse & { field?: "username" | "password" }
      >(`${import.meta.env.VITE_SERVER_ENDPOINT}/auth/signup`, {
        username: values.username,
        password: values.password,
        email: values.email,
        fullname: values.name,
      });

      if (res.data.status === "ok") {
        toast("user created", { style: { color: "green" } });
        nav("/login");
      } else if (res.data.status === "fail" && res.data.field) {
        form.setError(res.data.field, { message: res.data.message });
      }
    } catch {
      setError({
        display: true,
        message: "internal server error",
      });
    }
  }

  return (
    <div className="flex flex-col h-[100vh] justify-center items-center p-3 bg-background">
      <div className="w-full">
        {error.display && (
          <Alert variant={"destructive"}>
            <Warning />
            <AlertTitle>Alert</AlertTitle>
            <AlertDescription>error</AlertDescription>
          </Alert>
        )}
      </div>
      <div className="md:w-[400px] w-full  flex flex-col border py-5 px-5 rounded-lg border-muted-foreground">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel>Fullname</FormLabel>
                    <FormControl>
                      <Input placeholder="fullname" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
            <FormField
              control={form.control}
              name="cpassword"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="confirm password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
        <Link to={"/login"} className="mt-5 text-center cursor-pointer">
          login instead
        </Link>
      </div>
    </div>
  );
};

export default Signup;
