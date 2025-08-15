import React from 'react';
import Icon from '../AppIcon';

const WorkflowProgress = ({ currentStep = 1, className = '' }) => {
  const steps = [
    {
      id: 1,
      label: 'Crear Reporte',
      description: 'Información del servicio',
      icon: 'FileText'
    },
    {
      id: 2,
      label: 'Firma Digital',
      description: 'Captura de firma',
      icon: 'PenTool'
    },
    {
      id: 3,
      label: 'Vista Previa',
      description: 'Revisión del PDF',
      icon: 'Eye'
    },
    {
      id: 4,
      label: 'Envío',
      description: 'Distribución por email',
      icon: 'Send'
    }
  ];

  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'pending';
  };

  const getStepClasses = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-success-foreground border-success';
      case 'current':
        return 'bg-primary text-primary-foreground border-primary';
      case 'pending':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getConnectorClasses = (stepId) => {
    return stepId < currentStep ? 'bg-success' : 'bg-border';
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Desktop Horizontal Layout */}
      <div className="hidden md:flex items-center justify-between">
        {steps?.map((step, index) => (
          <React.Fragment key={step?.id}>
            <div className="flex flex-col items-center space-y-2">
              {/* Step Circle */}
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-micro ${getStepClasses(
                  getStepStatus(step?.id)
                )}`}
              >
                {getStepStatus(step?.id) === 'completed' ? (
                  <Icon name="Check" size={20} />
                ) : (
                  <Icon name={step?.icon} size={20} />
                )}
              </div>
              
              {/* Step Label */}
              <div className="text-center">
                <div className="text-sm font-medium text-foreground">
                  {step?.label}
                </div>
                <div className="text-xs text-muted-foreground">
                  {step?.description}
                </div>
              </div>
            </div>
            
            {/* Connector Line */}
            {index < steps?.length - 1 && (
              <div className="flex-1 mx-4">
                <div
                  className={`h-0.5 transition-layout ${getConnectorClasses(
                    step?.id
                  )}`}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      {/* Mobile Vertical Layout */}
      <div className="md:hidden space-y-4">
        {steps?.map((step, index) => (
          <div key={step?.id} className="flex items-start space-x-4">
            {/* Step Circle and Connector */}
            <div className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-micro ${getStepClasses(
                  getStepStatus(step?.id)
                )}`}
              >
                {getStepStatus(step?.id) === 'completed' ? (
                  <Icon name="Check" size={16} />
                ) : (
                  <Icon name={step?.icon} size={16} />
                )}
              </div>
              
              {/* Vertical Connector */}
              {index < steps?.length - 1 && (
                <div
                  className={`w-0.5 h-8 mt-2 transition-layout ${getConnectorClasses(
                    step?.id
                  )}`}
                />
              )}
            </div>
            
            {/* Step Content */}
            <div className="flex-1 pb-2">
              <div className="text-sm font-medium text-foreground">
                {step?.label}
              </div>
              <div className="text-xs text-muted-foreground">
                {step?.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowProgress;