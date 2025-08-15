import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const CustomSignatureCanvas = forwardRef(({ 
  title, 
  subtitle, 
  onSignatureChange, 
  disabled = false,
  className = '' 
}, ref) => {
  const sigCanvasRef = useRef();

  useImperativeHandle(ref, () => ({
    clear: () => {
      if (sigCanvasRef?.current) {
        sigCanvasRef?.current?.clear();
        onSignatureChange && onSignatureChange(null);
      }
    },
    isEmpty: () => {
      return sigCanvasRef?.current ? sigCanvasRef?.current?.isEmpty() : true;
    },
    getSignatureData: () => {
      if (sigCanvasRef?.current && !sigCanvasRef?.current?.isEmpty()) {
        return sigCanvasRef?.current?.toDataURL();
      }
      return null;
    }
  }));

  const handleSignatureEnd = () => {
    if (sigCanvasRef?.current && !sigCanvasRef?.current?.isEmpty()) {
      const signatureData = sigCanvasRef?.current?.toDataURL();
      onSignatureChange && onSignatureChange(signatureData);
    }
  };

  const handleClear = () => {
    if (sigCanvasRef?.current) {
      sigCanvasRef?.current?.clear();
      onSignatureChange && onSignatureChange(null);
    }
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-1">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>

      {/* Signature Canvas */}
      <div className="relative mb-4">
        <div className="border-2 border-dashed border-border rounded-lg bg-muted/30 p-4">
          <SignatureCanvas
            ref={sigCanvasRef}
            canvasProps={{
              width: 400,
              height: 200,
              className: 'signature-canvas w-full h-full bg-white rounded border'
            }}
            onEnd={handleSignatureEnd}
            disabled={disabled}
            backgroundColor="white"
            penColor="#1A202C"
          />
        </div>
        
        {/* Canvas Instructions */}
        <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs text-muted-foreground">
          <Icon name="PenTool" size={12} className="inline mr-1" />
          Firme aquí
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={handleClear}
          disabled={disabled}
          iconName="RotateCcw"
          iconPosition="left"
        >
          Limpiar
        </Button>
        
        <div className="text-xs text-muted-foreground">
          Use mouse o toque para firmar
        </div>
      </div>
    </div>
  );
});

CustomSignatureCanvas.displayName = 'CustomSignatureCanvas';

export default CustomSignatureCanvas;