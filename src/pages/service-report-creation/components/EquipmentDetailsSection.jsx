import React from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const EquipmentDetailsSection = ({ 
  formData, 
  updateFormData, 
  isCollapsed, 
  onToggleCollapse 
}) => {
  const handleInputChange = (field, value) => {
    updateFormData('equipmentDetails', { ...formData?.equipmentDetails, [field]: value });
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-card">
      <div 
        className="flex items-center justify-between p-6 cursor-pointer"
        onClick={onToggleCollapse}
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-accent/10 rounded-lg">
            <Icon name="Settings" size={20} className="text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Detalles del Equipo
            </h3>
            <p className="text-sm text-muted-foreground">
              Especificaciones técnicas del equipo intervenido
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
          <div className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Tipo de Equipo"
                type="text"
                placeholder="Ej: Generador, Compresor, Motor"
                value={formData?.equipmentDetails?.type}
                onChange={(e) => handleInputChange('type', e?.target?.value)}
                required
              />
              
              <Input
                label="Marca"
                type="text"
                placeholder="Marca del equipo"
                value={formData?.equipmentDetails?.brand}
                onChange={(e) => handleInputChange('brand', e?.target?.value)}
                required
              />
              
              <Input
                label="Modelo"
                type="text"
                placeholder="Modelo del equipo"
                value={formData?.equipmentDetails?.model}
                onChange={(e) => handleInputChange('model', e?.target?.value)}
                required
              />
              
              <Input
                label="Número de Serie"
                type="text"
                placeholder="Número de serie del equipo"
                value={formData?.equipmentDetails?.serialNumber}
                onChange={(e) => handleInputChange('serialNumber', e?.target?.value)}
                required
              />
              
              <Input
                label="Año de Fabricación"
                type="number"
                placeholder="2023"
                value={formData?.equipmentDetails?.year}
                onChange={(e) => handleInputChange('year', e?.target?.value)}
                min="1900"
                max={new Date()?.getFullYear()}
              />
              
              <Input
                label="VIN/Chasis"
                type="text"
                placeholder="Número de VIN o chasis"
                value={formData?.equipmentDetails?.vinChassis}
                onChange={(e) => handleInputChange('vinChassis', e?.target?.value)}
              />
              
              <Input
                label="Número de Placa"
                type="text"
                placeholder="Placa del vehículo/equipo"
                value={formData?.equipmentDetails?.plateNumber}
                onChange={(e) => handleInputChange('plateNumber', e?.target?.value)}
              />
              
              <Input
                label="Horas de Trabajo"
                type="number"
                placeholder="Horas de operación"
                value={formData?.equipmentDetails?.workHours}
                onChange={(e) => handleInputChange('workHours', e?.target?.value)}
                min="0"
                step="0.1"
              />
              
              <Input
                label="Kilometraje"
                type="number"
                placeholder="Kilometraje actual"
                value={formData?.equipmentDetails?.mileage}
                onChange={(e) => handleInputChange('mileage', e?.target?.value)}
                min="0"
              />
            </div>
            
            <div className="border-t border-border pt-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Imagen Panorámica del Equipo
              </label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-muted/30">
                <Icon name="Camera" size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Arrastra una imagen aquí o haz clic para seleccionar
                </p>
                <p className="text-xs text-muted-foreground">
                  Formatos soportados: JPG, PNG, WebP (máx. 10MB)
                </p>
                <Input
                  type="file"
                  accept="image/*"
                  className="mt-4"
                  onChange={(e) => {
                    const file = e?.target?.files?.[0];
                    if (file) {
                      // In a real implementation, you would upload the file
                      // For now, we'll just store the filename handleInputChange('panoramicImage', file.name);
                    }
                  }}
                />
                {formData?.equipmentDetails?.panoramicImage && (
                  <div className="mt-4 p-3 bg-success/10 rounded-lg">
                    <div className="flex items-center justify-center space-x-2">
                      <Icon name="CheckCircle" size={16} className="text-success" />
                      <span className="text-sm text-success">
                        Imagen cargada: {formData?.equipmentDetails?.panoramicImage}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentDetailsSection;