import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StatusCard = () => {
  const navigate = useNavigate();

  return (
    <Card className="p-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">myinstance</h2>
        
        <Button 
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-2"
          onClick={() => navigate('/instance')}
        >
          Open instance
        </Button>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-center space-x-2">
            <Circle className="w-3 h-3 fill-success text-success" />
            <span className="text-muted-foreground">Currently online</span>
          </div>
          
          <div className="text-muted-foreground">
            Running version app@1.0.0
          </div>
          
          <div className="text-muted-foreground">
            14 days left in your free trial
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatusCard;