import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';

const PdfReportPreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // 1) Intenta tomar del navigate (state) y si no, del localStorage
  const reportData = useMemo(() => {
    if (location.state?.reportData) return location.state.reportData;
    try {
      const raw = localStorage.getItem('astap-report-for-pdf'); // fallback que guardamos antes
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [location.state]);

  // 2) Estado para habilitar el botón cuando tengamos datos
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Consideramos “lista” la vista cuando tenemos datos mínimos
    if (reportData?.generalInfo?.client && reportData?.generalInfo?.serviceDate) {
      setReady(true);
    } else {
      setReady(false);
    }
  }, [reportData]);

  const handleDownloadPdf = async () => {
    if (!ready || !reportData) return;
    // Aquí puedes implementar html2canvas + jsPDF.
    // Por ahora, solo simulamos la descarga:
    try {
      // Simular render/generación
      await new Promise((r) => setTimeout(r, 500));
      alert('PDF generado (simulación). Integra html2canvas + jsPDF aquí.');
    } catch (e) {
      console.error(e);
      alert('No se pudo generar el PDF.');
    }
  };

  const missing = !reportData;

  return (
    <div className="min-h-screen bg-background">
      {/* Cabecera simple */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-lg">
            <Icon name="Eye" size={24} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Vista previa del informe</h1>
            <p className="text-muted-foreground">
              Revisar el documento antes de generar el PDF
            </p>
          </div>
        </div>

        {/* Tarjeta de “metadatos” a la derecha y preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Preview izquierda (2/3) */}
          <div className="lg:col-span-2">
            <div ref={containerRef} className="border border-border rounded-lg p-4 bg-card">
              <div className="text-sm text-muted-foreground mb-2">
                Página 1 de 3 (demo)
              </div>

              {/* Contenido simple para que veas Cliente y Fecha */}
              <div className="rounded-md border border-border p-4">
                <h2 className="font-semibold text-foreground mb-2">Vista previa del reporte</h2>
                <p>Cliente: <span className="font-medium">{reportData?.generalInfo?.client || '---'}</span></p>
                <p>Fecha: <span className="font-medium">{reportData?.generalInfo?.serviceDate || '---'}</span></p>
              </div>
            </div>
          </div>

          {/* Sidebar derecha (1/3) */}
          <aside className="space-y-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Información</h3>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><b>Cliente:</b> {reportData?.generalInfo?.client || '---'}</li>
                <li><b>Tipo de informe:</b> Mantenimiento preventivo</li>
                <li><b>Estado:</b> Pendiente de firma</li>
                <li><b>Estimado:</b> 2.4 MB</li>
                <li><b>Páginas:</b> 3</li>
              </ul>
            </div>
          </aside>
        </div>

        {/* Barra inferior de acciones */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-4 py-2 rounded-md border border-input text-sm"
          >
            Volver
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={!ready || missing}
            className={`inline-flex items-center px-4 py-2 rounded-md text-sm ${
              !ready || missing
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-secondary text-secondary-foreground hover:opacity-90'
            }`}
            title={
              !ready || missing
                ? 'Completa Cliente y Fecha en el informe, y vuelve a generar la vista previa.'
                : 'Descargar PDF'
            }
          >
            <Icon name="Download" size={16} className="mr-2" />
            Descargar PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default PdfReportPreview;
