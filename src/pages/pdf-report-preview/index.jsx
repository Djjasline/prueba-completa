import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Icon from '../../components/AppIcon';

const formatDate = (isoLike) => {
  if (!isoLike) return '---';
  try {
    // Espera formato YYYY-MM-DD
    const [y, m, d] = isoLike.split('-');
    return `${d}/${m}/${y}`;
  } catch {
    return isoLike;
  }
};

const PdfReportPreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  // 1) Intentamos leer lo que llega desde ServiceReportCreation
  const passedData = location?.state?.reportData;

  // 2) Si no vino por state, lo intentamos desde localStorage
  const fallbackData = useMemo(() => {
    try {
      const raw = localStorage.getItem('astap-current-report');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const reportData = passedData || fallbackData;

  // Ref del contenedor que convertiremos a imagen para PDF
  const previewRef = useRef(null);

  // Si no hay data, regresamos a crear informe
  useEffect(() => {
    if (!reportData) {
      // No hay datos, volver a “Crear informe”
      navigate('/service-report-creation', { replace: true });
    }
  }, [reportData, navigate]);

  // Datos que usamos en la UI
  const clientName = reportData?.generalInfo?.client || '---';
  const serviceDate = formatDate(reportData?.generalInfo?.serviceDate);

  // Paginación simple de demo
  const totalPages = 3;
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  const goPrev = () => setCurrentPage((p) => (p > 1 ? p - 1 : p));
  const goNext = () => setCurrentPage((p) => (p < totalPages ? p + 1 : p));

  // Descargar PDF (saca imagen del bloque #previewRef y la pega al PDF)
  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;
    const element = previewRef.current;

    // html2canvas al bloque de preview
    const canvas = await html2canvas(element, {
      scale: 2, // mejor calidad
      backgroundColor: '#ffffff',
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/png');

    // Tamaño A4 en pt -> 595 x 842 aprox
    const pdf = new jsPDF('p', 'pt', 'a4');

    // Calculamos tamaño proporcional de la imagen al ancho del PDF
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth - 80; // margen 40pt a cada lado
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 40, 40, imgWidth, imgHeight);

    // Nombre de archivo con fecha/hora
    const now = new Date();
    const fileName = `ASTAP_Reporte_${now.getFullYear()}${String(
      now.getMonth() + 1
    ).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(
      now.getHours()
    ).padStart(2, '0')}${String(now.getMinutes()).padStart(
      2,
      '0'
    )}${String(now.getSeconds()).padStart(2, '0')}.pdf`;

    pdf.save(fileName);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header simple */}
      <header className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center space-x-3">
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
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          {/* Lado izquierdo: visor con paginación */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </p>
              <div className="space-x-2">
                <button
                  onClick={goPrev}
                  className="px-4 py-2 rounded-md border border-input text-sm disabled:opacity-50"
                  disabled={!canPrev}
                >
                  Anterior
                </button>
                <button
                  onClick={goNext}
                  className="px-4 py-2 rounded-md border border-input text-sm disabled:opacity-50"
                  disabled={!canNext}
                >
                  Próximo
                </button>
              </div>
            </div>

            {/* BOX que se captura para el PDF */}
            <div
              ref={previewRef}
              className="rounded-lg border border-border bg-card p-6"
            >
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Vista previa del reporte
              </h3>

              {/* Aquí puedes variar el contenido por página */}
              {currentPage === 1 && (
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Cliente:</span>{' '}
                    {clientName}
                  </p>
                  <p>
                    <span className="font-medium">Fecha:</span>{' '}
                    {serviceDate}
                  </p>
                </div>
              )}

              {currentPage === 2 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Contenido de la página 2 (ejemplo). Inserta un resumen de
                    pruebas, materiales, etc.
                  </p>
                </div>
              )}

              {currentPage === 3 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Contenido de la página 3 (ejemplo). Inserta observaciones,
                    firmas o anexos.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Lado derecho: panel informativo */}
          <aside className="rounded-lg border border-border bg-card p-6 space-y-4">
            <h4 className="text-base font-semibold text-foreground">
              Información del Reporte
            </h4>

            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <Icon name="Calendar" size={16} className="text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Fecha de Creación</p>
                  <p className="font-medium text-foreground">
                    {new Date().toLocaleString('es-EC')}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Icon name="User" size={16} className="text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Técnico responsable</p>
                  <p className="font-medium text-foreground">
                    {reportData?.responsibleParties?.astap?.name || '---'} –{' '}
                    {reportData?.responsibleParties?.astap?.phone || '---'}
                  </p>
                  <p className="text-muted-foreground">
                    {reportData?.responsibleParties?.astap?.email || '---'}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Icon name="Building" size={16} className="text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Cliente</p>
                  <p className="font-medium text-foreground">{clientName}</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Icon name="FileText" size={16} className="text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Tipo de informe</p>
                  <p className="font-medium text-foreground">Mantenimiento preventivo</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Icon name="Clock" size={16} className="text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Estado</p>
                  <p className="font-medium text-foreground">Pendiente de firma</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Icon name="File" size={16} className="text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Páginas</p>
                  <p className="font-medium text-foreground">{totalPages} páginas</p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Barra inferior: acciones */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => navigate('/service-report-creation')}
            className="px-4 py-2 rounded-md border border-input text-sm"
          >
            Volver
          </button>

          <div className="space-x-2">
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm"
            >
              <span className="inline-flex items-center space-x-2">
                <Icon name="Download" size={16} />
                <span>Descargar PDF</span>
              </span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PdfReportPreview;
