import { getUserSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import RegisterForm from "./register-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import GithubLogin from "../github-login";
import AuthHeader from "../auth-header";
import Link from "next/link";

export default async function Register() {
  const session = await getUserSession();

  if (session) {
    return redirect("/");
  }

  return (
    <main className="w-full flex flex-col gap-4 justify-center items-center min-h-screen relative py-16">
        <AuthHeader />
        <div className="dotted-background absolute top-0 left-0 w-full h-full overflow-hidden" />
        <div className="glow-circle top-[25%] left-1/2 transform -translate-y-[25%] -translate-x-1/2" />
        <h1 className="text-2xl font-bold">Lumina AI</h1>
        <Card className="w-[365px] bg-card">
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
            <div className="mt-4">
              <p className="text-sm text-center text-muted-foreground">Already have an account? <Link href="/login" className="underline text-lime">Login here</Link></p>
            </div>
          </CardContent>
        </Card>
    </main>
  )
}