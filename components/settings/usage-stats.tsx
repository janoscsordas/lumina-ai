import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Zap, Clock } from "lucide-react"

export function UsageStats() {
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
              <span className="font-medium">1,245 / 5,000</span>
            </div>
            <Progress value={25} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <Zap className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Advanced Features</span>
              </div>
              <span className="font-medium">37 / 100</span>
            </div>
            <Progress value={37} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Response Time</span>
              </div>
              <span className="font-medium">0.8s avg</span>
            </div>
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

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Model Training</div>
              <div className="text-xs text-muted-foreground">Your data is not used for training</div>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Disabled
            </Badge>
          </div>
        </CardContent>
      </Card>
    </>
  )
}