import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';


const FloatingActionToolbar = ({ reportData, onGeneratePDF, onSendEmail }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      await onGeneratePDF();
      // Simulate PDF generation delay
      setTimeout(() => {
        setIsGenerating(false);
      }, 2000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setIsGenerating(false);
    }
  };

  const handleSendEmail = async () => {
    setIsSending(true);
    try {
      await onSendEmail();
      // Navigate to email interface
      navigate('/email-integration-interface');
    } catch (error) {
      console.error('Error sending email:', error);
      setIsSending(false);
    }
  };

  const handleReturnToEdit = () => {
    navigate('/service-report-creation');
  };

  const handleAddSignature = () => {
    navigate('/digital-signature-capture');
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-1000">
      {/* Desktop Toolbar */}
      <div className="hidden md:flex items-center space-x-3 bg-card border border-border rounded-lg shadow-modal p-4">
        {/* Secondary Actions */}
        <Button
          variant="outline"
          onClick={handleReturnToEdit}
          iconName="Edit"
          iconPosition="left"
        >
          Editar Reporte
        </Button>

        <Button
          variant="outline"
          onClick={handleAddSignature}
          iconName="PenTool"
          iconPosition="left"
        >
          Agregar Firmas
        </Button>

        <div className="w-px h-8 bg-border" />

        {/* Primary Actions */}
        <Button
          variant="secondary"
          onClick={handleGeneratePDF}
          loading={isGenerating}
          iconName="Download"
          iconPosition="left"
        >
          {isGenerating ? 'Generando...' : 'Descargar PDF'}
        </Button>

        <Button
          variant="default"
          onClick={handleSendEmail}
          loading={isSending}
          iconName="Send"
          iconPosition="left"
        >
          {isSending ? 'Enviando...' : 'Enviar por Email'}
        </Button>
      </div>

      {/* Mobile Toolbar */}
      <div className="md:hidden bg-card border border-border rounded-lg shadow-modal p-4 w-80">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReturnToEdit}
            iconName="Edit"
            iconPosition="left"
          >
            Editar
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleAddSignature}
            iconName="PenTool"
            iconPosition="left"
          >
            Firmas
          </Button>
        </div>

        <div className="space-y-2">
          <Button
            variant="secondary"
            fullWidth
            onClick={handleGeneratePDF}
            loading={isGenerating}
            iconName="Download"
            iconPosition="left"
          >
            {isGenerating ? 'Generando PDF...' : 'Descargar PDF'}
          </Button>

          <Button
            variant="default"
            fullWidth
            onClick={handleSendEmail}
            loading={isSending}
            iconName="Send"
            iconPosition="left"
          >
            {isSending ? 'Enviando...' : 'Enviar por Email'}
          </Button>
        </div>
      </div>

      {/* Quick Actions Tooltip */}
      <div className="hidden lg:block absolute -top-12 left-1/2 transform -translate-x-1/2">
        <div className="bg-foreground text-background text-xs px-3 py-1 rounded whitespace-nowrap">
          Vista previa del reporte - Listo para generar
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground" />
        </div>
      </div>
    </div>
  );
};

export default FloatingActionToolbar;