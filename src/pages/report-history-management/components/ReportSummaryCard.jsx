import React from 'react';
import Icon from '../../../components/AppIcon';

const ReportSummaryCard = ({ totalReports, recentActivity }) => {
  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-card">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Reports */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
            <Icon name="FileText" size={24} className="text-primary" />
          </div>
          <div>
            <div className="text-2xl font-semibold text-foreground">
              {totalReports}
            </div>
            <div className="text-sm text-muted-foreground">
              Total de Reportes
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-success/10 rounded-lg">
            <Icon name="Clock" size={24} className="text-success" />
          </div>
          <div>
            <div className="text-2xl font-semibold text-foreground">
              {recentActivity}
            </div>
            <div className="text-sm text-muted-foreground">
              Esta Semana
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg">
            <Icon name="TrendingUp" size={24} className="text-accent" />
          </div>
          <div>
            <div className="text-2xl font-semibold text-foreground">
              100%
            </div>
            <div className="text-sm text-muted-foreground">
              Completados
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportSummaryCard;