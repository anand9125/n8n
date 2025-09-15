import React, { useEffect, useState } from 'react'
import { Card } from './ui/card'
import { Workflow } from 'lucide-react'
import { Badge } from './ui/badge'
import { Switch } from "@/components/ui/switch";
import axios from "axios";
function WorkflowItem() {
    const[workflows,setWorkflows] = useState([])
    useEffect(()=>{
        const fetchAllWorkflows = async () => {
            const response = await axios.get('http://localhost:5656/api/v1/workflows');
            console.log(response.data);
            setWorkflows(response.data);
        }
        fetchAllWorkflows()
    },[])
  return (
    <div>
        {workflows.length>0 ? workflows.map((workflow) => (
            <Card className="p-4">
            <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                <Workflow className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                <h3 className="font-medium text-foreground">My workflow</h3>
                <p className="text-sm text-muted-foreground">
                    Last updated 3 hours ago | Created 10 September
                </p>
                </div>
            </div>
            
            <div className="flex items-center space-x-4">
                <Badge variant="secondary">Personal</Badge>
                <div className="flex items-center space-x-2">
                {/* <span className="text-sm text-muted-foreground">
                    {workflowActive ? "Active" : "Inactive"}
                </span> */}
                <Switch
                //   checked={workflowActive}
                //   onCheckedChange={setWorkflowActive}
                />
                </div>
            </div>
            </div>
        </Card>
        )):"No workflows found"}
    </div>
  )
}

export default WorkflowItem