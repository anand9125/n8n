import Header from "@/components/Header";
import StatusCard from "@/components/StatusCard";
import UsageCard from "@/components/UsageCard";
import CommunityCard from "@/components/CommunityCard";
import StatsGrid from "@/components/StatsGrid";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen ">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <Button className="bg-success hover:bg-success/90 text-success-foreground">
            <Crown className="w-4 h-4 mr-2" />
            Upgrade plan
          </Button>
        </div>
        
        <div className="space-y-8">
          <StatsGrid />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <StatusCard />
            <UsageCard />
            <CommunityCard />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
