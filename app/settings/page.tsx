import { ModeToggle } from "@/components/mode-toggle";
import { ProfileForm } from "@/components/settings/profile-form";
import StatLoading from "@/components/settings/stat-loading";
import { UsageStats } from "@/components/settings/usage-stats";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import UserAvatar from "@/components/user-avatar";
import { getUserSession } from "@/lib/get-session";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Settings() {
  const session = await getUserSession();

  if (!session) {
    return redirect("/login");
  }

  return (
    <div className="container max-w-5xl py-10 px-6 mx-auto">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            <p className="text-muted-foreground text-sm md:text-[1rem]">
              Manage your account settings and preferences.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/">
                <Button variant="outline" className="cursor-pointer">
                    Go Back
                </Button>
            </Link>
            <ModeToggle />
            <UserAvatar user={session.user} />
          </div>
        </div>
        <Separator />

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <ProfileForm user={session.user} />
          </Card>

          <div className="space-y-6">
            <Suspense fallback={<StatLoading />}>
              <UsageStats userId={session.user.id} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
