import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsOverview = ({ metrics = {} }) => {
  const defaultMetrics = {
    totalStudents: 2847,
    activeUsers: 342,
    completedDrills: 1256,
    preparednessScore: 87,
    monthlyGrowth: 12.5,
    alertsSent: 45,
    complianceRate: 94.2,
    avgModuleCompletion: 78.3
  };

  const currentMetrics = { ...defaultMetrics, ...metrics };

  const metricCards = [
    {
      title: "Total People",
      value: currentMetrics?.totalStudents?.toLocaleString('en-IN'),
      icon: "Users",
      change: "+8.2%",
      changeType: "positive",
      description: "Enrolled People"
    },
    {
      title: "Active Users",
      value: currentMetrics?.activeUsers?.toLocaleString('en-IN'),
      icon: "UserCheck",
      change: "+15.3%",
      changeType: "positive",
      description: "Last 24 hours"
    },
    {
      title: "Completed Drills",
      value: currentMetrics?.completedDrills?.toLocaleString('en-IN'),
      icon: "CheckCircle",
      change: "+23.1%",
      changeType: "positive",
      description: "This month"
    },
    {
      title: "Preparedness Score",
      value: `${currentMetrics?.preparednessScore}%`,
      icon: "Shield",
      change: "+5.2%",
      changeType: "positive",
      description: "Institution average"
    },
    {
      title: "Monthly Growth",
      value: `${currentMetrics?.monthlyGrowth}%`,
      icon: "TrendingUp",
      change: "+2.1%",
      changeType: "positive",
      description: "User engagement"
    },
    {
      title: "Alerts Sent",
      value: currentMetrics?.alertsSent?.toString(),
      icon: "AlertTriangle",
      change: "-12.5%",
      changeType: "negative",
      description: "This month"
    },
    {
      title: "Compliance Rate",
      value: `${currentMetrics?.complianceRate}%`,
      icon: "FileCheck",
      change: "+1.8%",
      changeType: "positive",
      description: "Regulatory compliance"
    },
    {
      title: "Module Completion",
      value: `${currentMetrics?.avgModuleCompletion}%`,
      icon: "BookOpen",
      change: "+6.7%",
      changeType: "positive",
      description: "Average completion rate"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricCards?.map((metric, index) => (
        <div
          key={index}
          className="bg-card border border-border rounded-lg p-6 shadow-soft hover:shadow-elevated transition-smooth"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`
              w-12 h-12 rounded-lg flex items-center justify-center
              ${metric?.changeType === 'positive' ? 'bg-success/10' : 'bg-error/10'}
            `}>
              <Icon 
                name={metric?.icon} 
                size={24} 
                color={metric?.changeType === 'positive' ? 'var(--color-success)' : 'var(--color-error)'}
              />
            </div>
            <div className={`
              flex items-center space-x-1 text-sm font-medium
              ${metric?.changeType === 'positive' ? 'text-success' : 'text-error'}
            `}>
              <Icon 
                name={metric?.changeType === 'positive' ? 'ArrowUp' : 'ArrowDown'} 
                size={16} 
              />
              <span>{metric?.change}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-card-foreground">
              {metric?.value}
            </h3>
            <p className="text-sm font-medium text-card-foreground">
              {metric?.title}
            </p>
            <p className="text-xs text-muted-foreground">
              {metric?.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsOverview;