
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode | string;
}

const StatCard = ({ title, value, change, icon }: StatCardProps) => {
  const isPositive = change >= 0;
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className="text-lg">{icon}</div>
        </div>
        <div className={cn(
          "text-xs font-medium mt-2 flex items-center",
          isPositive ? "text-green-600" : "text-red-600"
        )}>
          <span>{isPositive ? "+" : ""}{change}% vs. previous month</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
