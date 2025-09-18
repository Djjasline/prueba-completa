// src/pages/pdf-report-preview/index.jsx
import React, { useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Header from "../../components/ui/Header";
import Icon from "../../components/AppIcon";

const PdfReportPreview = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  // 1) Intenta traer el formData desde la navegación
  const stateData = state?.reportData;

  // 2) Si no vino por state (ej: refresco del browser o acceso directo), intenta desde localStorage
  const storageData = (() => {
    try {
      const raw = localStorage.getItem("astap-current-report");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  })();

  const report = useMemo(() => stateData || storageData || null, [stateData, storageData]);

  const printableRef = useRef(null);

  const handleBack = () => navigate(-1);

  const handleDownloadPDF = async () => {
    if (!printableRef.current) return;

    // Renderizamos el nodo a imagen con html2canvas
    const canvas = await html2canvas(printableRef.current, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pageWidth - 20;             // márgenes
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    let y = 10;
    if (imgHeight < pageHeight - 20) {
      // Cabe en una página
      pdf.addImage(imgData, "PNG", 10, y, imgWidth, imgHeight);
    } else {
      // Paginación simple
      let position = 0;
      while (position < imgHeight) {
        pdf.addImage(imgData, "PNG", 10, 10 - position, imgWidth, imgHeight);
        position += pageHeight - 20;
        if (position < imgHeight) pdf.addPage();
      }
    }

    // Nombre del archivo
    const code = report?.generalInfo?.internalCode || "reporte";
    pdf.save(`ASTAP_Reporte_${code}.pdf`);
  };

  if (!report) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-5xl mx-auto px-6 py-10">
          <div className="p-6 rounded-lg border border-border bg-card">
            <p className="text-foreground">
              No se encontró información del reporte. Vuelve a la edición y genera nuevamente la vista previa.
            </p>
            <button
              onClick={handleBack}
              className="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground"
            >
              <Icon name="ArrowLeft" className="mr-2" /> Volver
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Datos principales
  const gi = report.generalInfo || {};
  const eq = report.equipmentDetails || {};
  const astap = report.responsibleParties?.astap || {};
  const clientResp = report.responsibleParties?.client || {};

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Barra superior */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Icon name="Eye" className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Vista previa del informe</h1>
              <p className="text-sm text-muted-foreground">
                Revisa el documento antes de descargarlo en PDF
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={handleBack} className="rounded-md border px-4 py-2">
              <Icon name="ArrowLeft" className="mr-2 inline" /> Volver
            </button>
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground"
            >
              <Icon name="Download" className="mr-2" /> Descargar PDF
            </button>
          </div>
        </div>

        {/* CONTENIDO IMPRIMIBLE */}
        <div
          ref={printableRef}
          className="space-y-6 rounded-lg border border-border bg-white p-6 text-[12.5px] leading-5"
          style={{ color: "#111827" }} // aseguro color de texto (tailwind foreground fallback)
        >
          {/* Encabezado */}
          <div className="rounded-lg border border-border bg-white p-4">
            <h2 className="text-base font-semibold">Información general</h2>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Cliente</div>
                <div className="font-medium">{gi.client || "---"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Código interno</div>
                <div className="font-medium">{gi.internalCode || "---"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Fecha de servicio</div>
                <div className="font-medium">{gi.serviceDate || "---"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Dirección</div>
                <div className="font-medium">{gi.address || "---"}</div>
              </div>
              <div className="col-span-2">
                <div className="text-sm text-muted-foreground">Referencia</div>
                <div className="font-medium">{gi.reference || "---"}</div>
              </div>
            </div>
          </div>

          {/* Equipo */}
          <div className="rounded-lg border border-border bg-white p-4">
            <h2 className="text-base font-semibold">Equipo intervenido</h2>
            <div className="mt-3 grid grid-cols-3 gap-4">
              <div><div className="text-sm text-muted-foreground">Tipo</div><div className="font-medium">{eq.type || "---"}</div></div>
              <div><div className="text-sm text-muted-foreground">Marca</div><div className="font-medium">{eq.brand || "---"}</div></div>
              <div><div className="text-sm text-muted-foreground">Modelo</div><div className="font-medium">{eq.model || "---"}</div></div>
              <div><div className="text-sm text-muted-foreground">N° serie</div><div className="font-medium">{eq.serialNumber || "---"}</div></div>
              <div><div className="text-sm text-muted-foreground">Año</div><div className="font-medium">{eq.year || "---"}</div></div>
              <div><div className="text-sm text-muted-foreground">VIN/Chasis</div><div className="font-medium">{eq.vinChassis || "---"}</div></div>
              <div><div className="text-sm text-muted-foreground">Placa</div><div className="font-medium">{eq.plateNumber || "---"}</div></div>
              <div><div className="text-sm text-muted-foreground">Horas de trabajo</div><div className="font-medium">{eq.workHours || "---"}</div></div>
              <div><div className="text-sm text-muted-foreground">Kilometraje</div><div className="font-medium">{eq.mileage || "---"}</div></div>
            </div>
          </div>

          {/* Materiales usados */}
          <div className="rounded-lg border border-border bg-white p-4">
            <h2 className="text-base font-semibold">Materiales utilizados</h2>
            {Array.isArray(report.materialsUsage) && report.materialsUsage.length > 0 ? (
              <table className="mt-3 w-full table-auto border-collapse text-[12px]">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-2 py-1 text-left">Cantidad</th>
                    <th className="border px-2 py-1 text-left">Material</th>
                    <th className="border px-2 py-1 text-left">Código</th>
                  </tr>
                </thead>
                <tbody>
                  {report.materialsUsage.map((m) => (
                    <tr key={m.id || Math.random()}>
                      <td className="border px-2 py-1">{m.quantity || ""}</td>
                      <td className="border px-2 py-1">{m.materialName || ""}</td>
                      <td className="border px-2 py-1">{m.materialCode || ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="mt-2 text-muted-foreground">Sin materiales registrados.</div>
            )}
          </div>

          {/* Responsables */}
          <div className="rounded-lg border border-border bg-white p-4">
            <h2 className="text-base font-semibold">Partes responsables</h2>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Técnico ASTAP</div>
                <div className="font-medium">{astap.name || "---"}</div>
                <div className="text-sm">{astap.position || ""}</div>
                <div className="text-sm">{astap.phone || ""}</div>
                <div className="text-sm">{astap.email || ""}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Representante del Cliente</div>
                <div className="font-medium">{clientResp.name || "---"}</div>
                <div className="text-sm">{clientResp.position || ""}</div>
                <div className="text-sm">{clientResp.phone || ""}</div>
                <div className="text-sm">{clientResp.email || ""}</div>
              </div>
            </div>
          </div>

          {/* Aquí podrías seguir con: pruebas antes/después, evidencias, firmas, etc. */}
        </div>
      </main>
    </div>
  );
};

export default PdfReportPreview;
