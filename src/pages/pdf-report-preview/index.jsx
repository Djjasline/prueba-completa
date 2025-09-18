import React, { useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const PdfReportPreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  // Trae los datos desde la navegación o, si no, desde localStorage
  const reportData = useMemo(() => {
    if (location.state?.reportData) return location.state.reportData;
    try {
      const raw = localStorage.getItem("astap-current-report");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [location.state]);

  if (!reportData) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <p className="text-sm text-red-600 mb-4">
          No hay datos del informe para previsualizar.
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

  const { generalInfo, equipmentDetails, materialsUsage, responsibleParties, digitalSignatures } =
    reportData;

  const downloadPdf = async () => {
    const node = wrapperRef.current;
    if (!node) return;

    // Captura el contenedor completo (múltiple página si es alto)
    const canvas = await html2canvas(node, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let y = 0;
    // Si la imagen es más alta que una página, vamos “rebanando”
    if (imgHeight <= pageHeight) {
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    } else {
      let position = 0;
      let remaining = imgHeight;
      const canvasPage = document.createElement("canvas");
      const ctx = canvasPage.getContext("2d");

      const pageCanvasHeight = Math.floor((canvas.width * pageHeight) / pageWidth);
      canvasPage.width = canvas.width;
      canvasPage.height = pageCanvasHeight;

      while (remaining > 0) {
        ctx.clearRect(0, 0, canvasPage.width, canvasPage.height);
        ctx.drawImage(
          canvas,
          0,
          position,
          canvas.width,
          Math.min(pageCanvasHeight, canvas.height - position),
          0,
          0,
          canvasPage.width,
          Math.min(pageCanvasHeight, canvas.height - position)
        );
        const pageData = canvasPage.toDataURL("image/png");
        if (y !== 0) pdf.addPage();
        pdf.addImage(pageData, "PNG", 0, 0, pageWidth, pageHeight);
        position += pageCanvasHeight;
        remaining -= pageHeight;
        y += pageHeight;
      }
    }

    const code = generalInfo?.internalCode || "reporte";
    pdf.save(`ASTAP_Reporte_${code}.pdf`);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Vista previa del informe</h1>
          <div className="space-x-3">
            <button
              className="px-4 py-2 rounded border border-border text-foreground"
              onClick={() => navigate(-1)}
            >
              Volver
            </button>
            <button
              className="px-4 py-2 rounded bg-primary text-primary-foreground"
              onClick={downloadPdf}
            >
              Descargar PDF
            </button>
          </div>
        </div>

        {/* Contenedor completo que sí se exporta al PDF */}
        <div ref={wrapperRef} className="space-y-6">
          {/* Información general */}
          <section className="bg-card border border-border rounded-lg p-16">
            <h2 className="text-xl font-semibold mb-10">Información general</h2>
            <div className="grid grid-cols-2 gap-10 text-sm">
              <div>
                <p className="font-medium">Cliente</p>
                <p>{generalInfo?.client || "—"}</p>
              </div>
              <div>
                <p className="font-medium">Código interno</p>
                <p>{generalInfo?.internalCode || "—"}</p>
              </div>
              <div>
                <p className="font-medium">Fecha de servicio</p>
                <p>
                  {generalInfo?.serviceDate
                    ? new Date(generalInfo.serviceDate).toLocaleDateString("es-EC", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : "—"}
                </p>
              </div>
              <div>
                <p className="font-medium">Dirección</p>
                <p>{generalInfo?.address || "—"}</p>
              </div>
              <div className="col-span-2">
                <p className="font-medium">Referencia</p>
                <p>{generalInfo?.reference || "—"}</p>
              </div>
            </div>
          </section>

          {/* Equipo intervenido */}
          <section className="bg-card border border-border rounded-lg p-16">
            <h2 className="text-xl font-semibold mb-10">Equipo intervenido</h2>
            <div className="grid grid-cols-3 gap-10 text-sm">
              <div>
                <p className="font-medium">Tipo</p>
                <p>{equipmentDetails?.type || "—"}</p>
              </div>
              <div>
                <p className="font-medium">Marca</p>
                <p>{equipmentDetails?.brand || "—"}</p>
              </div>
              <div>
                <p className="font-medium">Modelo</p>
                <p>{equipmentDetails?.model || "—"}</p>
              </div>
              <div>
                <p className="font-medium">N.º serie</p>
                <p>{equipmentDetails?.serialNumber || "—"}</p>
              </div>
              <div>
                <p className="font-medium">Año</p>
                <p>{equipmentDetails?.year || "—"}</p>
              </div>
              <div>
                <p className="font-medium">VIN/Chasis</p>
                <p>{equipmentDetails?.vinChassis || "—"}</p>
              </div>
              <div>
                <p className="font-medium">Placa</p>
                <p>{equipmentDetails?.plateNumber || "—"}</p>
              </div>
              <div>
                <p className="font-medium">Horas de trabajo</p>
                <p>{equipmentDetails?.workHours || "—"}</p>
              </div>
              <div>
                <p className="font-medium">Kilometraje</p>
                <p>{equipmentDetails?.mileage || "—"}</p>
              </div>
            </div>
          </section>

          {/* Materiales */}
          <section className="bg-card border border-border rounded-lg p-16">
            <h2 className="text-xl font-semibold mb-6">Materiales utilizados</h2>
            <table className="w-full text-sm border border-border rounded">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left px-3 py-2 border-b">Cantidad</th>
                  <th className="text-left px-3 py-2 border-b">Material</th>
                  <th className="text-left px-3 py-2 border-b">Código</th>
                </tr>
              </thead>
              <tbody>
                {(materialsUsage || []).length === 0 ? (
                  <tr>
                    <td className="px-3 py-2 border-b" colSpan={3}>
                      — Sin registros —
                    </td>
                  </tr>
                ) : (
                  materialsUsage.map((m) => (
                    <tr key={m.id}>
                      <td className="px-3 py-2 border-b">{m.quantity || "—"}</td>
                      <td className="px-3 py-2 border-b">{m.materialName || "—"}</td>
                      <td className="px-3 py-2 border-b">{m.materialCode || "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>

          {/* Partes responsables */}
          <section className="bg-card border border-border rounded-lg p-16">
            <h2 className="text-xl font-semibold mb-6">Partes responsables</h2>
            <div className="grid grid-cols-2 gap-10 text-sm">
              <div>
                <p className="font-medium mb-2">Técnico ASTAP</p>
                <p>{responsibleParties?.astap?.name || "—"}</p>
                <p>{responsibleParties?.astap?.position || "—"}</p>
                <p>{responsibleParties?.astap?.phone || "—"}</p>
                <p>{responsibleParties?.astap?.email || "—"}</p>
                {digitalSignatures?.astap && (
                  <div className="mt-3">
                    <img
                      src={digitalSignatures.astap}
                      alt="Firma técnico ASTAP"
                      style={{ width: 180, height: "auto" }}
                    />
                  </div>
                )}
              </div>

              <div>
                <p className="font-medium mb-2">Representante del Cliente</p>
                <p>{responsibleParties?.client?.name || "—"}</p>
                <p>{responsibleParties?.client?.position || "—"}</p>
                <p>{responsibleParties?.client?.phone || "—"}</p>
                <p>{responsibleParties?.client?.email || "—"}</p>
                {digitalSignatures?.client && (
                  <div className="mt-3">
                    <img
                      src={digitalSignatures.client}
                      alt="Firma cliente"
                      style={{ width: 180, height: "auto" }}
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PdfReportPreview;
