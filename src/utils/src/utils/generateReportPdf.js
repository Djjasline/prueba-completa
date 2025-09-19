import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Generador de PDF completo
export const generateReportPdf = (reportData) => {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();

  // ========= ENCABEZADO CORPORATIVO =========
  const headerHeight = 25;
  const logoUrl = "/assets/encabezado.jpg"; // asegúrate de tenerlo en /public/assets
  pdf.addImage(logoUrl, "JPEG", 0, 0, pageWidth, headerHeight);

  pdf.setFontSize(12);
  pdf.setTextColor(40);
  pdf.text("ASTAP - Informe de Servicio", 14, headerHeight + 10);

  let y = headerHeight + 20;

  // ========= INFORMACIÓN GENERAL =========
  pdf.setFontSize(11);
  pdf.text("Información General", 14, y);
  y += 6;

  autoTable(pdf, {
    startY: y,
    head: [["Cliente", "Código Interno", "Fecha de Servicio", "Dirección", "Referencia", "Técnico"]],
    body: [[
      reportData?.generalInfo?.client || "---",
      reportData?.generalInfo?.internalCode || "---",
      reportData?.generalInfo?.serviceDate || "---",
      reportData?.generalInfo?.address || "---",
      reportData?.generalInfo?.reference || "---",
      reportData?.generalInfo?.technicalPersonnel || "---"
    ]],
    styles: { fontSize: 9 },
  });

  y = pdf.lastAutoTable.finalY + 10;

  // ========= EQUIPO INTERVENIDO =========
  pdf.text("Equipo Intervenido", 14, y);
  y += 6;

  autoTable(pdf, {
    startY: y,
    head: [["Tipo", "Marca", "Modelo", "Serie", "Año", "Horas de trabajo", "Kilometraje"]],
    body: [[
      reportData?.equipmentDetails?.type || "---",
      reportData?.equipmentDetails?.brand || "---",
      reportData?.equipmentDetails?.model || "---",
      reportData?.equipmentDetails?.serialNumber || "---",
      reportData?.equipmentDetails?.year || "---",
      reportData?.equipmentDetails?.workHours || "---",
      reportData?.equipmentDetails?.mileage || "---"
    ]],
    styles: { fontSize: 9 },
  });

  y = pdf.lastAutoTable.finalY + 10;

  // ========= PRUEBAS ANTES DEL SERVICIO =========
  if (reportData?.beforeTesting?.length) {
    pdf.text("Pruebas antes del servicio", 14, y);
    y += 6;

    autoTable(pdf, {
      startY: y,
      head: [["Parámetro", "Valor Esperado", "Valor Medido"]],
      body: reportData.beforeTesting.map((test) => [
        test.parameter || "---",
        test.expectedValue || "---",
        test.actualValue || "---",
      ]),
      styles: { fontSize: 9 },
    });

    y = pdf.lastAutoTable.finalY + 10;
  }

  // ========= ACTIVIDADES E INCIDENTES =========
  pdf.text("Actividades e Incidentes", 14, y);
  y += 6;

  autoTable(pdf, {
    startY: y,
    body: [
      ["Actividades", reportData?.activitiesIncidents?.activitiesDescription || "---"],
      ["Incidentes", reportData?.activitiesIncidents?.incidentsDescription || "---"],
    ],
    styles: { fontSize: 9 },
  });

  y = pdf.lastAutoTable.finalY + 10;

  // ========= PRUEBAS DESPUÉS DEL SERVICIO =========
  if (reportData?.afterTesting?.length) {
    pdf.text("Pruebas después del servicio", 14, y);
    y += 6;

    autoTable(pdf, {
      startY: y,
      head: [["Parámetro", "Valor Esperado", "Valor Medido"]],
      body: reportData.afterTesting.map((test) => [
        test.parameter || "---",
        test.expectedValue || "---",
        test.actualValue || "---",
      ]),
      styles: { fontSize: 9 },
    });

    y = pdf.lastAutoTable.finalY + 10;
  }

  // ========= MATERIALES UTILIZADOS =========
  if (reportData?.materialsUsage?.length) {
    pdf.text("Materiales utilizados", 14, y);
    y += 6;

    autoTable(pdf, {
      startY: y,
      head: [["Cantidad", "Material", "Código", "Precio Unitario", "Total"]],
      body: reportData.materialsUsage.map((m) => [
        m.quantity || "0",
        m.materialName || "---",
        m.materialCode || "---",
        m.unitPrice || "0.00",
        m.totalPrice || "0.00",
      ]),
      styles: { fontSize: 9 },
    });

    y = pdf.lastAutoTable.finalY + 10;
  }

  // ========= PARTES RESPONSABLES =========
  pdf.text("Partes Responsables", 14, y);
  y += 6;

  autoTable(pdf, {
    startY: y,
    head: [["Técnico ASTAP", "Representante del Cliente"]],
    body: [[
      `${reportData?.responsibleParties?.astap?.name || "---"}\n${reportData?.responsibleParties?.astap?.position || "---"}\n${reportData?.responsibleParties?.astap?.phone || "---"}\n${reportData?.responsibleParties?.astap?.email || "---"}`,
      `${reportData?.responsibleParties?.client?.name || "---"}\n${reportData?.responsibleParties?.client?.position || "---"}\n${reportData?.responsibleParties?.client?.phone || "---"}\n${reportData?.responsibleParties?.client?.email || "---"}`
    ]],
    styles: { fontSize: 9 },
  });

  y = pdf.lastAutoTable.finalY + 20;

  // ========= FIRMAS =========
  if (reportData?.digitalSignatures?.astap || reportData?.digitalSignatures?.client) {
    pdf.text("Firmas", 14, y);
    y += 6;

    if (reportData?.digitalSignatures?.astap) {
      pdf.addImage(reportData.digitalSignatures.astap, "PNG", 14, y, 40, 20);
      pdf.text("Firma Técnico ASTAP", 14, y + 25);
    }

    if (reportData?.digitalSignatures?.client) {
      pdf.addImage(reportData.digitalSignatures.client, "PNG", 120, y, 40, 20);
      pdf.text("Firma Cliente", 120, y + 25);
    }
  }

  // ========= DESCARGAR =========
  pdf.save(`ASTAP_Reporte_${reportData?.generalInfo?.internalCode || "sin-codigo"}.pdf`);
};
