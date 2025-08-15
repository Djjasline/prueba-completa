import React from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const GeneralInformationSection = ({ 
  formData, 
  updateFormData, 
  isCollapsed, 
  onToggleCollapse 
}) => {
  const handleInputChange = (field, value) => {
    updateFormData('generalInfo', { ...formData?.generalInfo, [field]: value });
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-card">
      <div 
        className="flex items-center justify-between p-6 cursor-pointer"
        onClick={onToggleCollapse}
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
            <Icon name="FileText" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Información General
            </h3>
            <p className="text-sm text-muted-foreground">
              Datos básicos del servicio y cliente
            </p>
          </div>
        </div>
        <Icon 
          name={isCollapsed ? "ChevronDown" : "ChevronUp"} 
          size={20} 
          className="text-muted-foreground" 
        />
      </div>
      {!isCollapsed && (
        <div className="px-6 pb-6 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Input
              label="Cliente"
              type="text"
              placeholder="Nombre del cliente"
              value={formData?.generalInfo?.client}
              onChange={(e) => handleInputChange('client', e?.target?.value)}
              required
            />
            
            <Input
              label="Código Interno"
              type="text"
              placeholder="Código de referencia interno"
              value={formData?.generalInfo?.internalCode}
              onChange={(e) => handleInputChange('internalCode', e?.target?.value)}
              required
            />
            
            <Input
              label="Fecha de Servicio"
              type="date"
              value={formData?.generalInfo?.serviceDate}
              onChange={(e) => handleInputChange('serviceDate', e?.target?.value)}
              required
            />
            
            <Input
              label="Dirección"
              type="text"
              placeholder="Dirección del servicio"
              value={formData?.generalInfo?.address}
              onChange={(e) => handleInputChange('address', e?.target?.value)}
              required
            />
            
            <Input
              label="Referencia"
              type="text"
              placeholder="Referencia adicional"
              value={formData?.generalInfo?.reference}
              onChange={(e) => handleInputChange('reference', e?.target?.value)}
            />
            
            <Input
              label="Personal Técnico"
              type="text"
              placeholder="Nombre del técnico asignado"
              value={formData?.generalInfo?.technicalPersonnel}
              onChange={(e) => handleInputChange('technicalPersonnel', e?.target?.value)}
              required
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralInformationSection;