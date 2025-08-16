import React from 'react';
import Icon from '../../../components/AppIcon';

// Lista fija de técnicos con sus datos
const technicians = [
  { name: "AVILES SANTIAGO", phone: "0998511717", email: "smaviles@astap.com" },
  { name: "BRIONES ARIEL", phone: "0958897066", email: "abriones@astap.com" },
  { name: "CAMPUSANO DIEGO", phone: "0998739968", email: "serviciosgye@astap.com" },
  { name: "PILLAJO JOSE LUIS", phone: "0983346583", email: "jpillajo@astap.com" }
];

const ReportMetadataPanel = ({ reportData }) => {
  // Busca el técnico en la lista, si no existe toma el primero
  const technician = technicians.find(
    t => t.name === reportData?.technician
  ) || technicians[0];

  const metadata = {
    createdAt: new Date()?.toLocaleString('es-ES'),
    technician: `${technician.name} - ${technician.phone} - ${technician.email}`,
    client: reportData?.clientName || 'Cliente no especificado',
    reportType: reportData?.reportType || 'Mantenimiento Preventivo',
    status: reportData?.status || 'Pendiente de Firma',
    fileSize: reportData?.fileSize || '2.4 MB',
    pages: reportData?.pages || 3,
    lastModified: new Date()?.toLocaleString('es-ES')
  };

  const metadataItems = [
    { label: 'Fecha de Creación', value: metadata.createdAt, icon: 'Calendar' },
    { label: 'Técnico Responsable', value: metadata.technician, icon: 'User' },
    { label: 'Cliente', value: metadata.client, icon: 'Building' },
    { label: 'Tipo de Reporte', value: metadata.reportType, icon: 'FileText' },
    { label: 'Estado', value: metadata.status, icon: 'Clock' },
    { label: 'Tamaño Estimado', value: metadata.fileSize, icon: 'HardDrive' },
    { label: 'Páginas', value: `${metadata.pages} páginas`, icon: 'File' },
    { label: 'Última Modificación', value: metadata.lastModified, icon: 'Edit' }
  ];

  return (
    <div className="w-80 bg-card border-l border-border p-6 overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Información del Reporte
        </h3>
        <p className="text-sm text-muted-foreground">
          Detalles y metadatos del documento generado
        </p>
      </div>

      <div className="space-y-4">
        {metadataItems.map((item, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-lg flex-shrink-0">
              <Icon name={item.icon} size={16} className="text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{item.label}</p>
              <p className="text-sm text-muted-foreground break-words">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Aquí sigue tu checklist, estadísticas y exportación sin cambios */}
    </div>
  );
};

export default ReportMetadataPanel;
