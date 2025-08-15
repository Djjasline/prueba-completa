import React from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import CameraCapture from '../../../components/ui/CameraCapture';
import Icon from '../../../components/AppIcon';

const DynamicTestingTable = ({ 
  title, 
  description, 
  icon, 
  data, 
  onUpdateData, 
  isCollapsed, 
  onToggleCollapse 
}) => {
  const addRow = () => {
    const newRow = {
      id: Date.now(),
      parameter: '',
      expectedValue: '',
      actualValue: '',
      status: '',
      observations: '',
      evidenceImage: null
    };
    onUpdateData([...data, newRow]);
  };

  const removeRow = (id) => {
    onUpdateData(data?.filter(row => row?.id !== id));
  };

  const updateRow = (id, field, value) => {
    onUpdateData(data?.map(row => 
      row?.id === id ? { ...row, [field]: value } : row
    ));
  };

  const handleImageCapture = (id, imageData) => {
    updateRow(id, 'evidenceImage', imageData);
  };

  const removeImage = (id) => {
    updateRow(id, 'evidenceImage', null);
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-card">
      <div 
        className="flex items-center justify-between p-6 cursor-pointer"
        onClick={onToggleCollapse}
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-secondary/10 rounded-lg">
            <Icon name={icon} size={20} className="text-secondary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {description}
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
                Parámetros de Prueba ({data?.length})
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={addRow}
                iconName="Plus"
                iconPosition="left"
              >
                Agregar Fila
              </Button>
            </div>
            
            {data?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="Table" size={48} className="mx-auto mb-3 opacity-50" />
                <p>No hay parámetros de prueba agregados</p>
                <p className="text-sm">Haz clic en "Agregar Fila" para comenzar</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border border-border rounded-lg">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-foreground border-b border-border">
                        Parámetro
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-foreground border-b border-border">
                        Valor Esperado
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-foreground border-b border-border">
                        Valor Real
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-foreground border-b border-border">
                        Estado
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-foreground border-b border-border min-w-[300px]">
                        Observación y Evidencia
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-foreground border-b border-border w-20">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.map((row, index) => (
                      <tr key={row?.id} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                        <td className="px-4 py-3 border-b border-border">
                          <Input
                            type="text"
                            placeholder="Ej: Voltaje"
                            value={row?.parameter}
                            onChange={(e) => updateRow(row?.id, 'parameter', e?.target?.value)}
                            className="border-0 bg-transparent p-0 focus:ring-0"
                          />
                        </td>
                        <td className="px-4 py-3 border-b border-border">
                          <Input
                            type="text"
                            placeholder="Ej: 220V"
                            value={row?.expectedValue}
                            onChange={(e) => updateRow(row?.id, 'expectedValue', e?.target?.value)}
                            className="border-0 bg-transparent p-0 focus:ring-0"
                          />
                        </td>
                        <td className="px-4 py-3 border-b border-border">
                          <Input
                            type="text"
                            placeholder="Ej: 218V"
                            value={row?.actualValue}
                            onChange={(e) => updateRow(row?.id, 'actualValue', e?.target?.value)}
                            className="border-0 bg-transparent p-0 focus:ring-0"
                          />
                        </td>
                        <td className="px-4 py-3 border-b border-border">
                          <Input
                            type="text"
                            placeholder="Ej: OK"
                            value={row?.status}
                            onChange={(e) => updateRow(row?.id, 'status', e?.target?.value)}
                            className="border-0 bg-transparent p-0 focus:ring-0"
                          />
                        </td>
                        <td className="px-4 py-3 border-b border-border">
                          <div className="space-y-3">
                            {/* Text Observations */}
                            <Input
                              type="text"
                              placeholder="Observaciones adicionales"
                              value={row?.observations}
                              onChange={(e) => updateRow(row?.id, 'observations', e?.target?.value)}
                              className="border-0 bg-transparent p-0 focus:ring-0"
                            />
                            
                            {/* Image Evidence Section */}
                            <div className="flex items-start space-x-2">
                              {row?.evidenceImage ? (
                                <div className="flex-1">
                                  <div className="relative inline-block">
                                    <img 
                                      src={row?.evidenceImage?.dataUrl} 
                                      alt="Evidencia de prueba"
                                      className="w-16 h-16 object-cover rounded border border-border"
                                    />
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeImage(row?.id)}
                                      className="absolute -top-2 -right-2 p-1 h-6 w-6 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full"
                                    >
                                      <Icon name="X" size={12} />
                                    </Button>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {row?.evidenceImage?.fileName}
                                  </p>
                                </div>
                              ) : (
                                <div className="flex-1">
                                  <CameraCapture
                                    onCapture={(imageData) => handleImageCapture(row?.id, imageData)}
                                    label="Capturar Evidencia"
                                    className="text-xs py-1 px-2 h-8"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 border-b border-border text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeRow(row?.id)}
                            iconName="Trash2"
                            className="text-destructive hover:text-destructive"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicTestingTable;