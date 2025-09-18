"use client";
import { useState } from "react";
import '@xyflow/react/dist/style.css';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { WorkflowBuilder } from "@/components/WorkflowBuilder";

export default function App() {
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(true); 

  const handleSubmit = () => {
    if (!title.trim()) return alert("Please enter a workflow title!");
    console.log("Workflow title:", title);
    setOpen(false); // close after saving
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-7xl">
        {/* Popup Form on page load */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden">
            <Card className="border-0 shadow-xl rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <CardTitle className="text-lg font-semibold">
                  Create New Workflow
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workflow Title
                </label>
                <Input
                  placeholder="e.g. Send email on form submit"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="rounded-lg   "
                />
              </CardContent>
              <CardFooter className="flex justify-end gap-3 p-4 border-t">
                <Button
                  variant="outline"
                  className="rounded-lg"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
                >
                  Save
                </Button>
              </CardFooter>
            </Card>
          </DialogContent>
        </Dialog>

        {/* Main content area */}
        <main className="flex-1 flex flex-col">
          <div className="flex-1 relative">
            <WorkflowBuilder title={title} />
          </div>
        </main>
      </div>
    </div>
  );
}
