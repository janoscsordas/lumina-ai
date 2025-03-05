import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { MessageSquare } from "lucide-react"
import { getUserMonthlyMessageCounts } from "@/lib/db/queries"
import { FREE_TIER_MESSAGE_LIMIT } from "@/lib/utils"

export async function UsageStats({ userId }: { userId: string }) {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1

  // Fetch message counts for the current month
  const messageCounts = await getUserMonthlyMessageCounts({ userId: userId, year: currentYear, month: currentMonth })

  // Calculate the percentage of the message limit used
  const percentageUsed = messageCounts ? (messageCounts / FREE_TIER_MESSAGE_LIMIT) * 100 : 0

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Usage Statistics</CardTitle>
          <CardDescription>Your current usage this month</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <MessageSquare className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Messages</span>
              </div>
              <span className={`font-medium ${messageCounts === FREE_TIER_MESSAGE_LIMIT && "text-red-500"}`}>{messageCounts} / {FREE_TIER_MESSAGE_LIMIT}</span>
            </div>
            <Progress value={percentageUsed} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Privacy Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Data Retention</div>
              <div className="text-xs text-muted-foreground">Chat history is stored for 30 days</div>
            </div>
            <Badge variant="outline">Default</Badge>
          </div>
        </CardContent>
      </Card>
    </>
  )
}