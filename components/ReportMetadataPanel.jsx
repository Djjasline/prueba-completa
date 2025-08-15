import React from 'react';
import Icon from '../../../components/AppIcon';

const ReportMetadataPanel = ({ reportData }) => {
  const metadata = {
    createdAt: new Date()?.toLocaleString('es-ES'),
    technician: reportData?.technician || 'Ing. Carlos Mendoza',
    client: reportData?.clientName || 'Empresa Industrial ABC S.A.',
    reportType: 'Mantenimiento Preventivo',
    status: 'Pendiente de Firma',
    fileSize: '2.4 MB',
    pages: 3,
    lastModified: new Date(Date.now() - 300000)?.toLocaleString('es-ES')
  };

  const metadataItems = [
    {
      label: 'Fecha de Creación',
      value: metadata?.createdAt,
      icon: 'Calendar'
    },
    {
      label: 'Técnico Responsable',
      value: metadata?.technician,
      icon: 'User'
    },
    {
      label: 'Cliente',
      value: metadata?.client,
      icon: 'Building'
    },
    {
      label: 'Tipo de Reporte',
      value: metadata?.reportType,
      icon: 'FileText'
    },
    {
      label: 'Estado',
      value: metadata?.status,
      icon: 'Clock'
    },
    {
      label: 'Tamaño Estimado',
      value: metadata?.fileSize,
      icon: 'HardDrive'
    },
    {
      label: 'Páginas',
      value: `${metadata?.pages} páginas`,
      icon: 'File'
    },
    {
      label: 'Última Modificación',
      value: metadata?.lastModified,
      icon: 'Edit'
    }
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
        {metadataItems?.map((item, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-lg flex-shrink-0">
              <Icon name={item?.icon} size={16} className="text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                {item?.label}
              </p>
              <p className="text-sm text-muted-foreground break-words">
                {item?.value}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* Quality Checklist */}
      <div className="mt-8">
        <h4 className="text-base font-semibold text-foreground mb-4">
          Lista de Verificación
        </h4>
        <div className="space-y-3">
          {[
            { label: 'Información del cliente completa', checked: true },
            { label: 'Datos del equipo verificados', checked: true },
            { label: 'Pruebas documentadas', checked: true },
            { label: 'Materiales registrados', checked: true },
            { label: 'Firmas requeridas', checked: false },
            { label: 'Formato profesional', checked: true }
          ]?.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className={`flex items-center justify-center w-5 h-5 rounded border-2 ${
                item?.checked 
                  ? 'bg-success border-success text-success-foreground' 
                  : 'border-border'
              }`}>
                {item?.checked && <Icon name="Check" size={12} />}
              </div>
              <span className={`text-sm ${
                item?.checked ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {item?.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Document Statistics */}
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h4 className="text-sm font-semibold text-foreground mb-3">
          Estadísticas del Documento
        </h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">Secciones</p>
            <p className="font-medium text-foreground">8</p>
          </div>
          <div>
            <p className="text-muted-foreground">Tablas</p>
            <p className="font-medium text-foreground">3</p>
          </div>
          <div>
            <p className="text-muted-foreground">Imágenes</p>
            <p className="font-medium text-foreground">1</p>
          </div>
          <div>
            <p className="text-muted-foreground">Firmas</p>
            <p className="font-medium text-foreground">2</p>
          </div>
        </div>
      </div>
      {/* Export Options */}
      <div className="mt-8">
        <h4 className="text-sm font-semibold text-foreground mb-3">
          Opciones de Exportación
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-muted rounded">
            <span className="text-sm text-foreground">Calidad PDF</span>
            <span className="text-xs text-muted-foreground">Alta</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-muted rounded">
            <span className="text-sm text-foreground">Compresión</span>
            <span className="text-xs text-muted-foreground">Estándar</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-muted rounded">
            <span className="text-sm text-foreground">Marca de Agua</span>
            <span className="text-xs text-muted-foreground">ASTAP</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportMetadataPanel;