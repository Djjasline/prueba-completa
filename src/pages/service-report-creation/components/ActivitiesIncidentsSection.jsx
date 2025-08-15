import React from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import CameraCapture from '../../../components/ui/CameraCapture';
import Icon from '../../../components/AppIcon';

const ActivitiesIncidentsSection = ({ 
  formData, 
  updateFormData, 
  isCollapsed, 
  onToggleCollapse 
}) => {
  const handleInputChange = (field, value) => {
    updateFormData('activitiesIncidents', { ...formData?.activitiesIncidents, [field]: value });
  };

  const handleImageCapture = (type, imageData) => {
    const currentImages = formData?.activitiesIncidents?.[`${type}EvidenceImages`] || [];
    const updatedImages = [...currentImages, imageData];
    
    updateFormData('activitiesIncidents', { 
      ...formData?.activitiesIncidents, 
      [`${type}EvidenceImages`]: updatedImages 
    });
  };

  const removeImage = (type, index) => {
    const currentImages = formData?.activitiesIncidents?.[`${type}EvidenceImages`] || [];
    const updatedImages = currentImages?.filter((_, i) => i !== index);
    
    updateFormData('activitiesIncidents', { 
      ...formData?.activitiesIncidents, 
      [`${type}EvidenceImages`]: updatedImages 
    });
  };

  const renderImageGallery = (type, title) => {
    const images = formData?.activitiesIncidents?.[`${type}EvidenceImages`] || [];
    
    if (images?.length === 0) return null;

    return (
      <div className="mt-3">
        <p className="text-sm font-medium text-foreground mb-2">
          Imágenes Capturadas ({images?.length})
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {images?.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image?.dataUrl}
                alt={`${title} evidencia ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-border"
              />
              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeImage(type, index)}
                  className="p-1 h-6 w-6"
                >
                  <Icon name="X" size={12} />
                </Button>
              </div>
              <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                {new Date(image?.timestamp)?.toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-card">
      <div 
        className="flex items-center justify-between p-6 cursor-pointer"
        onClick={onToggleCollapse}
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-warning/10 rounded-lg">
            <Icon name="AlertTriangle" size={20} className="text-warning" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Actividades e Incidentes
            </h3>
            <p className="text-sm text-muted-foreground">
              Descripción de trabajos realizados y eventos
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
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Descripción de Actividades Realizadas
              </label>
              <textarea
                className="w-full h-32 px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                placeholder="Describe detalladamente las actividades y trabajos realizados durante el servicio..."
                value={formData?.activitiesIncidents?.activitiesDescription}
                onChange={(e) => handleInputChange('activitiesDescription', e?.target?.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Evidencia de Actividades
              </label>
              <div className="space-y-4">
                <Input
                  type="url"
                  placeholder="https://ejemplo.com/evidencia-actividades"
                  value={formData?.activitiesIncidents?.activitiesEvidenceUrl}
                  onChange={(e) => handleInputChange('activitiesEvidenceUrl', e?.target?.value)}
                  description="Enlace a fotografías o documentos externos"
                />
                
                <div className="flex items-center space-x-2">
                  <div className="h-px bg-border flex-1"></div>
                  <span className="text-sm text-muted-foreground px-2">o</span>
                  <div className="h-px bg-border flex-1"></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Capture evidencia fotográfica directamente
                  </p>
                  <CameraCapture
                    onCapture={(imageData) => handleImageCapture('activities', imageData)}
                    label="Capturar Foto"
                  />
                </div>
                
                {renderImageGallery('activities', 'Actividades')}
              </div>
            </div>
            
            <div className="border-t border-border pt-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Descripción de Incidentes
              </label>
              <textarea
                className="w-full h-32 px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                placeholder="Describe cualquier incidente, problema o situación especial ocurrida durante el servicio..."
                value={formData?.activitiesIncidents?.incidentsDescription}
                onChange={(e) => handleInputChange('incidentsDescription', e?.target?.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Evidencia de Incidentes
              </label>
              <div className="space-y-4">
                <Input
                  type="url"
                  placeholder="https://ejemplo.com/evidencia-incidentes"
                  value={formData?.activitiesIncidents?.incidentsEvidenceUrl}
                  onChange={(e) => handleInputChange('incidentsEvidenceUrl', e?.target?.value)}
                  description="Enlace a fotografías o documentos externos"
                />
                
                <div className="flex items-center space-x-2">
                  <div className="h-px bg-border flex-1"></div>
                  <span className="text-sm text-muted-foreground px-2">o</span>
                  <div className="h-px bg-border flex-1"></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Capture evidencia fotográfica directamente
                  </p>
                  <CameraCapture
                    onCapture={(imageData) => handleImageCapture('incidents', imageData)}
                    label="Capturar Foto"
                  />
                </div>
                
                {renderImageGallery('incidents', 'Incidentes')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitiesIncidentsSection;