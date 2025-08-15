import React, { useState, useCallback, useRef } from 'react';
import Webcam from 'react-webcam';
import Button from './Button';
import Icon from '../AppIcon';

const CameraCapture = ({ 
  onCapture, 
  onClose, 
  className = "",
  label = "Capturar Evidencia"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const webcamRef = useRef(null);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "environment" // Use back camera by default on mobile
  };

  const openCamera = useCallback(() => {
    setIsOpen(true);
    setCapturedImage(null);
    setError(null);
  }, []);

  const closeCamera = useCallback(() => {
    setIsOpen(false);
    setCapturedImage(null);
    setError(null);
    if (onClose) onClose();
  }, [onClose]);

  const capture = useCallback(() => {
    const imageSrc = webcamRef?.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
    }
  }, [webcamRef]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
  }, []);

  const confirmCapture = useCallback(async () => {
    if (capturedImage && onCapture) {
      setIsLoading(true);
      try {
        // Convert base64 to blob for better handling
        const response = await fetch(capturedImage);
        const blob = await response?.blob();
        
        // Create a file-like object
        const timestamp = new Date()?.toISOString()?.replace(/[:.]/g, '-');
        const fileName = `evidencia-${timestamp}.jpg`;
        
        const imageFile = new File([blob], fileName, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });

        await onCapture({
          dataUrl: capturedImage,
          file: imageFile,
          fileName: fileName,
          timestamp: timestamp
        });
        
        closeCamera();
      } catch (err) {
        setError('Error al procesar la imagen');
        console.error('Camera capture error:', err);
      } finally {
        setIsLoading(false);
      }
    }
  }, [capturedImage, onCapture, closeCamera]);

  const handleUserMediaError = useCallback((error) => {
    console.error('Camera access error:', error);
    setError('No se pudo acceder a la cámara. Verifique los permisos.');
  }, []);

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        onClick={openCamera}
        className={`flex items-center space-x-2 ${className}`}
      >
        <Icon name="Camera" size={16} />
        <span>{label}</span>
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            Capturar Evidencia Fotográfica
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={closeCamera}
            className="p-1 hover:bg-gray-100"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Camera Area */}
        <div className="p-4">
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="AlertCircle" size={16} className="text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            </div>
          )}

          <div className="relative bg-black rounded-lg overflow-hidden mb-4">
            {capturedImage ? (
              <img 
                src={capturedImage} 
                alt="Evidencia capturada"
                className="w-full h-64 object-cover"
              />
            ) : (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                screenshotQuality={0.8}
                videoConstraints={videoConstraints}
                onUserMediaError={handleUserMediaError}
                className="w-full h-64 object-cover"
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center space-x-3">
            {capturedImage ? (
              <>
                <Button
                  variant="outline"
                  onClick={retakePhoto}
                  className="flex items-center space-x-2"
                >
                  <Icon name="RotateCcw" size={16} />
                  <span>Repetir</span>
                </Button>
                <Button
                  onClick={confirmCapture}
                  loading={isLoading}
                  className="flex items-center space-x-2"
                >
                  <Icon name="Check" size={16} />
                  <span>Confirmar</span>
                </Button>
              </>
            ) : (
              <Button
                onClick={capture}
                className="flex items-center space-x-2 bg-primary hover:bg-primary/90"
              >
                <Icon name="Camera" size={20} />
                <span>Capturar</span>
              </Button>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="px-4 pb-4 border-t border-border pt-4">
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Asegúrese de que la imagen esté bien iluminada y enfocada</p>
            <p>• Mantenga estable el dispositivo al capturar</p>
            <p>• La imagen se guardará automáticamente al confirmar</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;