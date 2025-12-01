import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

// 🔹 Generador de PDF para informes ASTAP (export nombrado)
export const generateReportPdf = (report) => {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = 210;

  // Encabezado
  pdf.setFontSize(18);
  pdf.text("ASTAP - Reporte de Servicio", pageWidth / 2, 15, { align: "center" });
  pdf.setFontSize(10);
  pdf.text(`Fecha: ${report?.generalInfo?.serviceDate || "---"}`, 14, 25);
  pdf.text(`Cliente: ${report?.generalInfo?.client || "---"}`, 14, 30);
  pdf.text(`Código Interno: ${report?.generalInfo?.internalCode || "---"}`, 14, 35);

  // Información General
  pdf.setFontSize(14);
  pdf.text("Información General", 14, 50);
  pdf.setFontSize(10);
  pdf.text(`Dirección: ${report?.generalInfo?.address || "---"}`, 14, 57);
  pdf.text(`Referencia: ${report?.generalInfo?.reference || "---"}`, 14, 62);
  pdf.text(`Técnico: ${report?.generalInfo?.technicalPersonnel || "---"}`, 14, 67);

  // Pruebas antes del servicio
  if (report?.beforeTesting?.length > 0) {
    pdf.setFontSize(14);
    pdf.text("Pruebas Antes del Servicio", 14, 80);
    pdf.autoTable({
      startY: 85,
      head: [["Parámetro", "Valor"]],
      body: report.beforeTesting.map((row) => [row.parameter, row.value]),
    });
  }

  // Actividades e incidentes
  const baseY = pdf.lastAutoTable?.finalY || 100;

  pdf.setFontSize(14);
  pdf.text("Actividades e Incidentes", 14, baseY + 15);
  pdf.setFontSize(10);
  pdf.text(
    `Actividades: ${report?.activitiesIncidents?.activitiesDescription || "---"}`,
    14,
    baseY + 22
  );
  pdf.text(
    `Incidentes: ${report?.activitiesIncidents?.incidentsDescription || "---"}`,
    14,
    baseY + 29
  );

  // Firmas
  pdf.setFontSize(14);
  pdf.text("Firmas", 14, baseY + 50);

  if (report?.digitalSignatures?.astap) {
    pdf.text("Técnico ASTAP:", 14, baseY + 60);
    pdf.addImage(
      report.digitalSignatures.astap,
      "PNG",
      14,
      baseY + 65,
      40,
      20
    );
  }

  if (report?.digitalSignatures?.client) {
    pdf.text("Cliente:", 120, baseY + 60);
    pdf.addImage(
      report.digitalSignatures.client,
      "PNG",
      120,
      baseY + 65,
      40,
      20
    );
  }

  // Guardar archivo
  pdf.save(`ASTAP_Reporte_${report?.generalInfo?.internalCode || "sin-codigo"}.pdf`);
};

// 🔹 Componente de página (export default), usado por Routes.jsx
const PDFReportPreview = ({ report }) => {
  const handleGenerate = () => {
    if (report) {
      generateReportPdf(report);
    } else {
      alert("No hay datos de reporte cargados.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6 space-y-4">
        <h1 className="text-xl font-semibold text-slate-800">
          Vista previa / generación de PDF
        </h1>
        <p className="text-sm text-slate-600">
          Desde aquí puedes generar el informe PDF basado en los datos del
          reporte actual.
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
