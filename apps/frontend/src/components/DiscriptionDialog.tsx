import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Mail, Clock, Share2 } from "lucide-react"

export default function SendAndWaitInfoDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-[#141920] text-white border border-[#2a3441]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">✨ Send and Wait for Response</DialogTitle>
        </DialogHeader>

        <Card className="bg-[#1c222b] border border-[#2a3441] shadow-lg rounded-2xl">
          <CardContent className="space-y-6 p-6">
            
            <p className="text-sm text-gray-300">
              With <span className="font-medium text-white">Send and Wait for Response</span>, your workflow can pause 
              until the recipient replies, making your automation interactive and decision-driven.
            </p>

            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <Mail className="h-5 w-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="font-medium text-white">📨 Custom Response Fields</p>
                  <p className="text-sm text-gray-400">Include options like <span className="text-white">Approval / Disapproval</span> or request a <span className="text-white">text reply</span> directly inside the message.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Clock className="h-5 w-5 text-green-400 mt-0.5" />
                <div>
                  <p className="font-medium text-white">⏳ Pause Workflow Execution</p>
                  <p className="text-sm text-gray-400">The workflow will <span className="text-white">wait for a reply</span> before moving to the next step.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Share2 className="h-5 w-5 text-purple-400 mt-0.5" />
                <div>
                  <p className="font-medium text-white">🔗 Use Responses in Next Node</p>
                  <p className="text-sm text-gray-400">Replies are <span className="text-white">captured and passed</span> into the next node, so you can branch, decide, or trigger follow-ups.</p>
                </div>
              </div>
            </div>

            <Separator className="bg-[#2a3441]" />

            <div className="space-y-2 text-sm text-gray-300">
              <p><span className="font-medium text-white">Example:</span></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Step 1: Send an approval email/Telegram message.</li>
                <li>Step 2: Wait until the user replies with “Approved” or “Rejected.”</li>
                <li>Step 3: Continue workflow logic using that response.</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
          <Button variant="outline" className="border-[#2a3441] text-gray-300 hover:bg-[#2a3441]" onClick={() => onOpenChange(false)}>
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
