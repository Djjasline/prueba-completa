import React, { useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Helpers seguros para mostrar campos
const val = (v, def = "—") => (v && String(v).trim() ? v : def);

export default function PdfReportPreview() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const rootRef = useRef(null);

  // 1) Traer datos desde navigate(state) o desde el borrador actual
  const report = useMemo(() => {
    if (state?.reportData) return state.reportData;
    try {
      const raw = localStorage.getItem("astap-current-report");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [state]);

  if (!report) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-xl font-semibold mb-4">Vista previa del informe</h1>
        <p className="text-muted-foreground mb-6">
          No encontré datos del informe. Vuelve al formulario y genera la vista previa otra vez.
        </p>
        <button
          className="px-4 py-2 rounded bg-primary text-primary-foreground"
          onClick={() => navigate(-1)}
        >
          Volver
        </button>
      </div>
    );
  }

  const { generalInfo = {}, equipmentDetails = {}, materialsUsage = [], responsibleParties = {} } = report;
  const astap = responsibleParties.astap || {};
  const client = responsibleParties.client || {};

  // 2) Descargar PDF del contenedor completo
  const handleDownload = async () => {
    if (!rootRef.current) return;
    // Tomamos el nodo completo para que entren TODAS las secciones
    const canvas = await html2canvas(rootRef.current, {
      scale: 2, useCORS: true, backgroundColor: "#ffffff",
      windowWidth: rootRef.current.scrollWidth,
      windowHeight: rootRef.current.scrollHeight,
    });
    const imgData = canvas.toDataURL("image/png");

    // A4 en pt (jsPDF): 595.28 x 841.89
    const pdf = new jsPDF("p", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let y = 0;
    // Partimos la imagen si es más alta que una página
    while (y < imgHeight) {
      const canvasPage = document.createElement("canvas");
      canvasPage.width = canvas.width;
      const sliceHeight = Math.min(canvas.height, Math.floor((pageHeight * canvas.width) / pageWidth));
      canvasPage.height = sliceHeight;

      const ctx = canvasPage.getContext("2d");
      ctx.drawImage(
        canvas,
        0, (y * canvas.height) / imgHeight,                 // src y
        canvas.width, sliceHeight,                          // src w,h
        0, 0,
        canvas.width, sliceHeight
      );

      const imgPage = canvasPage.toDataURL("image/png");
      if (y > 0) pdf.addPage();
      const pageImgHeight = (sliceHeight * imgWidth) / canvas.width;
      pdf.addImage(imgPage, "PNG", 0, 0, imgWidth, pageImgHeight, undefined, "FAST");
      y += (pageImgHeight);
    }

    pdf.save(`ASTAP_Reporte_${val(generalInfo.internalCode, "sin-codigo")}.pdf`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Vista previa del informe</h1>
          <div className="flex gap-3">
            <button
              className="px-4 py-2 rounded border border-border text-foreground"
              onClick={() => navigate(-1)}
            >
              Volver
            </button>
            <button
              className="px-4 py-2 rounded bg-primary text-primary-foreground"
              onClick={handleDownload}
            >
              Descargar PDF
            </button>
          </div>
        </div>

        {/* TODO: si quieres poner “Página 1 de 3 (demo)” aquí puedes, pero ahora ya mostrará todo el contenido */}
        <div ref={rootRef} className="bg-white rounded-lg border border-border p-6 space-y-24">
          {/* === INFORMACIÓN GENERAL === */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Información general</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-muted-foreground">Cliente</p>
                <p className="font-medium">{val(generalInfo.client)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Código interno</p>
                <p className="font-medium">{val(generalInfo.internalCode)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Fecha de servicio</p>
                <p className="font-medium">{val(generalInfo.serviceDate)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Dirección</p>
                <p className="font-medium">{val(generalInfo.address)}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-muted-foreground">Referencia</p>
                <p className="font-medium">{val(generalInfo.reference)}</p>
              </div>
            </div>
          </section>

          {/* === EQUIPO INTERVENIDO === */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Equipo intervenido</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <p className="text-muted-foreground">Tipo</p>
                <p className="font-medium">{val(equipmentDetails.type)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Marca</p>
                <p className="font-medium">{val(equipmentDetails.brand)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Modelo</p>
                <p className="font-medium">{val(equipmentDetails.model)}</p>
              </div>

              <div>
                <p className="text-muted-foreground">N.º serie</p>
                <p className="font-medium">{val(equipmentDetails.serialNumber)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Año</p>
                <p className="font-medium">{val(equipmentDetails.year)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">VIN/Chasis</p>
                <p className="font-medium">{val(equipmentDetails.vinChassis)}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Placa</p>
                <p className="font-medium">{val(equipmentDetails.plateNumber)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Horas de trabajo</p>
                <p className="font-medium">{val(equipmentDetails.workHours)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Kilometraje</p>
                <p className="font-medium">{val(equipmentDetails.mileage)}</p>
              </div>
            </div>
          </section>

          {/* === MATERIALES === */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Materiales utilizados</h2>
            <div className="border border-border rounded">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left px-3 py-2">Cantidad</th>
                    <th className="text-left px-3 py-2">Material</th>
                    <th className="text-left px-3 py-2">Código</th>
                  </tr>
                </thead>
                <tbody>
                  {(materialsUsage || []).map((m, i) => (
                    <tr key={m.id || i} className="border-t border-border">
                      <td className="px-3 py-2">{val(m.quantity)}</td>
                      <td className="px-3 py-2">{val(m.materialName)}</td>
                      <td className="px-3 py-2">{val(m.materialCode)}</td>
                    </tr>
                  ))}
                  {!materialsUsage?.length && (
                    <tr className="border-t border-border">
                      <td className="px-3 py-2" colSpan={3}>—</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* === RESPONSABLES === */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Partes responsables</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
              <div>
                <h3 className="font-semibold mb-2">Técnico ASTAP</h3>
                <p>{val(astap.name)}</p>
                <p>{val(astap.position)}</p>
                <p>{val(astap.phone)}</p>
                <p>{val(astap.email)}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Representante del Cliente</h3>
                <p>{val(client.name)}</p>
                <p>{val(client.position)}</p>
                <p>{val(client.phone)}</p>
                <p>{val(client.email)}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
