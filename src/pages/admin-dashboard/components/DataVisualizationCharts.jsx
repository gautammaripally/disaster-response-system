import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import Icon from '../../../components/AppIcon';

const DataVisualizationCharts = () => {
  // Mock data for charts
  const moduleCompletionData = [
    { month: 'Aug', earthquake: 85, flood: 78, fire: 92, cyclone: 67 },
    { month: 'Sep', earthquake: 88, flood: 82, fire: 94, cyclone: 71 },
    { month: 'Oct', earthquake: 91, flood: 85, fire: 96, cyclone: 74 },
    { month: 'Nov', earthquake: 89, flood: 88, fire: 98, cyclone: 78 },
    { month: 'Dec', earthquake: 93, flood: 91, fire: 97, cyclone: 82 },
    { month: 'Jan', earthquake: 95, flood: 89, fire: 99, cyclone: 85 }
  ];

  const userEngagementData = [
    { date: '10 Jan', students: 1245, staff: 89, admins: 12 },
    { date: '11 Jan', students: 1289, staff: 92, admins: 15 },
    { date: '12 Jan', students: 1356, staff: 87, admins: 11 },
    { date: '13 Jan', students: 1423, staff: 94, admins: 13 },
    { date: '14 Jan', students: 1387, staff: 91, admins: 14 },
    { date: '15 Jan', students: 1456, staff: 96, admins: 16 },
    { date: '16 Jan', students: 1512, staff: 98, admins: 18 }
  ];

  const drillParticipationData = [
    { name: 'Fire Safety', value: 342, color: '#EF4444' },
    { name: 'Earthquake', value: 289, color: '#F59E0B' },
    { name: 'Flood', value: 234, color: '#2563EB' },
    { name: 'Cyclone', value: 156, color: '#059669' },
    { name: 'Communication', value: 198, color: '#7C3AED' }
  ];

  /*const preparednessScoreData = [
    { institution: 'DPS Delhi', score: 94, students: 1245 },
    { institution: 'St. Mary\'s', score: 89, students: 987 },
    { institution: 'Modern High', score: 92, students: 1156 },
    { institution: 'Riverside', score: 87, students: 876 },
    { institution: 'Coastal High', score: 91, students: 654 },
    { institution: 'City School', score: 85, students: 1023 }
  ];*/

  const regionalRiskData = [
    { region: 'Delhi NCR', earthquake: 7.2, flood: 8.5, fire: 6.8, cyclone: 2.1 },
    { region: 'Mumbai', earthquake: 6.8, flood: 9.2, fire: 7.5, cyclone: 8.9 },
    { region: 'Chennai', earthquake: 5.9, flood: 8.8, fire: 7.2, cyclone: 9.5 },
    { region: 'Kolkata', earthquake: 6.2, flood: 9.1, fire: 6.9, cyclone: 8.7 },
    { region: 'Bangalore', earthquake: 4.8, flood: 6.5, fire: 7.8, cyclone: 3.2 }
  ];

  const colors = {
    primary: '#2563EB',
    secondary: '#059669',
    warning: '#F59E0B',
    error: '#EF4444',
    success: '#10B981',
    accent: '#7C3AED'
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-elevated">
          <p className="font-medium text-card-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name}: {entry?.value}
              {entry?.name?.includes('score') || entry?.name?.includes('Rate') ? '%' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Module Completion Trends */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">Module Completion Trends</h3>
            <p className="text-sm text-muted-foreground">Monthly completion rates by disaster type</p>
          </div>
          <Icon name="TrendingUp" size={24} color="var(--color-success)" />
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={moduleCompletionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="earthquake" stroke={colors?.warning} strokeWidth={2} />
              <Line type="monotone" dataKey="flood" stroke={colors?.primary} strokeWidth={2} />
              <Line type="monotone" dataKey="fire" stroke={colors?.error} strokeWidth={2} />
              <Line type="monotone" dataKey="cyclone" stroke={colors?.secondary} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors?.warning }}></div>
            <span className="text-sm text-muted-foreground">Earthquake</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors?.primary }}></div>
            <span className="text-sm text-muted-foreground">Flood</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors?.error }}></div>
            <span className="text-sm text-muted-foreground">Fire</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors?.secondary }}></div>
            <span className="text-sm text-muted-foreground">Cyclone</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Engagement */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-card-foreground">Daily User Engagement</h3>
              <p className="text-sm text-muted-foreground">Active users by role</p>
            </div>
            <Icon name="Users" size={24} color="var(--color-primary)" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userEngagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="date" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="students" stackId="1" stroke={colors?.primary} fill={colors?.primary} fillOpacity={0.6} />
                <Area type="monotone" dataKey="staff" stackId="1" stroke={colors?.warning} fill={colors?.warning} fillOpacity={0.6} />
                <Area type="monotone" dataKey="admins" stackId="1" stroke={colors?.error} fill={colors?.error} fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Drill Participation */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-card-foreground">Drill Participation</h3>
              <p className="text-sm text-muted-foreground">Participation by drill type</p>
            </div>
            <Icon name="Play" size={24} color="var(--color-secondary)" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={drillParticipationData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100)?.toFixed(0)}%`}
                >
                  {drillParticipationData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preparedness Scores 
        <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-card-foreground">Institution Preparedness</h3>
              <p className="text-sm text-muted-foreground">Preparedness scores by institution</p>
            </div>
            <Icon name="Shield" size={24} color="var(--color-success)" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={preparednessScoreData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis type="number" domain={[0, 100]} stroke="var(--color-muted-foreground)" />
                <YAxis dataKey="institution" type="category" width={80} stroke="var(--color-muted-foreground)" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="score" fill={colors?.success} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>*/}

        {/* Regional Risk Assessment */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-card-foreground">Regional Risk Assessment</h3>
              <p className="text-sm text-muted-foreground">Risk levels by region and disaster type</p>
            </div>
            <Icon name="MapPin" size={24} color="var(--color-warning)" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalRiskData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="region" stroke="var(--color-muted-foreground)" />
                <YAxis domain={[0, 10]} stroke="var(--color-muted-foreground)" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="earthquake" fill={colors?.warning} />
                <Bar dataKey="flood" fill={colors?.primary} />
                <Bar dataKey="fire" fill={colors?.error} />
                <Bar dataKey="cyclone" fill={colors?.secondary} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors?.warning }}></div>
              <span className="text-sm text-muted-foreground">Earthquake</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors?.primary }}></div>
              <span className="text-sm text-muted-foreground">Flood</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors?.error }}></div>
              <span className="text-sm text-muted-foreground">Fire</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors?.secondary }}></div>
              <span className="text-sm text-muted-foreground">Cyclone</span>
            </div>
          </div>
        </div>
      </div>
      {/* Export Options */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">Export Analytics</h3>
            <p className="text-sm text-muted-foreground">Download comprehensive reports for compliance and analysis</p>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              <Icon name="Download" size={16} />
              <span>PDF Report</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors">
              <Icon name="FileSpreadsheet" size={16} />
              <span>Excel Export</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataVisualizationCharts;