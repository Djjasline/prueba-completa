// src/utils/generateReportPdf.js
import jsPDF from "jspdf";
import "jspdf-autotable";

// Generador de PDF para informes ASTAP
export const generateReportPdf = (report) => {
  if (!report) {
    alert("No hay datos del reporte para generar el PDF.");
    return;
  }

  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = 210;

  const general = report.generalInfo || {};
  const beforeTesting = report.beforeTesting || [];
  const afterTesting = report.afterTesting || [];
  const activitiesBlock = report.activitiesIncidents || {};
  const activities = activitiesBlock.activities || [];
  const incidentsDescription = activitiesBlock.incidentsDescription || "";
  const equipment = report.equipment || {};

  // =====================
  //  Título / Encabezado
  // =====================
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.text("ASTAP - Informe de Servicio", pageWidth / 2, 18, {
    align: "center",
  });

  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Código interno: ${general.internalCode || "—"}`, 14, 26);
  pdf.text(`Cliente: ${general.client || "—"}`, 14, 31);
  pdf.text(`Fecha de servicio: ${general.serviceDate || "—"}`, 14, 36);

  let currentY = 42;

  // =====================================================
  //  1. Información general del servicio (cliente/técnico)
  // =====================================================
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text("1. Información general del servicio", 14, currentY);
  currentY += 4;

  pdf.autoTable({
    startY: currentY,
    head: [["Campo", "Detalle"]],
    body: [
      ["Cliente (empresa)", general.client || "—"],
      ["Contacto cliente", general.clientContact || "—"],
      ["Cargo del cliente", general.clientRole || "—"],
      ["Correo del cliente", general.clientEmail || "—"],
      ["Dirección", general.address || "—"],
      ["Referencia", general.reference || "—"],
      ["Técnico responsable", general.technicalPersonnel || "—"],
      ["Teléfono del técnico", general.technicianPhone || "—"],
      ["Correo del técnico", general.technicianEmail || "—"],
    ],
    styles: { fontSize: 8 },
    headStyles: { fillColor: [240, 240, 240] },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 120 },
    },
  });

  currentY = pdf.lastAutoTable.finalY + 8;

  // ======================================
  //  2. Pruebas antes del servicio (tabla)
  // ======================================
  if (beforeTesting.length > 0) {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.text("2. Pruebas antes del servicio", 14, currentY);
    currentY += 4;

    const body = beforeTesting.map((row, idx) => [
      idx + 1,
      row.parameter || "—",
      row.value || "—",
    ]);

    pdf.autoTable({
      startY: currentY,
      head: [["#", "Parámetro", "Valor"]],
      body,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [240, 240, 240] },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 90 },
        2: { cellWidth: 60 },
      },
    });

    currentY = pdf.lastAutoTable.finalY + 8;
  }

  // ===========================
  //  3. Actividades e incidentes
  // ===========================
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text("3. Actividades e incidentes", 14, currentY);
  currentY += 4;

  if (activities.length > 0) {
    const body = activities.map((act, index) => [
      index + 1,
      act.title || "—",
      act.detail || "—",
    ]);

    pdf.autoTable({
      startY: currentY,
      head: [["Item", "Título de actividad", "Detalle de la actividad"]],
      body,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [240, 240, 240] },
      columnStyles: {
        0: { cellWidth: 12 },
        1: { cellWidth: 60 },
        2: { cellWidth: 88 },
      },
    });

    currentY = pdf.lastAutoTable.finalY + 4;
  }

  // Incidentes
  if (incidentsDescription && incidentsDescription.trim() !== "") {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.text("Incidentes:", 14, currentY);
    currentY += 4;

    pdf.setFont("helvetica", "normal");
    const incidentsLines = pdf.splitTextToSize(incidentsDescription, 180);
    pdf.text(incidentsLines, 14, currentY);
    currentY += incidentsLines.length * 4 + 4;
  } else {
    currentY += 2;
  }

  // =======================================
  //  4. Pruebas después del servicio (tabla)
  // =======================================
  if (afterTesting.length > 0) {
    if (currentY > 260) {
      pdf.addPage();
      currentY = 20;
    }

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.text("4. Pruebas después del servicio", 14, currentY);
    currentY += 4;

    const bodyAfter = afterTesting.map((row, idx) => [
      idx + 1,
      row.parameter || "—",
      row.value || "—",
    ]);

    pdf.autoTable({
      startY: currentY,
      head: [["#", "Parámetro", "Valor"]],
      body: bodyAfter,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [240, 240, 240] },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 90 },
        2: { cellWidth: 60 },
      },
    });

    currentY = pdf.lastAutoTable.finalY + 8;
  }

  // =====================
  //  5. Datos del equipo
  // =====================
  if (currentY > 260) {
    pdf.addPage();
    currentY = 20;
  }

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text("5. Datos del equipo", 14, currentY);
  currentY += 4;

  pdf.autoTable({
    startY: currentY,
    head: [["Campo", "Detalle"]],
    body: [
      ["Equipo / Unidad", equipment.unit || "—"],
      ["Marca", equipment.brand || "—"],
      ["Modelo", equipment.model || "—"],
      ["Serie", equipment.serial || "—"],
      ["Placa / Código interno", equipment.plate || "—"],
      ["Recorrido (km)", equipment.mileageKm || "—"],
      ["Tiempo de vida útil (horas)", equipment.lifeHours || "—"],
      ["Año de fabricación", equipment.manufactureYear || "—"],
      ["VIN", equipment.vin || "—"],
    ],
    styles: { fontSize: 8 },
    headStyles: { fillColor: [240, 240, 240] },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 120 },
    },
  });

  currentY = pdf.lastAutoTable.finalY + 12;

  // ============
  //  6. Firmas
  // ============
  if (currentY > 230) {
    pdf.addPage();
    currentY = 40;
  }

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text("6. Firmas", 14, currentY);
  currentY += 8;

  const ySignature = currentY;

  // Recuadros de firmas
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  // Técnico ASTAP
  pdf.rect(14, ySignature, 80, 30);
  pdf.text("Firma técnico ASTAP", 14 + 40, ySignature + 26, {
    align: "center",
  });

  // Cliente
  pdf.rect(110, ySignature, 80, 30);
  pdf.text("Firma cliente", 110 + 40, ySignature + 26, { align: "center" });

  // Firmas como imágenes (si existen)
  if (report.digitalSignatures?.astap) {
    try {
      pdf.addImage(
        report.digitalSignatures.astap,
        "PNG",
        14 + 5,
        ySignature + 5,
        70,
        20
      );
    } catch (e) {
      console.warn("No se pudo incrustar firma ASTAP:", e);
    }
  }

  if (report.digitalSignatures?.client) {
    try {
      pdf.addImage(
        report.digitalSignatures.client,
        "PNG",
        110 + 5,
        ySignature + 5,
        70,
        20
      );
    } catch (e) {
      console.warn("No se pudo incrustar firma cliente:", e);
    }
  }

  // =====================
  //  Guardar PDF
  // =====================
  const code = general.internalCode || "sin-codigo";
  pdf.save(`ASTAP_Reporte_${code}.pdf`);
};
