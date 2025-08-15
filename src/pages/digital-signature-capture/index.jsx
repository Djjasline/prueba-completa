import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalOverlay from '../../components/ui/ModalOverlay';
import WorkflowProgress from '../../components/ui/WorkflowProgress';
import ContextualActionBar from '../../components/ui/ContextualActionBar';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

// Import custom components
import SignatureCanvas from './components/SignatureCanvas';
import SignatureInstructions from './components/SignatureInstructions';
import SignatureProgress from './components/SignatureProgress';
import ResponsiblePartyForm from './components/ResponsiblePartyForm';

const DigitalSignatureCapture = () => {
  const navigate = useNavigate();
  const astapSignatureRef = useRef();
  const clientSignatureRef = useRef();

  // State management
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Signature states
  const [astapSignature, setAstapSignature] = useState(null);
  const [clientSignature, setClientSignature] = useState(null);

  // Responsible party data
  const [astapResponsible, setAstapResponsible] = useState({
    name: 'Carlos Mendoza',
    position: 'Técnico Senior',
    phone: '+52 55 1234 5678',
    email: 'carlos.mendoza@astap.com'
  });

  const [clientResponsible, setClientResponsible] = useState({
    name: '',
    position: '',
    phone: '',
    email: ''
  });

  // Validation
  const isFormValid = () => {
    return (astapSignature &&
    clientSignature &&
    astapResponsible?.name &&
    astapResponsible?.position &&
    astapResponsible?.phone &&
    clientResponsible?.name &&
    clientResponsible?.position && clientResponsible?.phone);
  };

  // Handlers
  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate('/service-report-creation');
  };

  const handleClearSignature = (type) => {
    if (type === 'astap' && astapSignatureRef?.current) {
      astapSignatureRef?.current?.clear();
      setAstapSignature(null);
    } else if (type === 'client' && clientSignatureRef?.current) {
      clientSignatureRef?.current?.clear();
      setClientSignature(null);
    }
  };

  const handleSaveSignatures = async () => {
    if (!isFormValid()) {
      alert('Por favor complete todos los campos requeridos y capture ambas firmas.');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate saving signatures
      const signatureData = {
        astap: {
          signature: astapSignature,
          responsible: astapResponsible,
          timestamp: new Date()?.toISOString()
        },
        client: {
          signature: clientSignature,
          responsible: clientResponsible,
          timestamp: new Date()?.toISOString()
        }
      };

      // Save to localStorage for persistence
      const existingData = JSON.parse(localStorage.getItem('serviceReportData') || '{}');
      localStorage.setItem('serviceReportData', JSON.stringify({
        ...existingData,
        signatures: signatureData
      }));

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Navigate to PDF preview
      navigate('/pdf-report-preview');
    } catch (error) {
      console.error('Error saving signatures:', error);
      alert('Error al guardar las firmas. Por favor intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueToPreview = () => {
    handleSaveSignatures();
  };

  // Action bar configuration
  const actionBarActions = [
    {
      label: 'Guardar y Continuar',
      variant: 'primary',
      onClick: handleContinueToPreview,
      disabled: !isFormValid(),
      loading: isLoading,
      icon: 'ArrowRight',
      iconPosition: 'right',
      primary: true
    },
    {
      label: 'Cancelar',
      variant: 'outline',
      onClick: handleCloseModal,
      disabled: isLoading
    }
  ];

  return (
    <ModalOverlay
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      title="Captura de Firmas Digitales"
      size="full"
      closeOnBackdrop={false}
      className="max-h-screen overflow-hidden"
    >
      <div className="flex flex-col h-full max-h-[calc(100vh-8rem)]">
        {/* Workflow Progress */}
        <div className="mb-6">
          <WorkflowProgress currentStep={2} />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Instructions */}
          <SignatureInstructions />

          {/* Progress Indicator */}
          <SignatureProgress 
            astapSigned={!!astapSignature}
            clientSigned={!!clientSignature}
          />

          {/* Signature Capture Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* ASTAP Signature */}
            <div className="space-y-4">
              <ResponsiblePartyForm
                title="Datos del Técnico ASTAP"
                data={astapResponsible}
                onChange={setAstapResponsible}
              />
              
              <SignatureCanvas
                ref={astapSignatureRef}
                title="Firma del Técnico ASTAP"
                subtitle={`${astapResponsible?.name} - ${astapResponsible?.position}`}
                onSignatureChange={setAstapSignature}
              />
              
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleClearSignature('astap')}
                  iconName="RotateCcw"
                  iconPosition="left"
                >
                  Limpiar Firma ASTAP
                </Button>
              </div>
            </div>

            {/* Client Signature */}
            <div className="space-y-4">
              <ResponsiblePartyForm
                title="Datos del Cliente"
                data={clientResponsible}
                onChange={setClientResponsible}
              />
              
              <SignatureCanvas
                ref={clientSignatureRef}
                title="Firma del Cliente"
                subtitle={clientResponsible?.name && clientResponsible?.position ? 
                  `${clientResponsible?.name} - ${clientResponsible?.position}` : 
                  'Complete los datos del cliente'
                }
                onSignatureChange={setClientSignature}
                disabled={!clientResponsible?.name || !clientResponsible?.position}
              />
              
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleClearSignature('client')}
                  iconName="RotateCcw"
                  iconPosition="left"
                  disabled={!clientResponsible?.name || !clientResponsible?.position}
                >
                  Limpiar Firma Cliente
                </Button>
              </div>
            </div>
          </div>

          {/* Validation Summary */}
          {!isFormValid() && (
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Icon name="AlertTriangle" size={16} className="text-warning flex-shrink-0 mt-0.5" />
                <div className="text-sm text-warning">
                  <strong>Campos Requeridos:</strong>
                  <ul className="mt-2 space-y-1 text-xs">
                    {!astapSignature && <li>• Firma del técnico ASTAP</li>}
                    {!clientSignature && <li>• Firma del cliente</li>}
                    {!clientResponsible?.name && <li>• Nombre del cliente</li>}
                    {!clientResponsible?.position && <li>• Cargo del cliente</li>}
                    {!clientResponsible?.phone && <li>• Teléfono del cliente</li>}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <ContextualActionBar 
          actions={actionBarActions}
          position="sticky"
          isLoading={isLoading}
        />
      </div>
    </ModalOverlay>
  );
};

export default DigitalSignatureCapture;