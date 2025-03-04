import { ProfileForm } from "@/components/settings/profile-form";
import { UsageStats } from "@/components/settings/usage-stats";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Settings() {

    return (
        <div className="container max-w-5xl py-10">
            <div className="space-y-6">
                <div>
                <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
                <p className="text-muted-foreground">Manage your account settings and preferences.</p>
                </div>
                <Separator />

                <div className="grid gap-6 md:grid-cols-2">
                <Card className="p-6">
                    <ProfileForm />
                </Card>

                <div className="space-y-6">
                    <UsageStats />
                </div>
                </div>
            </div>
        </div>
    )
}