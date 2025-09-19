import jsPDF from "jspdf";
import "jspdf-autotable";

// Generador de PDF para informes ASTAP
export const generateReportPdf = (report) => {
  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = 210;

  // 🔹 Encabezado
  pdf.setFontSize(18);
  pdf.text("ASTAP - Reporte de Servicio", pageWidth / 2, 15, { align: "center" });
  pdf.setFontSize(10);
  pdf.text(`Fecha: ${report?.generalInfo?.serviceDate || "---"}`, 14, 25);
  pdf.text(`Cliente: ${report?.generalInfo?.client || "---"}`, 14, 30);
  pdf.text(`Código Interno: ${report?.generalInfo?.internalCode || "---"}`, 14, 35);

  // 🔹 Información General
  pdf.setFontSize(14);
  pdf.text("Información General", 14, 50);
  pdf.setFontSize(10);
  pdf.text(`Dirección: ${report?.generalInfo?.address || "---"}`, 14, 57);
  pdf.text(`Referencia: ${report?.generalInfo?.reference || "---"}`, 14, 62);
  pdf.text(`Técnico: ${report?.generalInfo?.technicalPersonnel || "---"}`, 14, 67);

  // 🔹 Pruebas antes del servicio
  if (report?.beforeTesting?.length > 0) {
    pdf.setFontSize(14);
    pdf.text("Pruebas Antes del Servicio", 14, 80);
    pdf.autoTable({
      startY: 85,
      head: [["Parámetro", "Valor"]],
      body: report.beforeTesting.map((row) => [row.parameter, row.value]),
    });
  }

  // 🔹 Actividades e incidentes
  pdf.setFontSize(14);
  pdf.text("Actividades e Incidentes", 14, pdf.lastAutoTable?.finalY + 15 || 100);
  pdf.setFontSize(10);
  pdf.text(
    `Actividades: ${report?.activitiesIncidents?.activitiesDescription || "---"}`,
    14,
    pdf.lastAutoTable?.finalY + 22 || 107
  );
  pdf.text(
    `Incidentes: ${report?.activitiesIncidents?.incidentsDescription || "---"}`,
    14,
    pdf.lastAutoTable?.finalY + 29 || 114
  );

  // 🔹 Firmas
  pdf.setFontSize(14);
  pdf.text("Firmas", 14, pdf.lastAutoTable?.finalY + 50 || 150);

  if (report?.digitalSignatures?.astap) {
    pdf.text("Técnico ASTAP:", 14, pdf.lastAutoTable?.finalY + 60 || 160);
    pdf.addImage(report.digitalSignatures.astap, "PNG", 14, pdf.lastAutoTable?.finalY + 65 || 165, 40, 20);
  }

  if (report?.digitalSignatures?.client) {
    pdf.text("Cliente:", 120, pdf.lastAutoTable?.finalY + 60 || 160);
    pdf.addImage(report.digitalSignatures.client, "PNG", 120, pdf.lastAutoTable?.finalY + 65 || 165, 40, 20);
  }

  // 🔹 Guardar archivo
  pdf.save(`ASTAP_Reporte_${report?.generalInfo?.internalCode || "sin-codigo"}.pdf`);
};
