import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  ImageIcon,
  LineChart,
  Store,
  BarChart,
  Bot,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

// Navigation items for the sidebar
const navigationItems = [
  {
    id: "content-generation",
    label: "Content Generation",
    icon: <ImageIcon className="h-5 w-5" />,
  },
  {
    id: "trading",
    label: "Trading Intelligence",
    icon: <LineChart className="h-5 w-5" />,
  },
  {
    id: "market-making",
    label: "Market Making",
    icon: <Store className="h-5 w-5" />,
  },
  {
    id: "performance",
    label: "Performance",
    icon: <BarChart className="h-5 w-5" />,
  },
  {
    id: "agent-control",
    label: "Agent Control",
    icon: <Bot className="h-5 w-5" />,
  },
];

const Sidebar = ({
  activeSection = "content-generation",
  onSectionChange = () => {},
}: SidebarProps) => {
  const navigate = useNavigate();

  return (
    <div className="h-full w-[280px] bg-background border-r">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Agent monitoring and control
        </p>
      </div>

      <Separator />

      <ScrollArea className="h-[calc(100vh-100px)]">
        <div className="p-4 space-y-2">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "secondary" : "ghost"}
              className="w-full justify-start gap-3"
              onClick={() => {
                onSectionChange(item.id);
                navigate(`/dashboard/${item.id}`);
              }}
            >
              {item.icon}
              {item.label}
              {activeSection === item.id && (
                <ChevronRight className="h-4 w-4 ml-auto" />
              )}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;
