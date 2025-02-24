import { getUserSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import RegisterForm from "./register-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import GithubLogin from "../github-login";

export default async function Register() {
  const session = await getUserSession();

  if (session) {
    return redirect("/");
  }

  return (
    <main className="w-full flex flex-col gap-4 justify-center items-center min-h-screen">
        <h1 className="text-2xl font-bold">Lumina AI</h1>
        <Card className="w-[365px]">
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>
              Create an account to start chatting.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GithubLogin />
            <div className="relative my-6">
              <Separator />
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-muted-foreground text-sm">OR</span>
            </div>
            <RegisterForm />
          </CardContent>
        </Card>
    </main>
  )
}