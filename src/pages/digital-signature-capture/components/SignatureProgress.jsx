import React from 'react';
import Icon from '../../../components/AppIcon';

const SignatureProgress = ({ 
  astapSigned = false, 
  clientSigned = false,
  className = '' 
}) => {
  const getStatusIcon = (signed) => {
    return signed ? 'CheckCircle' : 'Circle';
  };

  const getStatusColor = (signed) => {
    return signed ? 'text-success' : 'text-muted-foreground';
  };

  const completionPercentage = ((astapSigned ? 1 : 0) + (clientSigned ? 1 : 0)) * 50;

  return (
    <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Progreso de Firmas
        </h3>
        <div className="text-sm text-muted-foreground">
          {completionPercentage}% Completado
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2 mb-6">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>

      {/* Signature Status */}
      <div className="space-y-4">
        {/* ASTAP Signature Status */}
        <div className="flex items-center space-x-3">
          <Icon 
            name={getStatusIcon(astapSigned)} 
            size={20} 
            className={getStatusColor(astapSigned)}
          />
          <div className="flex-1">
            <div className="text-sm font-medium text-foreground">
              Firma ASTAP
            </div>
            <div className="text-xs text-muted-foreground">
              Técnico responsable del servicio
            </div>
          </div>
          {astapSigned && (
            <div className="flex items-center space-x-1 text-success">
              <Icon name="Check" size={14} />
              <span className="text-xs font-medium">Firmado</span>
            </div>
          )}
        </div>

        {/* Client Signature Status */}
        <div className="flex items-center space-x-3">
          <Icon 
            name={getStatusIcon(clientSigned)} 
            size={20} 
            className={getStatusColor(clientSigned)}
          />
          <div className="flex-1">
            <div className="text-sm font-medium text-foreground">
              Firma Cliente
            </div>
            <div className="text-xs text-muted-foreground">
              Representante autorizado del cliente
            </div>
          </div>
          {clientSigned && (
            <div className="flex items-center space-x-1 text-success">
              <Icon name="Check" size={14} />
              <span className="text-xs font-medium">Firmado</span>
            </div>
          )}
        </div>
      </div>

      {/* Completion Message */}
      {astapSigned && clientSigned && (
        <div className="mt-6 p-4 bg-success/10 border border-success/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <span className="text-sm font-medium text-success">
              ¡Todas las firmas han sido capturadas exitosamente!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignatureProgress;