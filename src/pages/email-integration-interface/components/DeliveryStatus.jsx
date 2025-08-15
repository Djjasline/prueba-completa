import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const DeliveryStatus = ({ 
  emailStatus = 'draft',
  deliveryAttempts = [],
  onRetryDelivery,
  onViewDetails,
  className = '' 
}) => {
  const [currentStatus, setCurrentStatus] = useState(emailStatus);
  const [isRetrying, setIsRetrying] = useState(false);

  const statusConfig = {
    draft: {
      icon: 'FileText',
      label: 'Borrador',
      description: 'Email guardado como borrador',
      color: 'text-muted-foreground',
      bgColor: 'bg-muted/50',
      borderColor: 'border-muted'
    },
    sending: {
      icon: 'Send',
      label: 'Enviando',
      description: 'Procesando envío del email',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    sent: {
      icon: 'CheckCircle',
      label: 'Enviado',
      description: 'Email enviado exitosamente',
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20'
    },
    delivered: {
      icon: 'Mail',
      label: 'Entregado',
      description: 'Email entregado al destinatario',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    failed: {
      icon: 'AlertCircle',
      label: 'Falló',
      description: 'Error en el envío del email',
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      borderColor: 'border-destructive/20'
    },
    scheduled: {
      icon: 'Clock',
      label: 'Programado',
      description: 'Email programado para envío posterior',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20'
    }
  };

  const mockDeliveryAttempts = [
    {
      id: 1,
      timestamp: new Date(Date.now() - 300000)?.toISOString(),
      status: 'sent',
      recipient: 'supervisor@astap.com',
      details: 'Email enviado exitosamente al supervisor'
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 240000)?.toISOString(),
      status: 'delivered',
      recipient: 'cliente@empresa.com',
      details: 'Email entregado al cliente principal'
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 180000)?.toISOString(),
      status: 'failed',
      recipient: 'contacto2@empresa.com',
      details: 'Error: Dirección de email no válida'
    }
  ];

  const attempts = deliveryAttempts?.length > 0 ? deliveryAttempts : mockDeliveryAttempts;

  useEffect(() => {
    setCurrentStatus(emailStatus);
  }, [emailStatus]);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await onRetryDelivery?.();
      setCurrentStatus('sending');
      
      // Simulate status progression
      setTimeout(() => {
        setCurrentStatus('sent');
      }, 2000);
    } catch (error) {
      setCurrentStatus('failed');
    } finally {
      setIsRetrying(false);
    }
  };

  const getStatusIcon = (status) => {
    return statusConfig?.[status]?.icon || 'AlertCircle';
  };

  const getStatusColor = (status) => {
    return statusConfig?.[status]?.color || 'text-muted-foreground';
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp)?.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOverallStatus = () => {
    if (attempts?.length === 0) return currentStatus;
    
    const hasFailures = attempts?.some(a => a?.status === 'failed');
    const allDelivered = attempts?.every(a => a?.status === 'delivered' || a?.status === 'sent');
    
    if (hasFailures && !allDelivered) return 'failed';
    if (allDelivered) return 'delivered';
    return 'sent';
  };

  const overallStatus = getOverallStatus();
  const config = statusConfig?.[overallStatus];

  return (
    <div className={`bg-card rounded-lg border border-border ${className}`}>
      <div className="flex items-center space-x-3 p-6 border-b border-border">
        <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${config?.bgColor}`}>
          <Icon name="TrendingUp" size={20} className="text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Estado de Entrega
          </h3>
          <p className="text-sm text-muted-foreground">
            Seguimiento del envío del reporte
          </p>
        </div>
      </div>
      <div className="p-6 space-y-6">
        {/* Overall Status */}
        <div className={`p-4 rounded-lg border ${config?.borderColor} ${config?.bgColor}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon 
                name={config?.icon} 
                size={24} 
                className={config?.color} 
              />
              <div>
                <h4 className={`font-semibold ${config?.color}`}>
                  {config?.label}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {config?.description}
                </p>
              </div>
            </div>
            
            {(overallStatus === 'failed' || currentStatus === 'failed') && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                loading={isRetrying}
                iconName="RefreshCw"
                iconPosition="left"
              >
                Reintentar
              </Button>
            )}
          </div>
        </div>

        {/* Delivery Timeline */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground">
              Historial de Entrega
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewDetails}
              iconName="ExternalLink"
              iconPosition="right"
            >
              Ver Detalles
            </Button>
          </div>

          {attempts?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="Clock" size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No hay intentos de entrega</p>
              <p className="text-xs">El historial aparecerá después del envío</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {attempts?.map((attempt, index) => (
                <div
                  key={attempt?.id}
                  className="flex items-start space-x-3 p-3 bg-background rounded-lg border border-border"
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${statusConfig?.[attempt?.status]?.bgColor || 'bg-muted'}`}>
                    <Icon 
                      name={getStatusIcon(attempt?.status)} 
                      size={14} 
                      className={getStatusColor(attempt?.status)} 
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">
                        {attempt?.recipient}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(attempt?.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {attempt?.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <div className="text-lg font-semibold text-success">
              {attempts?.filter(a => a?.status === 'delivered' || a?.status === 'sent')?.length}
            </div>
            <div className="text-xs text-muted-foreground">Exitosos</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-destructive">
              {attempts?.filter(a => a?.status === 'failed')?.length}
            </div>
            <div className="text-xs text-muted-foreground">Fallidos</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">
              {attempts?.length}
            </div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryStatus;