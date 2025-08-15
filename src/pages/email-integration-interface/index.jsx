import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import WorkflowProgress from '../../components/ui/WorkflowProgress';
import ContextualActionBar from '../../components/ui/ContextualActionBar';
import ModalOverlay from '../../components/ui/ModalOverlay';
import EmailComposer from './components/EmailComposer';
import RecipientManager from './components/RecipientManager';
import EmailPreview from './components/EmailPreview';
import DeliveryStatus from './components/DeliveryStatus';
import ScheduleDelivery from './components/ScheduleDelivery';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const EmailIntegrationInterface = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get report data from navigation state or localStorage
  const reportData = location.state?.reportData || JSON.parse(localStorage.getItem('currentReport') || '{}');
  
  const [activeTab, setActiveTab] = useState('compose');
  const [recipients, setRecipients] = useState([
    {
      id: 1,
      email: 'supervisor@astap.com',
      name: 'Carlos Mendoza',
      role: 'supervisor',
      type: 'to',
      addedAt: new Date()?.toISOString()
    },
    {
      id: 2,
      email: 'cliente@empresa.com',
      name: 'Ana García',
      role: 'client',
      type: 'to',
      addedAt: new Date()?.toISOString()
    }
  ]);
  
  const [emailData, setEmailData] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: `Reporte de Servicio ASTAP - ${reportData?.internalCode || 'REP-001'} - ${new Date()?.toLocaleDateString('es-ES')}`,
    template: 'maintenance',
    message: ''
  });
  
  const [emailStatus, setEmailStatus] = useState('draft');
  const [isLoading, setIsLoading] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [deliveryAttempts, setDeliveryAttempts] = useState([]);

  // Mock report data if none provided
  const mockReportData = {
    internalCode: 'REP-2025-001',
    clientName: 'Empresa Industrial ABC',
    serviceDate: '2025-01-07',
    address: 'Av. Industrial 123, Ciudad de México',
    technicianName: 'Juan Carlos Pérez',
    equipmentType: 'Compresor Industrial',
    serviceType: 'Mantenimiento Preventivo',
    ...reportData
  };

  const tabs = [
    {
      id: 'compose',
      label: 'Composición',
      icon: 'Edit3',
      description: 'Redactar email'
    },
    {
      id: 'recipients',
      label: 'Destinatarios',
      icon: 'Users',
      description: 'Gestionar contactos'
    },
    {
      id: 'preview',
      label: 'Vista Previa',
      icon: 'Eye',
      description: 'Revisar email'
    },
    {
      id: 'status',
      label: 'Estado',
      icon: 'TrendingUp',
      description: 'Seguimiento'
    }
  ];

  useEffect(() => {
    // Update email recipients from recipients list
    const toRecipients = recipients?.filter(r => r?.type === 'to')?.map(r => r?.email)?.join(', ');
    const ccRecipients = recipients?.filter(r => r?.type === 'cc')?.map(r => r?.email)?.join(', ');
    const bccRecipients = recipients?.filter(r => r?.type === 'bcc')?.map(r => r?.email)?.join(', ');
    
    setEmailData(prev => ({
      ...prev,
      to: toRecipients,
      cc: ccRecipients,
      bcc: bccRecipients
    }));
  }, [recipients]);

  const handleSendEmail = async (emailContent) => {
    setIsLoading(true);
    setEmailStatus('sending');
    
    try {
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create mailto link for actual email client integration
      const mailtoLink = createMailtoLink(emailContent);
      window.location.href = mailtoLink;
      
      setEmailStatus('sent');
      setShowSuccessModal(true);
      
      // Mock delivery attempts
      const attempts = recipients?.map((recipient, index) => ({
        id: Date.now() + index,
        timestamp: new Date(Date.now() + index * 1000)?.toISOString(),
        status: Math.random() > 0.1 ? 'sent' : 'failed',
        recipient: recipient?.email,
        details: Math.random() > 0.1 ? 'Email enviado exitosamente' : 'Error: Dirección no válida'
      }));
      
      setDeliveryAttempts(attempts);
      setActiveTab('status');
      
    } catch (error) {
      setEmailStatus('failed');
      console.error('Error sending email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = (draftContent) => {
    // Save draft to localStorage
    const drafts = JSON.parse(localStorage.getItem('emailDrafts') || '[]');
    drafts?.push(draftContent);
    localStorage.setItem('emailDrafts', JSON.stringify(drafts));
    
    // Show success notification
    alert('Borrador guardado exitosamente');
  };

  const handleScheduleDelivery = (scheduleConfig) => {
    setShowScheduleModal(false);
    
    // Save scheduled email
    const scheduledEmails = JSON.parse(localStorage.getItem('scheduledEmails') || '[]');
    scheduledEmails?.push({
      ...scheduleConfig,
      emailData,
      recipients,
      reportData: mockReportData
    });
    localStorage.setItem('scheduledEmails', JSON.stringify(scheduledEmails));
    
    setEmailStatus('scheduled');
    alert('Email programado exitosamente');
  };

  const createMailtoLink = (emailContent) => {
    const subject = encodeURIComponent(emailContent?.subject);
    const body = encodeURIComponent(emailContent?.message);
    const to = encodeURIComponent(emailContent?.to);
    const cc = emailContent?.cc ? `&cc=${encodeURIComponent(emailContent?.cc)}` : '';
    const bcc = emailContent?.bcc ? `&bcc=${encodeURIComponent(emailContent?.bcc)}` : '';
    
    return `mailto:${to}?subject=${subject}&body=${body}${cc}${bcc}`;
  };

  const handleRetryDelivery = async () => {
    const failedRecipients = recipients?.filter(r => 
      deliveryAttempts?.some(a => a?.recipient === r?.email && a?.status === 'failed')
    );
    
    if (failedRecipients?.length > 0) {
      await handleSendEmail({ ...emailData, recipients: failedRecipients });
    }
  };

  const handleViewDetails = () => {
    // Navigate to detailed delivery report
    navigate('/report-history-management', { 
      state: { 
        filter: 'delivery-details',
        reportId: mockReportData?.internalCode 
      }
    });
  };

  const contextualActions = [
    {
      label: 'Volver al Reporte',
      variant: 'outline',
      icon: 'ArrowLeft',
      onClick: () => navigate('/service-report-creation')
    },
    {
      label: 'Programar Envío',
      variant: 'secondary',
      icon: 'Clock',
      onClick: () => setShowScheduleModal(true),
      disabled: !recipients?.length || isLoading
    },
    {
      label: 'Enviar Ahora',
      variant: 'default',
      icon: 'Send',
      onClick: () => handleSendEmail(emailData),
      disabled: !recipients?.length || isLoading,
      loading: isLoading,
      primary: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-lg">
                <Icon name="Mail" size={24} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Integración de Email
                </h1>
                <p className="text-muted-foreground">
                  Distribución automática de reportes de servicio
                </p>
              </div>
            </div>
            
            <WorkflowProgress currentStep={4} className="mb-6" />
          </div>

          {/* Report Summary */}
          <div className="bg-card rounded-lg border border-border p-6 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Icon name="FileText" size={20} className="text-primary" />
              <h3 className="text-lg font-semibold text-foreground">
                Reporte a Enviar
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Código:</span>
                <p className="font-medium text-foreground">{mockReportData?.internalCode}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Cliente:</span>
                <p className="font-medium text-foreground">{mockReportData?.clientName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Fecha:</span>
                <p className="font-medium text-foreground">{mockReportData?.serviceDate}</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-card rounded-lg border border-border mb-8">
            <div className="border-b border-border">
              <nav className="flex space-x-8 px-6">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-micro ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'compose' && (
                <EmailComposer
                  reportData={mockReportData}
                  onSendEmail={handleSendEmail}
                  onSaveDraft={handleSaveDraft}
                  onScheduleDelivery={() => setShowScheduleModal(true)}
                  isLoading={isLoading}
                />
              )}

              {activeTab === 'recipients' && (
                <RecipientManager
                  recipients={recipients}
                  onRecipientsChange={setRecipients}
                />
              )}

              {activeTab === 'preview' && (
                <EmailPreview
                  emailData={emailData}
                  reportData={mockReportData}
                  recipients={recipients}
                />
              )}

              {activeTab === 'status' && (
                <DeliveryStatus
                  emailStatus={emailStatus}
                  deliveryAttempts={deliveryAttempts}
                  onRetryDelivery={handleRetryDelivery}
                  onViewDetails={handleViewDetails}
                />
              )}
            </div>
          </div>
        </div>
      </main>
      {/* Contextual Action Bar */}
      <ContextualActionBar
        actions={contextualActions}
        position="sticky"
        isLoading={isLoading}
      />
      {/* Schedule Delivery Modal */}
      <ModalOverlay
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        title="Programar Entrega"
        size="lg"
      >
        <ScheduleDelivery
          onSchedule={handleScheduleDelivery}
          onCancel={() => setShowScheduleModal(false)}
          isLoading={isLoading}
        />
      </ModalOverlay>
      {/* Success Modal */}
      <ModalOverlay
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Email Enviado"
        size="default"
      >
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mx-auto">
            <Icon name="CheckCircle" size={32} className="text-success" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              ¡Email Enviado Exitosamente!
            </h3>
            <p className="text-muted-foreground">
              El reporte de servicio ha sido enviado a todos los destinatarios configurados.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => navigate('/report-history-management')}
              iconName="History"
              iconPosition="left"
              className="flex-1"
            >
              Ver Historial
            </Button>
            <Button
              variant="default"
              onClick={() => navigate('/service-report-creation')}
              iconName="Plus"
              iconPosition="left"
              className="flex-1"
            >
              Nuevo Reporte
            </Button>
          </div>
        </div>
      </ModalOverlay>
    </div>
  );
};

export default EmailIntegrationInterface;