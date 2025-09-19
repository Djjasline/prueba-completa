import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const PDFReportPreview = () => {
  const captureRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Recibimos los datos del reporte desde ServiceReportCreation
  const report = location.state?.reportData || {};

  const handleDownloadPdf = async () => {
    if (!captureRef.current) return;

    const canvas = await html2canvas(captureRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = 210;
    const pageHeight = 297;

    // 🔹 Encabezado corporativo
    const headerImg = new Image();
    headerImg.src = "/assets/encabezado.jpg"; // asegúrate de tenerlo en /public/assets
    pdf.addImage(headerImg, "JPEG", 0, 0, pageWidth, 30);

    // 🔹 Contenido del reporte debajo del encabezado
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 10, 40, imgWidth, imgHeight);

    pdf.save(`ASTAP_Reporte_${report?.generalInfo?.internalCode || "sin-codigo"}.pdf`);
  };

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <h1 className="text-2xl font-bold mb-4">Vista previa del informe</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Revisar el documento antes de generar el PDF final
      </p>

      {/* Contenedor de vista previa */}
      <div
        ref={captureRef}
        className="bg-white shadow-lg rounded-lg p-6 border border-border"
      >
        <h2 className="text-lg font-semibold mb-4">Información del reporte</h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <p><strong>Cliente:</strong> {report?.generalInfo?.client || "---"}</p>
          <p><strong>Código interno:</strong> {report?.generalInfo?.internalCode || "---"}</p>
          <p><strong>Fecha de servicio:</strong> {report?.generalInfo?.serviceDate || "---"}</p>
          <p><strong>Dirección:</strong> {report?.generalInfo?.address || "---"}</p>
          <p><strong>Referencia:</strong> {report?.generalInfo?.reference || "---"}</p>
          <p><strong>Técnico:</strong> {report?.generalInfo?.technicalPersonnel || "---"}</p>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded bg-muted text-foreground"
        >
          Volver
        </button>
        <button
          onClick={handleDownloadPdf}
          className="px-4 py-2 rounded bg-primary text-primary-foreground"
        >
          Descargar PDF
        </button>
      </div>
    </div>
  );
};

export default PDFReportPreview;
