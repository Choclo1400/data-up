
import React from 'react';
import { FileBarChart, Users, Building2, Clock, Wrench, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ReportType } from '@/types/reports';
import { cn } from '@/lib/utils';

interface ReportCardProps {
  type: ReportType;
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

const getReportIcon = (type: ReportType) => {
  switch (type) {
    case ReportType.REQUEST_STATUS:
      return FileBarChart;
    case ReportType.TECHNICIAN_PERFORMANCE:
      return Users;
    case ReportType.CLIENT_ANALYSIS:
      return Building2;
    case ReportType.RESOLUTION_TIMES:
      return Clock;
    case ReportType.SERVICE_TYPES:
      return Wrench;
    case ReportType.MONTHLY_TRENDS:
      return TrendingUp;
    default:
      return FileBarChart;
  }
};

const ReportCard: React.FC<ReportCardProps> = ({
  type,
  title,
  description,
  isSelected,
  onClick,
}) => {
  const Icon = getReportIcon(type);

  return (
    <Card 
      className={cn(
        "hover:bg-muted/50 cursor-pointer transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-ring",
        isSelected && "ring-2 ring-primary bg-primary/5"
      )}
      onClick={onClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <CardContent className="p-4 flex gap-4 items-center">
        <div className={cn(
          "p-2 rounded-md",
          isSelected 
            ? "bg-primary text-primary-foreground" 
            : "bg-primary/10 text-primary"
        )}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportCard;
