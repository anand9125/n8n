import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-card border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">D</span>
            </div>
            <span className="text-xl font-semibold text-foreground">Dashboard</span>
          </div>
          
          <nav className="flex items-center space-x-6">
            <a href="#" className="text-sm font-medium text-foreground border-b-2 border-primary pb-1">
              Dashboard
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Manage
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Help Center
            </a>
          </nav>
        </div>
        
        <Button variant="outline" size="sm">
          Sign out
        </Button>
      </div>
    </header>
  );
};

export default Header;