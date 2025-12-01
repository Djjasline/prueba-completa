import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

// 🔹 Generador de PDF para informes ASTAP (export nombrado)
export const generateReportPdf = (report) => {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = 210;

  // Usamos un objeto seguro por si report viene vacío o undefined
  const safeReport = report || {};
  const general = safeReport.generalInfo || {};
  const beforeTesting = safeReport.beforeTesting || [];
  const activities = safeReport.activitiesIncidents || {};
  const signatures = safeReport.digitalSignatures || {};

  // Encabezado
  pdf.setFontSize(18);
  pdf.text("ASTAP - Reporte de Servicio", pageWidth / 2, 15, { align: "center" });
  pdf.setFontSize(10);
  pdf.text(`Fecha: ${general.serviceDate || "---"}`, 14, 25);
  pdf.text(`Cliente: ${general.client || "---"}`, 14, 30);
  pdf.text(`Código Interno: ${general.internalCode || "---"}`, 14, 35);

  // Información General
  pdf.setFontSize(14);
  pdf.text("Información General", 14, 50);
  pdf.setFontSize(10);
  pdf.text(`Dirección: ${general.address || "---"}`, 14, 57);
  pdf.text(`Referencia: ${general.reference || "---"}`, 14, 62);
  pdf.text(`Técnico: ${general.technicalPersonnel || "---"}`, 14, 67);

  // Pruebas antes del servicio
  let currentY = 80;
  if (beforeTesting.length > 0) {
    pdf.setFontSize(14);
    pdf.text("Pruebas Antes del Servicio", 14, currentY);
    pdf.autoTable({
      startY: currentY + 5,
      head: [["Parámetro", "Valor"]],
      body: beforeTesting.map((row) => [row.parameter, row.value]),
    });
    currentY = pdf.lastAutoTable.finalY + 10;
  } else {
    currentY = 100;
  }

  // Actividades e incidentes
  pdf.setFontSize(14);
  pdf.text("Actividades e Incidentes", 14, currentY);
  pdf.setFontSize(10);
  pdf.text(
    `Actividades: ${activities.activitiesDescription || "---"}`,
    14,
    currentY + 7
  );
  pdf.text(
    `Incidentes: ${activities.incidentsDescription || "---"}`,
    14,
    currentY + 14
  );

  // Firmas
  const signaturesBaseY = currentY + 35;
  pdf.setFontSize(14);
  pdf.text("Firmas", 14, signaturesBaseY);

  if (signatures.astap) {
    pdf.text("Técnico ASTAP:", 14, signaturesBaseY + 10);
    pdf.addImage(signatures.astap, "PNG", 14, signaturesBaseY + 15, 40, 20);
  }

  if (signatures.client) {
    pdf.text("Cliente:", 120, signaturesBaseY + 10);
    pdf.addImage(signatures.client, "PNG", 120, signaturesBaseY + 15, 40, 20);
  }

  // Guardar archivo
  pdf.save(`ASTAP_Reporte_${general.internalCode || "sin-codigo"}.pdf`);
};

// 🔹 Componente de página (export default), usado por Routes.jsx
const PDFReportPreview = () => {
  // 🔸 Por ahora no tenemos un "report" real conectado,
  // así que pasamos un objeto vacío para probar el PDF.
  // Más adelante aquí podrás inyectar el reporte desde Redux,
  // localStorage o el estado de React Router.
  const handleGenerate = () => {
    generateReportPdf({});
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6 space-y-4">
        <h1 className="text-xl font-semibold text-slate-800">
          Vista previa / generación de PDF
        </h1>
        <p className="text-sm text-slate-600">
          Desde aquí puedes generar el informe PDF. En esta versión usa datos de
          ejemplo o vacíos.
        </p>

        <button
          type="button"
          onClick={handleGenerate}
          className="inline-flex items-center px-4 py-2 rounded-md border border-slate-300 text-sm font-medium bg-slate-900 text-white hover:bg-slate-800"
        >
          Generar PDF
        </button>
      </div>
    </div>
  );
};

export default PDFReportPreview;
