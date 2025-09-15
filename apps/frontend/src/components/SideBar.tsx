import React from 'react'

function SideBar() {
  return (
    <div>
          <aside className="w-64 bg-card border-r border-border">
                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-8">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-sm">n8n</span>
                    </div>
                    <span className="font-semibold text-foreground">n8n</span>
                  </div>
                  
                  <nav className="space-y-1">
                    {sidebarItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.label}
                          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                            item.active 
                              ? "bg-accent text-accent-foreground font-medium" 
                              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>
        
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-muted rounded-lg p-3 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-3 h-3" />
                      <span>14 days left in your n8n trial</span>
                    </div>
                    <Button size="sm" className="w-full bg-success hover:bg-success/90 text-success-foreground">
                      Upgrade now
                    </Button>
                  </div>
                </div>
              </aside>
    </div>
  )
}

export default SideBar