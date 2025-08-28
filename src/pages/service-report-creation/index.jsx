import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import WorkflowProgress from '../../components/ui/WorkflowProgress';
import ContextualActionBar from '../../components/ui/ContextualActionBar';
import GeneralInformationSection from './components/GeneralInformationSection';
import DynamicTestingTable from './components/DynamicTestingTable';
import ActivitiesIncidentsSection from './components/ActivitiesIncidentsSection';
import MaterialsUsageSection from './components/MaterialsUsageSection';
import EquipmentDetailsSection from './components/EquipmentDetailsSection';
import ResponsiblePartiesSection from './components/ResponsiblePartiesSection';
import DigitalSignatureSection from './components/DigitalSignatureSection';
import Icon from '../../components/AppIcon';

const ServiceReportCreation = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState({
    generalInfo: false,
    beforeTesting: false,
    activitiesIncidents: false,
    afterTesting: false,
    materialsUsage: false,
    equipmentDetails: false,
    responsibleParties: false,
    digitalSignatures: false
  });

  const [formData, setFormData] = useState({
    generalInfo: {
      client: '',
      internalCode: '',
      serviceDate: new Date().toISOString().split('T')[0],
      address: '',
      reference: '',
      technicalPersonnel: ''
    },
    beforeTesting: [],
    activitiesIncidents: {
      activitiesDescription: '',
      activitiesEvidenceUrl: '',
      activitiesEvidenceImages: [],
      incidentsDescription: '',
      incidentsEvidenceUrl: '',
      incidentsEvidenceImages: []
    },
    afterTesting: [],
    materialsUsage: [],
    equipmentDetails: {
      type: '',
      brand: '',
      model: '',
      serialNumber: '',
      year: '',
      vinChassis: '',
      plateNumber: '',
      workHours: '',
      mileage: '',
      panoramicImage: ''
    },
    responsibleParties: {
      astap: {
        name: '',
        position: '',
        phone: '',
        email: ''
      },
      client: {
        name: '',
        position: '',
        phone: '',
        email: ''
      }
    },
    digitalSignatures: {
      astap: null,
      client: null
    }
  });

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('astap-current-report');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
      } catch (error) {
        console.error('Error loading saved report data:', error);
      }
    }
  }, []);

  // Auto-save to localStorage whenever formData changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('astap-current-report', JSON.stringify(formData));
    }, 1000); // Debounce for 1 second

    return () => clearTimeout(timeoutId);
  }, [formData]);

  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const toggleSection = (sectionKey) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const validateForm = () => {
    const errors = [];
    
    // Validate general information
    if (!formData.generalInfo.client.trim()) errors.push('Cliente es requerido');
    if (!formData.generalInfo.internalCode.trim()) errors.push('Código interno es requerido');
    if (!formData.generalInfo.serviceDate) errors.push('Fecha de servicio es requerida');
    if (!formData.generalInfo.address.trim()) errors.push('Dirección es requerida');
    if (!formData.generalInfo.technicalPersonnel.trim()) errors.push('Personal técnico es requerido');
    
    // Validate equipment details
    if (!formData.equipmentDetails.type.trim()) errors.push('Tipo de equipo es requerido');
    if (!formData.equipmentDetails.brand.trim()) errors.push('Marca del equipo es requerida');
    if (!formData.equipmentDetails.model.trim()) errors.push('Modelo del equipo es requerido');
    if (!formData.equipmentDetails.serialNumber.trim()) errors.push('Número de serie es requerido');
    
    // Validate responsible parties
    if (!formData.responsibleParties.astap.name.trim()) errors.push('Nombre del técnico ASTAP es requerido');
    if (!formData.responsibleParties.astap.position.trim()) errors.push('Cargo del técnico ASTAP es requerido');
    if (!formData.responsibleParties.astap.phone.trim()) errors.push('Teléfono del técnico ASTAP es requerido');
    if (!formData.responsibleParties.client.name.trim()) errors.push('Nombre del representante del cliente es requerido');
    if (!formData.responsibleParties.client.position.trim()) errors.push('Cargo del representante del cliente es requerido');
    if (!formData.responsibleParties.client.phone.trim()) errors.push('Teléfono del representante del cliente es requerido');
    
    return errors;
  };

  const handleSaveDraft = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save to localStorage with timestamp
      const draftData = {
        ...formData,
        savedAt: new Date().toISOString(),
        status: 'draft'
      };
      
      localStorage.setItem(`astap-draft-${Date.now()}`, JSON.stringify(draftData));
      
      // Show success message (in a real app, you'd use a toast notification)
      alert('Borrador guardado exitosamente');
      
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Error al guardar el borrador');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePDF = async () => {
    const validationErrors = validateForm();
    
    if (validationErrors.length > 0) {
      alert(`Por favor complete los siguientes campos:\n\n${validationErrors.join('\n')}`);
      return;
    }
    
    if (!formData.digitalSignatures.astap || !formData.digitalSignatures.client) {
      alert('Se requieren ambas firmas digitales para generar el PDF');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would use html2canvas and jsPDF here
      // For now, we'll navigate to the PDF preview page 
      navigate('/pdf-report-preview', { 
        state: { reportData: formData } 
      });
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error al generar el PDF');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendReport = async () => {
    const validationErrors = validateForm();
    
    if (validationErrors.length > 0) {
      alert(`Por favor complete los siguientes campos:\n\n${validationErrors.join('\n')}`);
      return;
    }
    
    if (!formData.digitalSignatures.astap || !formData.digitalSignatures.client) {
      alert('Se requieren ambas firmas digitales para enviar el reporte');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to email integration interface
      navigate('/email-integration-interface', { 
        state: { reportData: formData } 
      });
      
    } catch (error) {
      console.error('Error sending report:', error);
      alert('Error al enviar el reporte');
    } finally {
      setIsLoading(false);
    }
  };

  const contextualActions = [
    {
      label: 'Guardar Borrador',
      variant: 'outline',
      icon: 'Save',
      onClick: handleSaveDraft,
      loading: isLoading
    },
    {
      label: 'Generar PDF',
      variant: 'secondary',
      icon: 'FileText',
      onClick: handleGeneratePDF,
      loading: isLoading
    },
    {
      label: 'Enviar Reporte',
      variant: 'default',
      icon: 'Send',
      onClick: handleSendReport,
      loading: isLoading,
      primary: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-15">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-lg">
                <Icon name="FileText" size={24} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Crear Reporte de Servicio
                </h1>
                <p className="text-muted-foreground">
                  Complete la información del servicio técnico realizado
                </p>
              </div>
            </div>
            
            {/* Workflow Progress */}
            <WorkflowProgress currentStep={1} className="mb-6" />
          </div>

          {/* Form Sections */}
          <div className="space-y-6 mb-24">
            <GeneralInformationSection
              formData={formData}
              updateFormData={updateFormData}
              isCollapsed={collapsedSections.generalInfo}
              onToggleCollapse={() => toggleSection('generalInfo')}
            />
            
            <DynamicTestingTable
              title="Pruebas Antes del Servicio"
              description="Parámetros medidos antes de iniciar el servicio"
              icon="TestTube"
              data={formData.beforeTesting}
              onUpdateData={(data) => updateFormData('beforeTesting', data)}
              isCollapsed={collapsedSections.beforeTesting}
              onToggleCollapse={() => toggleSection('beforeTesting')}
            />
            
            <ActivitiesIncidentsSection
              formData={formData}
              updateFormData={updateFormData}
              isCollapsed={collapsedSections.activitiesIncidents}
              onToggleCollapse={() => toggleSection('activitiesIncidents')}
            />
            
            <DynamicTestingTable
              title="Pruebas Después del Servicio"
              description="Parámetros medidos después de completar el servicio"
              icon="CheckCircle"
              data={formData.afterTesting}
              onUpdateData={(data) => updateFormData('afterTesting', data)}
              isCollapsed={collapsedSections.afterTesting}
              onToggleCollapse={() => toggleSection('afterTesting')}
            />
            
            <MaterialsUsageSection
              formData={formData}
              updateFormData={updateFormData}
              isCollapsed={collapsedSections.materialsUsage}
              onToggleCollapse={() => toggleSection('materialsUsage')}
            />
            
            <EquipmentDetailsSection
              formData={formData}
              updateFormData={updateFormData}
              isCollapsed={collapsedSections.equipmentDetails}
              onToggleCollapse={() => toggleSection('equipmentDetails')}
            />
            
            <ResponsiblePartiesSection
              formData={formData}
              updateFormData={updateFormData}
              isCollapsed={collapsedSections.responsibleParties}
              onToggleCollapse={() => toggleSection('responsibleParties')}
            />
            
            <DigitalSignatureSection
              formData={formData}
              updateFormData={updateFormData}
              isCollapsed={collapsedSections.digitalSignatures}
              onToggleCollapse={() => toggleSection('digitalSignatures')}
            />
          </div>
        </div>
      </main>

      {/* Contextual Action Bar */}
      <ContextualActionBar
        actions={contextualActions}
        position="sticky"
        isLoading={isLoading}
      />
    </div>
  );
};

export default ServiceReportCreation
