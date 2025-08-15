import React from 'react';
import Icon from '../../../components/AppIcon';

const SignatureInstructions = ({ className = '' }) => {
  const instructions = [
    {
      icon: 'PenTool',
      title: 'Firme con claridad',
      description: 'Use trazos claros y legibles para su firma digital'
    },
    {
      icon: 'Smartphone',
      title: 'Compatible con dispositivos',
      description: 'Funciona con mouse, stylus o toque en pantalla'
    },
    {
      icon: 'Shield',
      title: 'Seguridad garantizada',
      description: 'Sus firmas están protegidas y encriptadas'
    },
    {
      icon: 'FileCheck',
      title: 'Validación legal',
      description: 'Las firmas digitales tienen validez legal completa'
    }
  ];

  return (
    <div className={`bg-muted/50 border border-border rounded-lg p-6 ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="Info" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-foreground">
          Instrucciones para Firmar
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {instructions?.map((instruction, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg flex-shrink-0">
              <Icon name={instruction?.icon} size={16} className="text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-foreground mb-1">
                {instruction?.title}
              </h4>
              <p className="text-xs text-muted-foreground">
                {instruction?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* Legal Disclaimer */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-start space-x-2">
          <Icon name="AlertTriangle" size={16} className="text-warning flex-shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <strong className="text-foreground">Aviso Legal:</strong> Al firmar digitalmente este documento, usted acepta que su firma electrónica tiene la misma validez legal que una firma manuscrita. Esta acción constituye su consentimiento y aprobación del contenido del reporte de servicio.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignatureInstructions;