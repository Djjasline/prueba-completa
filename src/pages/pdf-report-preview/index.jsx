import React, { useState, useEffect , useRef} from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import WorkflowProgress from '../../components/ui/WorkflowProgress';
import DocumentPreviewPanel from './components/DocumentPreviewPanel';
import ReportMetadataPanel from './components/ReportMetadataPanel';
import FloatingActionToolbar from './components/FloatingActionToolbar';
import BreadcrumbNavigation from './components/BreadcrumbNavigation';
import PreviewLoadingState from './components/PreviewLoadingState';

const PDFReportPreview = () => {
  const contentRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentZoom, setCurrentZoom] = useState(100);
  const [reportData, setReportData] = useState(null);
  const location = useLocation();

  // Mock report data - in real app this would come from props or API
  const mockReportData = {
    internalCode: 'AST-2025-001',
    clientName: 'Empresa Industrial ABC S.A.',
    address: 'Av. Industrial 123, Zona Industrial Norte',
    reference: 'Mantenimiento preventivo equipos críticos',
    technician: 'Ing. Carlos Mendoza',
    serviceDate: new Date()?.toLocaleDateString('es-ES'),
    equipmentType: 'Compresor Industrial',
    brand: 'Atlas Copco',
    model: 'GA 75 VSD+',
    serialNumber: 'AIC123456789',
    year: '2022',
    workHours: '2,450',
    activities: [
      'Cambio de aceite lubricante y filtros',
      'Limpieza del sistema de refrigeración',
      'Calibración de sensores de presión y temperatura',
      'Inspección y ajuste de correas de transmisión'
    ],
    materials: [
      { quantity: '20 L', name: 'Aceite Sintético SAE 5W-30', code: 'OIL-SYN-5W30' },
      { quantity: '2 pcs', name: 'Filtro de Aceite', code: 'FLT-OIL-001' },
      { quantity: '1 pc', name: 'Filtro de Aire', code: 'FLT-AIR-002' }
    ],
    testResults: [
      { parameter: 'Presión de Trabajo', before: '7.2 bar', after: '8.5 bar', status: 'Mejorado' },
      { parameter: 'Temperatura de Aceite', before: '85°C', after: '72°C', status: 'Óptimo' },
      { parameter: 'Vibración', before: '4.2 mm/s', after: '2.1 mm/s', status: 'Excelente' }
    ]
  };

  useEffect(() => {
    // Simulate loading delay for preview generation
    const timer = setTimeout(() => {
      setReportData(mockReportData);
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleGeneratePDF = async () => {
    const node = contentRef.current;
    if (!node) return;
    const canvas = await html2canvas(node, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'pt', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const name = `ASTAP_${(reportData?.generalInfo?.client || 'Reporte').replace(/[^a-z0-9_\-]/gi,'_')}_${new Date().toISOString().slice(0,10)}.pdf`;
    pdf.save(name);
  };

  const handleSendEmail = async () => {
    // Simulate email preparation
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Preparing email with PDF attachment');
        resolve();
      }, 1000);
    });
  };

  const handleZoomChange = (newZoom) => {
    setCurrentZoom(newZoom);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-15">
        <div className="max-w-7xl mx-auto p-6">
          {/* Breadcrumb Navigation */}
          <BreadcrumbNavigation />

          {/* Workflow Progress */}
          <div className="mb-6">
            <WorkflowProgress currentStep={3} />
          </div>

          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Vista Previa del Reporte
                </h1>
                <p className="text-muted-foreground mt-1">
                  Revise el documento antes de generar el PDF final
                </p>
              </div>
              
              {!isLoading && (
                <div className="hidden lg:flex items-center space-x-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-success rounded-full" />
                    <span>Listo para generar</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex h-[calc(100vh-280px)] bg-card rounded-lg shadow-card overflow-hidden">
            {isLoading ? (
              <PreviewLoadingState />
            ) : (
              <>
                {/* Document Preview Panel */}
                <DocumentPreviewPanel ref={contentRef}
                  reportData={reportData}
                  currentZoom={currentZoom}
                  onZoomChange={handleZoomChange}
                />

                {/* Report Metadata Panel */}
                <ReportMetadataPanel reportData={reportData} />
              </>
            )}
          </div>
        </div>

        {/* Floating Action Toolbar */}
        {!isLoading && (
          <FloatingActionToolbar
            reportData={reportData}
            onGeneratePDF={handleGeneratePDF}
            onSendEmail={handleSendEmail}
          />
        )}
      </main>
    </div>
  );
};

export default PDFReportPreview;