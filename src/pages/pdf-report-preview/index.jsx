import React, { useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Helpers simples
const fmt = (v) => (v ? String(v) : '---');
const money = (n) => (isNaN(+n) ? '0.00' : (+n).toFixed(2));

export default function PdfReportPreview() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const rootRef = useRef(null);

  // Trae el reportData del state o del localStorage como respaldo
  const reportData = useMemo(() => {
    if (state?.reportData) return state.reportData;
    try {
      const raw = localStorage.getItem('astap-current-report');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [state]);

  // Si no hay data, vuelve al creador
  if (!reportData) {
    navigate('/service-report-creation');
    return null;
  }

  const { generalInfo, equipmentDetails, materialsUsage, responsibleParties, digitalSignatures } = reportData;

  // Total materiales
  const materialesTotal = (materialsUsage || []).reduce((acc, m) => {
    const q = parseFloat(m?.quantity || 0);
    const u = parseFloat(m?.unitPrice || 0);
    return acc + (q * u || 0);
  }, 0);

  // Genera el PDF a partir del contenedor
  const handleDownload = async () => {
    const el = rootRef.current;
    if (!el) return;

    // Un canvas por página (para este layout 3 páginas de ejemplo)
    // Si tu reporte crece, puedes dividir por secciones o aumentar el alto.
    const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    const pdf = new jsPDF('p', 'pt', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Ajusta ancho de la imagen al ancho de la página
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Si la imagen es más alta que la página, la partimos en múltiples páginas
    let remaining = imgHeight;
    let position = 0;

    while (remaining > 0) {
      pdf.addImage(imgData, 'JPEG', 0, position ? 0 : 0, imgWidth, imgHeight);
      remaining -= pageHeight;
      if (remaining > 0) {
        pdf.addPage();
        // Desplazamos “visualmente” recortando la imagen en la siguiente página
        position -= pageHeight;
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        remaining -= pageHeight; // ajusta el contador por la 2da inserción
      }
    }

    const fileName = `ASTAP_Reporte_${fmt(generalInfo?.internalCode)}.pdf`;
    pdf.save(fileName);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Vista previa del informe</h1>
            <p className="text-muted-foreground">Revisar el documento antes de generar el PDF</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(-1)}
              className="h-10 px-4 rounded-md border border-input bg-background text-sm"
            >
              Volver
            </button>
            <button
              onClick={handleDownload}
              className="h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm"
            >
              Descargar PDF
            </button>
          </div>
        </div>

        {/* CONTENIDO A IMPRIMIR */}
        <div ref={rootRef} className="bg-white rounded-lg border border-border p-6 space-y-16">
          {/* Portada / Resumen */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Resumen</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p><strong>Cliente:</strong> {fmt(generalInfo?.client)}</p>
                <p><strong>Código interno:</strong> {fmt(generalInfo?.internalCode)}</p>
                <p><strong>Fecha:</strong> {fmt(generalInfo?.serviceDate)}</p>
                <p><strong>Dirección:</strong> {fmt(generalInfo?.address)}</p>
                <p><strong>Referencia:</strong> {fmt(generalInfo?.reference)}</p>
              </div>
              <div className="space-y-1">
                <p><strong>Personal técnico:</strong> {fmt(generalInfo?.technicalPersonnel)}</p>
                <p><strong>Teléfono del técnico:</strong> {fmt(generalInfo?.technicalPhone)}</p>
                <p><strong>Correo del técnico:</strong> {fmt(generalInfo?.technicalEmail)}</p>
              </div>
            </div>
          </section>

          {/* Equipo */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Equipo atendido</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <p><strong>Tipo:</strong> {fmt(equipmentDetails?.type)}</p>
              <p><strong>Marca:</strong> {fmt(equipmentDetails?.brand)}</p>
              <p><strong>Modelo:</strong> {fmt(equipmentDetails?.model)}</p>
              <p><strong>N° Serie:</strong> {fmt(equipmentDetails?.serialNumber)}</p>
              <p><strong>Año:</strong> {fmt(equipmentDetails?.year)}</p>
              <p><strong>VIN/Chasis:</strong> {fmt(equipmentDetails?.vinChassis)}</p>
              <p><strong>Placa:</strong> {fmt(equipmentDetails?.plateNumber)}</p>
              <p><strong>Horas de trabajo:</strong> {fmt(equipmentDetails?.workHours)}</p>
              <p><strong>Kilometraje:</strong> {fmt(equipmentDetails?.mileage)}</p>
            </div>
          </section>

          {/* Materiales */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Materiales utilizados</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-lg">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-3 py-2 text-left border-b">Cant.</th>
                    <th className="px-3 py-2 text-left border-b">Material</th>
                    <th className="px-3 py-2 text-left border-b">Código</th>
                    <th className="px-3 py-2 text-left border-b">P. Unitario</th>
                    <th className="px-3 py-2 text-left border-b">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(materialsUsage || []).length === 0 && (
                    <tr>
                      <td className="px-3 py-2 border-b" colSpan={5}>— Sin registros —</td>
                    </tr>
                  )}
                  {(materialsUsage || []).map((m) => {
                    const q = parseFloat(m?.quantity || 0);
                    const u = parseFloat(m?.unitPrice || 0);
                    const t = q * u || 0;
                    return (
                      <tr key={m?.id}>
                        <td className="px-3 py-2 border-b">{fmt(m?.quantity)}</td>
                        <td className="px-3 py-2 border-b">{fmt(m?.materialName)}</td>
                        <td className="px-3 py-2 border-b">{fmt(m?.materialCode)}</td>
                        <td className="px-3 py-2 border-b">{money(u)}</td>
                        <td className="px-3 py-2 border-b">{money(t)}</td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td className="px-3 py-2 border-t font-semibold" colSpan={4}>Costo total de materiales</td>
                    <td className="px-3 py-2 border-t font-semibold">{money(materialesTotal)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Responsables */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Partes responsables</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-1">
                <h3 className="font-medium">Técnico ASTAP</h3>
                <p><strong>Nombre:</strong> {fmt(responsibleParties?.astap?.name)}</p>
                <p><strong>Cargo:</strong> {fmt(responsibleParties?.astap?.position)}</p>
                <p><strong>Teléfono:</strong> {fmt(responsibleParties?.astap?.phone)}</p>
                <p><strong>Correo:</strong> {fmt(responsibleParties?.astap?.email)}</p>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium">Representante del cliente</h3>
                <p><strong>Nombre:</strong> {fmt(responsibleParties?.client?.name)}</p>
                <p><strong>Cargo:</strong> {fmt(responsibleParties?.client?.position)}</p>
                <p><strong>Teléfono:</strong> {fmt(responsibleParties?.client?.phone)}</p>
                <p><strong>Correo:</strong> {fmt(responsibleParties?.client?.email)}</p>
              </div>
            </div>
          </section>

          {/* Firmas (si existieran imágenes base64) */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Firmas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-border rounded-lg p-4 h-40 flex items-center justify-center">
                {digitalSignatures?.astap ? (
                  <img src={digitalSignatures.astap} alt="Firma ASTAP" className="h-32 object-contain" />
                ) : (
                  <span className="text-sm text-muted-foreground">Sin firma ASTAP</span>
                )}
              </div>
              <div className="border border-border rounded-lg p-4 h-40 flex items-center justify-center">
                {digitalSignatures?.client ? (
                  <img src={digitalSignatures.client} alt="Firma Cliente" className="h-32 object-contain" />
                ) : (
                  <span className="text-sm text-muted-foreground">Sin firma Cliente</span>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
