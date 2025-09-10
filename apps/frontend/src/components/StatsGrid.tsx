import { Card } from "@/components/ui/card";
import { TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react";

const StatsGrid = () => {
  const stats = [
    {
      title: "Total Workflows",
      value: "12",
      change: "+2 this week",
      icon: TrendingUp,
      color: "text-success"
    },
    {
      title: "Active Executions",
      value: "0",
      change: "Last run 2 days ago",
      icon: Clock,
      color: "text-muted-foreground"
    },
    {
      title: "Successful Runs",
      value: "247",
      change: "98.5% success rate",
      icon: CheckCircle,
      color: "text-success"
    },
    {
      title: "Failed Executions",
      value: "3",
      change: "Down from last month",
      icon: AlertCircle,
      color: "text-primary"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                <p className={`text-xs mt-1 ${stat.color}`}>{stat.change}</p>
              </div>
              <Icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsGrid;