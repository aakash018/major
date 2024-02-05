import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Warning } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";

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
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  username: z.string(),
  password: z.string(),
});

const Login = () => {
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
    try {
      const res = await axios.post<
        ServerResponse & { field?: "username" | "password" }
      >(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/auth/login`,
        {
          username: values.username,
          password: values.password,
        },
        { withCredentials: true }
      );

      if (res.data.status === "ok") {
        toast("logged in successful", { style: { color: "green" } });
        nav("/");
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
    <PageTheme
      className="w-[100vw] flex flex-col justify-center items-center gap-5 "
      isNotLogin={false}
    >
      <div className="w-full">
        {error.display && (
          <Alert variant={"destructive"}>
            <Warning />
            <AlertTitle>Alert</AlertTitle>
            <AlertDescription>error</AlertDescription>
          </Alert>
        )}
      </div>
      <div className="w-full flex flex-col border py-10 px-5 rounded-lg border-muted-foreground">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
        <Link to={"/signup"} className="mt-5 text-center cursor-pointer">
          signup instead
        </Link>
      </div>
    </PageTheme>
  );
};

export default Login;
