import React from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ReportTable = ({ 
  reports, 
  selectedReports, 
  onSelectReport, 
  onSelectAll, 
  onSortChange, 
  sortField, 
  sortDirection,
  onDownload,
  onResendEmail 
}) => {
  const handleSelectAll = (checked) => {
    onSelectAll(checked);
  };

  const handleSort = (field) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    onSortChange(field, newDirection);
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return 'ArrowUpDown';
    return sortDirection === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Completado': { bg: 'bg-success/10', text: 'text-success', icon: 'CheckCircle' },
      'Pendiente': { bg: 'bg-warning/10', text: 'text-warning', icon: 'Clock' },
      'Enviado': { bg: 'bg-primary/10', text: 'text-primary', icon: 'Send' }
    };

    const config = statusConfig?.[status] || statusConfig?.['Completado'];

    return (
      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full ${config?.bg}`}>
        <Icon name={config?.icon} size={12} className={config?.text} />
        <span className={`text-xs font-medium ${config?.text}`}>
          {status}
        </span>
      </div>
    );
  };

  if (reports?.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-12 text-center shadow-card">
        <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          No hay reportes disponibles
        </h3>
        <p className="text-muted-foreground mb-6">
          Comienza creando tu primer reporte de servicio
        </p>
        <Button
          variant="default"
          iconName="Plus"
          iconPosition="left"
          onClick={() => window.location.href = '/service-report-creation'}
        >
          Crear Primer Reporte
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border shadow-card overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="w-12 p-4">
                <Checkbox
                  checked={selectedReports?.length === reports?.length && reports?.length > 0}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                />
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('filename')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-micro"
                >
                  <span>Archivo</span>
                  <Icon name={getSortIcon('filename')} size={14} />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('clientName')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-micro"
                >
                  <span>Cliente</span>
                  <Icon name={getSortIcon('clientName')} size={14} />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('serviceDate')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-micro"
                >
                  <span>Fecha de Servicio</span>
                  <Icon name={getSortIcon('serviceDate')} size={14} />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('technician')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-micro"
                >
                  <span>Técnico</span>
                  <Icon name={getSortIcon('technician')} size={14} />
                </button>
              </th>
              <th className="text-left p-4">
                <span className="text-sm font-medium text-foreground">Estado</span>
              </th>
              <th className="text-right p-4">
                <span className="text-sm font-medium text-foreground">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {reports?.map((report) => (
              <tr key={report?.id} className="border-b border-border hover:bg-muted/30 transition-micro">
                <td className="p-4">
                  <Checkbox
                    checked={selectedReports?.includes(report?.id)}
                    onChange={(e) => onSelectReport(report?.id, e?.target?.checked)}
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded">
                      <Icon name="FileText" size={16} className="text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {report?.filename}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {report?.fileSize}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-foreground">{report?.clientName}</div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-foreground">{formatDate(report?.serviceDate)}</div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-foreground">{report?.technician}</div>
                </td>
                <td className="p-4">
                  {getStatusBadge(report?.status)}
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Download"
                      onClick={() => onDownload(report)}
                      className="text-muted-foreground hover:text-foreground"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Mail"
                      onClick={() => onResendEmail(report)}
                      className="text-muted-foreground hover:text-foreground"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-border">
        {reports?.map((report) => (
          <div key={report?.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={selectedReports?.includes(report?.id)}
                  onChange={(e) => onSelectReport(report?.id, e?.target?.checked)}
                />
                <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                  <Icon name="FileText" size={20} className="text-primary" />
                </div>
              </div>
              {getStatusBadge(report?.status)}
            </div>
            
            <div className="space-y-2 mb-4">
              <div>
                <div className="text-sm font-medium text-foreground">
                  {report?.filename}
                </div>
                <div className="text-xs text-muted-foreground">
                  {report?.fileSize}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Cliente</div>
                  <div className="text-foreground">{report?.clientName}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Fecha</div>
                  <div className="text-foreground">{formatDate(report?.serviceDate)}</div>
                </div>
              </div>
              
              <div>
                <div className="text-muted-foreground text-sm">Técnico</div>
                <div className="text-foreground text-sm">{report?.technician}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                iconPosition="left"
                onClick={() => onDownload(report)}
                className="flex-1"
              >
                Descargar
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Mail"
                iconPosition="left"
                onClick={() => onResendEmail(report)}
                className="flex-1"
              >
                Reenviar
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportTable;