import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ReportSummaryCard from './components/ReportSummaryCard';
import SearchAndActions from './components/SearchAndActions';
import ReportTable from './components/ReportTable';
import PaginationControls from './components/PaginationControls';
import ConfirmationModal from './components/ConfirmationModal';

const ReportHistoryManagement = () => {
  const navigate = useNavigate();
  
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReports, setSelectedReports] = useState([]);
  const [sortField, setSortField] = useState('serviceDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showClearModal, setShowClearModal] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  
  const itemsPerPage = 10;

  // Mock data for reports
  const mockReports = [
    {
      id: 1,
      filename: "ASTAP_Reporte_001_07012025.pdf",
      fileSize: "2.4 MB",
      clientName: "Empresa Constructora López S.A.",
      serviceDate: "2025-01-07",
      technician: "Carlos Rodríguez",
      status: "Completado",
      createdAt: "2025-01-07T10:30:00Z"
    },
    {
      id: 2,
      filename: "ASTAP_Reporte_002_06012025.pdf",
      fileSize: "1.8 MB",
      clientName: "Industrias Metalúrgicas del Norte",
      serviceDate: "2025-01-06",
      technician: "María González",
      status: "Enviado",
      createdAt: "2025-01-06T14:15:00Z"
    },
    {
      id: 3,
      filename: "ASTAP_Reporte_003_05012025.pdf",
      fileSize: "3.1 MB",
      clientName: "Transportes Hernández Ltda.",
      serviceDate: "2025-01-05",
      technician: "José Martínez",
      status: "Completado",
      createdAt: "2025-01-05T09:45:00Z"
    },
    {
      id: 4,
      filename: "ASTAP_Reporte_004_04012025.pdf",
      fileSize: "2.7 MB",
      clientName: "Servicios Industriales García",
      serviceDate: "2025-01-04",
      technician: "Ana Pérez",
      status: "Pendiente",
      createdAt: "2025-01-04T16:20:00Z"
    },
    {
      id: 5,
      filename: "ASTAP_Reporte_005_03012025.pdf",
      fileSize: "2.2 MB",
      clientName: "Manufacturas del Pacífico S.A.",
      serviceDate: "2025-01-03",
      technician: "Luis Fernández",
      status: "Completado",
      createdAt: "2025-01-03T11:30:00Z"
    },
    {
      id: 6,
      filename: "ASTAP_Reporte_006_02012025.pdf",
      fileSize: "1.9 MB",
      clientName: "Distribuidora Central",
      serviceDate: "2025-01-02",
      technician: "Carmen Silva",
      status: "Enviado",
      createdAt: "2025-01-02T13:45:00Z"
    },
    {
      id: 7,
      filename: "ASTAP_Reporte_007_01012025.pdf",
      fileSize: "2.8 MB",
      clientName: "Tecnología Avanzada S.L.",
      serviceDate: "2025-01-01",
      technician: "Roberto Díaz",
      status: "Completado",
      createdAt: "2025-01-01T08:15:00Z"
    },
    {
      id: 8,
      filename: "ASTAP_Reporte_008_31122024.pdf",
      fileSize: "2.5 MB",
      clientName: "Grupo Industrial Morales",
      serviceDate: "2024-12-31",
      technician: "Patricia Ruiz",
      status: "Completado",
      createdAt: "2024-12-31T15:30:00Z"
    },
    {
      id: 9,
      filename: "ASTAP_Reporte_009_30122024.pdf",
      fileSize: "3.3 MB",
      clientName: "Logística Integral del Sur",
      serviceDate: "2024-12-30",
      technician: "Miguel Torres",
      status: "Enviado",
      createdAt: "2024-12-30T12:00:00Z"
    },
    {
      id: 10,
      filename: "ASTAP_Reporte_010_29122024.pdf",
      fileSize: "2.1 MB",
      clientName: "Servicios Técnicos Especializados",
      serviceDate: "2024-12-29",
      technician: "Elena Vargas",
      status: "Completado",
      createdAt: "2024-12-29T10:45:00Z"
    },
    {
      id: 11,
      filename: "ASTAP_Reporte_011_28122024.pdf",
      fileSize: "2.6 MB",
      clientName: "Industrias Químicas del Este",
      serviceDate: "2024-12-28",
      technician: "Francisco Jiménez",
      status: "Pendiente",
      createdAt: "2024-12-28T14:20:00Z"
    },
    {
      id: 12,
      filename: "ASTAP_Reporte_012_27122024.pdf",
      fileSize: "1.7 MB",
      clientName: "Construcciones Modernas S.A.",
      serviceDate: "2024-12-27",
      technician: "Isabel Moreno",
      status: "Completado",
      createdAt: "2024-12-27T09:30:00Z"
    }
  ];

  // Filter and sort reports
  const filteredAndSortedReports = useMemo(() => {
    let filtered = mockReports?.filter(report =>
      report?.filename?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      report?.clientName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      report?.technician?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    );

    // Sort reports
    filtered?.sort((a, b) => {
      let aValue = a?.[sortField];
      let bValue = b?.[sortField];

      // Handle date sorting
      if (sortField === 'serviceDate' || sortField === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [searchTerm, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedReports?.length / itemsPerPage);
  const paginatedReports = filteredAndSortedReports?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate recent activity (reports from this week)
  const recentActivity = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo?.setDate(oneWeekAgo?.getDate() - 7);
    
    return mockReports?.filter(report => 
      new Date(report.createdAt) >= oneWeekAgo
    )?.length;
  }, []);

  // Event handlers
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleSelectReport = (reportId, checked) => {
    if (checked) {
      setSelectedReports([...selectedReports, reportId]);
    } else {
      setSelectedReports(selectedReports?.filter(id => id !== reportId));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedReports(paginatedReports?.map(report => report?.id));
    } else {
      setSelectedReports([]);
    }
  };

  const handleSortChange = (field, direction) => {
    setSortField(field);
    setSortDirection(direction);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedReports([]);
  };

  const handleNewReport = () => {
    navigate('/service-report-creation');
  };

  const handleExportAll = () => {
    // Mock export functionality
    const exportData = filteredAndSortedReports?.map(report => ({
      filename: report?.filename,
      client: report?.clientName,
      serviceDate: report?.serviceDate,
      technician: report?.technician,
      status: report?.status
    }));

    const csvContent = [
      ['Archivo', 'Cliente', 'Fecha de Servicio', 'Técnico', 'Estado'],
      ...exportData?.map(row => [
        row?.filename,
        row?.client,
        row?.serviceDate,
        row?.technician,
        row?.status
      ])
    ]?.map(row => row?.join(','))?.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link?.setAttribute('href', url);
    link?.setAttribute('download', `ASTAP_Historial_Reportes_${new Date()?.toISOString()?.split('T')?.[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
  };

  const handleClearHistory = () => {
    setShowClearModal(true);
  };

  const confirmClearHistory = async () => {
    setIsClearing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, this would clear the localStorage or make an API call
    setSelectedReports([]);
    setShowClearModal(false);
    setIsClearing(false);
    
    // Show success message (in a real app, you might use a toast notification)
    alert('Historial limpiado exitosamente');
  };

  const handleDownload = (report) => {
    // Mock download functionality
    const link = document.createElement('a');
    link.href = '#'; // In a real app, this would be the actual PDF URL
    link.download = report?.filename;
    link?.click();
    
    // Show success message
    alert(`Descargando ${report?.filename}`);
  };

  const handleResendEmail = (report) => {
    // Mock email resend functionality
    const subject = encodeURIComponent(`Reporte de Servicio ASTAP - ${report?.clientName}`);
    const body = encodeURIComponent(`Estimado cliente,\n\nAdjunto encontrará el reporte de servicio correspondiente al trabajo realizado el ${new Date(report.serviceDate)?.toLocaleDateString('es-ES')}.\n\nSaludos cordiales,\nEquipo ASTAP`);
    
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-15">
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          {/* Page Header */}
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-foreground">
              Historial de Reportes
            </h1>
            <p className="text-muted-foreground">
              Gestiona y accede a todos los reportes de servicio generados
            </p>
          </div>

          {/* Summary Card */}
          <ReportSummaryCard 
            totalReports={mockReports?.length}
            recentActivity={recentActivity}
          />

          {/* Search and Actions */}
          <SearchAndActions
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onNewReport={handleNewReport}
            onExportAll={handleExportAll}
            onClearHistory={handleClearHistory}
            selectedCount={selectedReports?.length}
            totalCount={filteredAndSortedReports?.length}
          />

          {/* Reports Table */}
          <ReportTable
            reports={paginatedReports}
            selectedReports={selectedReports}
            onSelectReport={handleSelectReport}
            onSelectAll={handleSelectAll}
            onSortChange={handleSortChange}
            sortField={sortField}
            sortDirection={sortDirection}
            onDownload={handleDownload}
            onResendEmail={handleResendEmail}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredAndSortedReports?.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </main>
      {/* Clear History Confirmation Modal */}
      <ConfirmationModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={confirmClearHistory}
        title="Limpiar Historial"
        message="¿Estás seguro de que deseas eliminar todo el historial de reportes? Esta acción no se puede deshacer."
        confirmText="Limpiar Historial"
        cancelText="Cancelar"
        type="danger"
        isLoading={isClearing}
      />
    </div>
  );
};

export default ReportHistoryManagement;