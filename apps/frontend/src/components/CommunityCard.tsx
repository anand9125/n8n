import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users, HelpCircle } from "lucide-react";

const CommunityCard = () => {
  const forumPosts = [
    { title: "Add additional filters to Typeform trigger", replies: 2, category: "Feature Requests" },
    { title: "How do I iterate over a series of PDFs?", replies: 3, category: "Questions" },
    { title: "How to send a Slack message as a bot, not a user", replies: 3, category: "Questions" }
  ];

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Need help implementing a specific workflow?
          </h3>
          <p className="text-sm text-muted-foreground">
            Join our community forums to ask questions and share workflow solutions with the team and other helpful users.
          </p>
        </div>
        
        <Button variant="outline" className="w-full">
          <MessageSquare className="w-4 h-4 mr-2" />
          Visit forums
        </Button>
        
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-foreground">Latest Discussions</h4>
            <Users className="w-4 h-4 text-muted-foreground" />
          </div>
          
          <div className="space-y-3">
            {forumPosts.map((post, index) => (
              <div key={index} className="flex items-start space-x-3 text-sm">
                <HelpCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-foreground font-medium truncate">{post.title}</p>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>{post.category}</span>
                    <span>•</span>
                    <span>{post.replies} replies</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CommunityCard;