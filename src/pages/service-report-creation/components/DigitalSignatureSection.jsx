import React, { useRef, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const DigitalSignatureSection = ({ 
  formData, 
  updateFormData, 
  isCollapsed, 
  onToggleCollapse 
}) => {
  const astapCanvasRef = useRef(null);
  const clientCanvasRef = useRef(null);

  useEffect(() => {
    // Initialize canvas contexts
    if (astapCanvasRef?.current) {
      const canvas = astapCanvasRef?.current;
      const ctx = canvas?.getContext('2d');
      ctx.strokeStyle = '#003366';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
    }
    
    if (clientCanvasRef?.current) {
      const canvas = clientCanvasRef?.current;
      const ctx = canvas?.getContext('2d');
      ctx.strokeStyle = '#003366';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
    }
  }, []);

  const startDrawing = (canvas, e) => {
    const rect = canvas?.getBoundingClientRect();
    const x = e?.clientX - rect?.left;
    const y = e?.clientY - rect?.top;
    
    canvas.isDrawing = true;
    canvas.lastX = x;
    canvas.lastY = y;
  };

  const draw = (canvas, e) => {
    if (!canvas?.isDrawing) return;
    
    const rect = canvas?.getBoundingClientRect();
    const x = e?.clientX - rect?.left;
    const y = e?.clientY - rect?.top;
    
    const ctx = canvas?.getContext('2d');
    ctx?.beginPath();
    ctx?.moveTo(canvas?.lastX, canvas?.lastY);
    ctx?.lineTo(x, y);
    ctx?.stroke();
    
    canvas.lastX = x;
    canvas.lastY = y;
  };

  const stopDrawing = (canvas) => {
    canvas.isDrawing = false;
  };

  const clearSignature = (canvasRef, signatureType) => {
    const canvas = canvasRef?.current;
    const ctx = canvas?.getContext('2d');
    ctx?.clearRect(0, 0, canvas?.width, canvas?.height);
    
    updateFormData('digitalSignatures', {
      ...formData?.digitalSignatures,
      [signatureType]: null
    });
  };

  const saveSignature = (canvasRef, signatureType) => {
    const canvas = canvasRef?.current;
    const dataURL = canvas?.toDataURL();
    
    updateFormData('digitalSignatures', {
      ...formData?.digitalSignatures,
      [signatureType]: dataURL
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
            <Icon name="PenTool" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Firmas Digitales
            </h3>
            <p className="text-sm text-muted-foreground">
              Captura de firmas para aprobación del servicio
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
            {/* ASTAP Signature */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                  <Icon name="Wrench" size={16} className="text-primary-foreground" />
                </div>
                <h4 className="text-lg font-semibold text-foreground">
                  Firma Técnico ASTAP
                </h4>
              </div>
              
              <div className="border border-border rounded-lg p-4 bg-background">
                <canvas
                  ref={astapCanvasRef}
                  width={300}
                  height={150}
                  className="w-full h-32 border border-dashed border-muted-foreground/30 rounded cursor-crosshair bg-white"
                  onMouseDown={(e) => startDrawing(astapCanvasRef?.current, e)}
                  onMouseMove={(e) => draw(astapCanvasRef?.current, e)}
                  onMouseUp={() => stopDrawing(astapCanvasRef?.current)}
                  onMouseLeave={() => stopDrawing(astapCanvasRef?.current)}
                />
                
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-muted-foreground">
                    Firme en el área de arriba
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => clearSignature(astapCanvasRef, 'astap')}
                      iconName="RotateCcw"
                    >
                      Limpiar
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => saveSignature(astapCanvasRef, 'astap')}
                      iconName="Check"
                    >
                      Guardar
                    </Button>
                  </div>
                </div>
                
                {formData?.digitalSignatures?.astap && (
                  <div className="mt-3 p-2 bg-success/10 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Icon name="CheckCircle" size={16} className="text-success" />
                      <span className="text-sm text-success">
                        Firma guardada correctamente
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Client Signature */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-secondary rounded-lg">
                  <Icon name="Building" size={16} className="text-secondary-foreground" />
                </div>
                <h4 className="text-lg font-semibold text-foreground">
                  Firma Cliente
                </h4>
              </div>
              
              <div className="border border-border rounded-lg p-4 bg-background">
                <canvas
                  ref={clientCanvasRef}
                  width={300}
                  height={150}
                  className="w-full h-32 border border-dashed border-muted-foreground/30 rounded cursor-crosshair bg-white"
                  onMouseDown={(e) => startDrawing(clientCanvasRef?.current, e)}
                  onMouseMove={(e) => draw(clientCanvasRef?.current, e)}
                  onMouseUp={() => stopDrawing(clientCanvasRef?.current)}
                  onMouseLeave={() => stopDrawing(clientCanvasRef?.current)}
                />
                
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-muted-foreground">
                    Firme en el área de arriba
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => clearSignature(clientCanvasRef, 'client')}
                      iconName="RotateCcw"
                    >
                      Limpiar
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => saveSignature(clientCanvasRef, 'client')}
                      iconName="Check"
                    >
                      Guardar
                    </Button>
                  </div>
                </div>
                
                {formData?.digitalSignatures?.client && (
                  <div className="mt-3 p-2 bg-success/10 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Icon name="CheckCircle" size={16} className="text-success" />
                      <span className="text-sm text-success">
                        Firma guardada correctamente
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={20} className="text-primary mt-0.5" />
              <div>
                <h5 className="text-sm font-medium text-foreground mb-1">
                  Información sobre Firmas Digitales
                </h5>
                <p className="text-xs text-muted-foreground">
                  Las firmas digitales son requeridas para validar la conformidad del servicio realizado. 
                  Ambas partes deben firmar antes de generar el reporte final en PDF.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalSignatureSection;