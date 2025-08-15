import React from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const MaterialsUsageSection = ({ 
  formData, 
  updateFormData, 
  isCollapsed, 
  onToggleCollapse 
}) => {
  const addMaterial = () => {
    const newMaterial = {
      id: Date.now(),
      quantity: '',
      materialName: '',
      materialCode: '',
      unitPrice: '',     // lo dejamos por compatibilidad, aunque ya no se muestra
      totalPrice: ''     // idem
    };
    updateFormData('materialsUsage', [...formData?.materialsUsage, newMaterial]);
  };

  const removeMaterial = (id) => {
    updateFormData('materialsUsage', formData?.materialsUsage?.filter(material => material?.id !== id));
  };

  const updateMaterial = (id, field, value) => {
    const updatedMaterials = formData?.materialsUsage?.map(material => {
      if (material?.id === id) {
        const updated = { ...material, [field]: value };
        
        // Se mantiene la lógica por si en el futuro vuelves a usar precios
        if (field === 'quantity' || field === 'unitPrice') {
          const quantity = parseFloat(field === 'quantity' ? value : updated?.quantity) || 0;
          const unitPrice = parseFloat(field === 'unitPrice' ? value : updated?.unitPrice) || 0;
          updated.totalPrice = (quantity * unitPrice)?.toFixed(2);
        }
        
        return updated;
      }
      return material;
    });
    updateFormData('materialsUsage', updatedMaterials);
  };

  // Ya no se usa en la UI, pero se conserva por compatibilidad
  const getTotalCost = () => {
    return formData?.materialsUsage?.reduce((total, material) => {
      return total + (parseFloat(material?.totalPrice) || 0);
    }, 0)?.toFixed(2);
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-card">
      <div 
        className="flex items-center justify-between p-6 cursor-pointer"
        onClick={onToggleCollapse}
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-success/10 rounded-lg">
            <Icon name="Package" size={20} className="text-success" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Uso de Materiales
            </h3>
            <p className="text-sm text-muted-foreground">
              Registro de materiales utilizados en el servicio
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
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-foreground">
                Materiales Utilizados ({formData?.materialsUsage?.length})
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={addMaterial}
                iconName="Plus"
                iconPosition="left"
              >
                Agregar Material
              </Button>
            </div>
            
            {formData?.materialsUsage?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="Package" size={48} className="mx-auto mb-3 opacity-50" />
                <p>No hay materiales registrados</p>
                <p className="text-sm">Haz clic en "Agregar Material" para comenzar</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full border border-border rounded-lg">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-foreground border-b border-border">
                          Cantidad
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-foreground border-b border-border">
                          Material
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-foreground border-b border-border">
                          Código
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-foreground border-b border-border w-20">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData?.materialsUsage?.map((material, index) => (
                        <tr key={material?.id} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                          <td className="px-4 py-3 border-b border-border">
                            <Input
                              type="number"
                              placeholder="1"
                              value={material?.quantity}
                              onChange={(e) => updateMaterial(material?.id, 'quantity', e?.target?.value)}
                              className="border-0 bg-transparent p-0 focus:ring-0 w-20"
                              min="0"
                              step="0.01"
                            />
                          </td>
                          <td className="px-4 py-3 border-b border-border">
                            <Input
                              type="text"
                              placeholder="Nombre del material"
                              value={material?.materialName}
                              onChange={(e) => updateMaterial(material?.id, 'materialName', e?.target?.value)}
                              className="border-0 bg-transparent p-0 focus:ring-0"
                            />
                          </td>
                          <td className="px-4 py-3 border-b border-border">
                            <Input
                              type="text"
                              placeholder="MAT-001"
                              value={material?.materialCode}
                              onChange={(e) => updateMaterial(material?.id, 'materialCode', e?.target?.value)}
                              className="border-0 bg-transparent p-0 focus:ring-0"
                            />
                          </td>
                          <td className="px-4 py-3 border-b border-border text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeMaterial(material?.id)}
                              iconName="Trash2"
                              className="text-destructive hover:text-destructive"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Se eliminó el bloque de "Costo Total de Materiales" */}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialsUsageSection;
