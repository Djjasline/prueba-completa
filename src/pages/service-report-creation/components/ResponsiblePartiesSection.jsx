import React from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const ResponsiblePartiesSection = ({ 
  formData, 
  updateFormData, 
  isCollapsed, 
  onToggleCollapse 
}) => {
  const handleAstapChange = (field, value) => {
    updateFormData('responsibleParties', {
      ...formData?.responsibleParties,
      astap: { ...formData?.responsibleParties?.astap, [field]: value }
    });
  };

  const handleClientChange = (field, value) => {
    updateFormData('responsibleParties', {
      ...formData?.responsibleParties,
      client: { ...formData?.responsibleParties?.client, [field]: value }
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-card">
      <div 
        className="flex items-center justify-between p-6 cursor-pointer"
        onClick={onToggleCollapse}
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
            <Icon name="Users" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Partes Responsables
            </h3>
            <p className="text-sm text-muted-foreground">
              Información de contacto del técnico y cliente
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
            {/* ASTAP Technician */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                  <Icon name="Wrench" size={16} className="text-primary-foreground" />
                </div>
                <h4 className="text-lg font-semibold text-foreground">
                  Técnico ASTAP
                </h4>
              </div>
              
              <Input
                label="Nombre Completo"
                type="text"
                placeholder="Nombre del técnico ASTAP"
                value={formData?.responsibleParties?.astap?.name}
                onChange={(e) => handleAstapChange('name', e?.target?.value)}
                required
              />
              
              <Input
                label="Cargo/Posición"
                type="text"
                placeholder="Técnico Senior, Especialista, etc."
                value={formData?.responsibleParties?.astap?.position}
                onChange={(e) => handleAstapChange('position', e?.target?.value)}
                required
              />
              
              <Input
                label="Teléfono"
                type="tel"
                placeholder="+57 300 123 4567"
                value={formData?.responsibleParties?.astap?.phone}
                onChange={(e) => handleAstapChange('phone', e?.target?.value)}
                required
              />
              
              <Input
                label="Email"
                type="email"
                placeholder="tecnico@astap.com"
                value={formData?.responsibleParties?.astap?.email}
                onChange={(e) => handleAstapChange('email', e?.target?.value)}
              />
            </div>
            
            {/* Client Representative */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-secondary rounded-lg">
                  <Icon name="Building" size={16} className="text-secondary-foreground" />
                </div>
                <h4 className="text-lg font-semibold text-foreground">
                  Representante del Cliente
                </h4>
              </div>
              
              <Input
                label="Nombre Completo"
                type="text"
                placeholder="Nombre del representante"
                value={formData?.responsibleParties?.client?.name}
                onChange={(e) => handleClientChange('name', e?.target?.value)}
                required
              />
              
              <Input
                label="Cargo/Posición"
                type="text"
                placeholder="Supervisor, Gerente, etc."
                value={formData?.responsibleParties?.client?.position}
                onChange={(e) => handleClientChange('position', e?.target?.value)}
                required
              />
              
              <Input
                label="Teléfono"
                type="tel"
                placeholder="+57 300 123 4567"
                value={formData?.responsibleParties?.client?.phone}
                onChange={(e) => handleClientChange('phone', e?.target?.value)}
                required
              />
              
              <Input
                label="Email"
                type="email"
                placeholder="cliente@empresa.com"
                value={formData?.responsibleParties?.client?.email}
                onChange={(e) => handleClientChange('email', e?.target?.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponsiblePartiesSection;