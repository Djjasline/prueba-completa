import React from 'react';
import Icon from '../../../components/AppIcon';

const PreviewLoadingState = () => {
  return (
    <div className="flex-1 bg-muted p-6">
      <div className="bg-white rounded-lg shadow-card h-full flex flex-col items-center justify-center space-y-6">
        {/* Loading Animation */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-border rounded-full animate-spin border-t-primary" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon name="FileText" size={24} className="text-primary" />
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            Generando Vista Previa
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Procesando el reporte de servicio y preparando la vista previa del documento PDF...
          </p>
        </div>

        {/* Progress Steps */}
        <div className="space-y-3 w-full max-w-sm">
          {[
            { label: 'Validando datos del reporte', completed: true },
            { label: 'Aplicando formato profesional', completed: true },
            { label: 'Generando vista previa', completed: false },
            { label: 'Preparando controles de navegación', completed: false }
          ]?.map((step, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className={`flex items-center justify-center w-5 h-5 rounded-full ${
                step?.completed 
                  ? 'bg-success text-success-foreground' 
                  : 'bg-muted border-2 border-border'
              }`}>
                {step?.completed ? (
                  <Icon name="Check" size={12} />
                ) : (
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" />
                )}
              </div>
              <span className={`text-sm ${
                step?.completed ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {step?.label}
              </span>
            </div>
          ))}
        </div>

        {/* Estimated Time */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Tiempo estimado: 5-10 segundos
          </p>
        </div>
      </div>
    </div>
  );
};

export default PreviewLoadingState;