import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const PDFReportPreview = ({ report }) => {
  const captureRef = useRef(null);

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
    headerImg.src = "/assets/encabezado.jpg"; // asegúrate de que esté en /public/assets/
    pdf.addImage(headerImg, "JPEG", 0, 0, pageWidth, 30);

    // 🔹 Contenido dinámico debajo del encabezado
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 10, 40, imgWidth, imgHeight);

    pdf.save(
      `ASTAP_Reporte_${report?.generalInfo?.internalCode || "sin-codigo"}.pdf`
    );
  };

  return (
    <div>
      <div ref={captureRef} className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold">Vista previa del reporte</h2>
        {/* aquí renderizas todos los datos del reporte */}
      </div>
      <button
        onClick={handleDownloadPdf}
        className="mt-4 px-4 py-2 bg-primary text-white rounded"
      >
        Descargar PDF
      </button>
    </div>
  );
};

// 🔹 Esto corrige tu error de importación en Routes.jsx
export default PDFReportPreview;
