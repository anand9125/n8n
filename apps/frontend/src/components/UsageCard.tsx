import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const UsageCard = () => {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-foreground">0 / 1,000</div>
          <div className="text-sm text-muted-foreground mt-1">
            Executions in September
          </div>
        </div>
        
        <Progress value={0} className="w-full" />
        
        <div className="text-xs text-muted-foreground text-center">
          Reaching your monthly limits?{" "}
          <button className="text-primary hover:underline">Upgrade plan</button>
        </div>
      </div>
    </Card>
  );
};

export default UsageCard;