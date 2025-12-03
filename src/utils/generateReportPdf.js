// src/utils/generateReportPdf.js
import jsPDF from "jspdf";
import "jspdf-autotable";
import astapLogo from "../astap-logo.jpg";

// Colores corporativos aproximados
const COLORS = {
  primary: [0, 59, 102],           // azul oscuro ASTAP
  sectionHeaderBg: [0, 59, 102],   // barra de sección
  sectionHeaderText: [255, 255, 255],
  tableHeaderBg: [173, 216, 230],  // celeste
  tableHeaderText: [0, 0, 0],
  tableStripedBg: [245, 249, 255],
};

// Helper para título de sección
const drawSectionTitle = (pdf, title, startY) => {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 10;
  const barHeight = 7;

  pdf.setFillColor(...COLORS.sectionHeaderBg);
  pdf.rect(margin, startY, pageWidth - margin * 2, barHeight, "F");

  pdf.setTextColor(...COLORS.sectionHeaderText);
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.text(title, margin + 2, startY + 4.5);

  return startY + barHeight + 3;
};

const getImageFormat = (dataUrl) => {
  if (!dataUrl) return "JPEG";
  return dataUrl.includes("image/png") ? "PNG" : "JPEG";
};

export const generateReportPdf = (report) => {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const marginLeft = 10;

  // ============= Encabezado =============
  try {
    pdf.addImage(astapLogo, "JPEG", pageWidth - 40, 8, 24, 16);
  } catch (e) {
    // si falla el logo, continuamos sin romper el PDF
    console.warn("No se pudo cargar el logo ASTAP en el PDF", e);
  }

  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text("ASTAP - Informe de Servicio", pageWidth / 2, 16, { align: "center" });

  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  const gi = report?.generalInfo || {};
  const serviceDate = gi.serviceDate || "---";
  const clientName = gi.client || "---";
  const internalCode = gi.internalCode || "sin código";

  pdf.text(`Cliente: ${clientName}`, marginLeft, 23);
  pdf.text(`Código interno: ${internalCode}`, marginLeft, 28);
  pdf.text(`Fecha de servicio: ${serviceDate}`, marginLeft, 33);

  let currentY = 40;

  // ============= 1. Información general del servicio =============
  currentY = drawSectionTitle(pdf, "1. Información general del servicio", currentY);

  const generalRows = [
    ["Cliente", gi.client || ""],
    ["Contacto cliente", gi.clientContact || ""],
    ["Correo cliente", gi.clientEmail || ""],
    ["Cargo cliente", gi.clientRole || ""],
    ["Dirección", gi.address || ""],
    ["Referencia", gi.reference || ""],
    ["Técnico responsable", gi.technicalPersonnel || ""],
    ["Teléfono técnico", gi.technicianPhone || ""],
    ["Correo técnico", gi.technicianEmail || ""],
  ];

  pdf.autoTable({
    startY: currentY,
    head: [["Campo", "Detalle"]],
    body: generalRows,
    theme: "grid",
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: COLORS.tableHeaderBg,
      textColor: COLORS.tableHeaderText,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: COLORS.tableStripedBg,
    },
    margin: { left: marginLeft, right: marginLeft },
  });

  currentY = (pdf.lastAutoTable?.finalY || currentY) + 8;

  // Helpers para limpiar pruebas
  const cleanTests = (tests) =>
    (tests || []).filter(
      (r) => (r.parameter || "").trim() !== "" || (r.value || "").trim() !== ""
    );

  const beforeTests = cleanTests(report?.beforeTesting || []);
  const afterTests = cleanTests(report?.afterTesting || []);

  // ============= 2. Pruebas antes del servicio =============
  currentY = drawSectionTitle(pdf, "2. Pruebas antes del servicio", currentY);

  if (beforeTests.length === 0) {
    pdf.setFontSize(8);
    pdf.setTextColor(80);
    pdf.text("No hay pruebas registradas.", marginLeft, currentY + 4);
    currentY += 10;
  } else {
    pdf.autoTable({
      startY: currentY,
      head: [["Ítem", "Parámetro", "Valor"]],
      body: beforeTests.map((row, index) => [
        String(index + 1),
        row.parameter || "",
        row.value || "",
      ]),
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: COLORS.tableHeaderBg,
        textColor: COLORS.tableHeaderText,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: COLORS.tableStripedBg,
      },
      margin: { left: marginLeft, right: marginLeft },
      columnStyles: {
        0: { cellWidth: 12 },
      },
    });

    currentY = (pdf.lastAutoTable?.finalY || currentY) + 8;
  }

  // ============= 3. Actividades (con imagen) =============
  const activities = report?.activitiesIncidents?.activities || [];
  const hasActivities = activities.length > 0;

  currentY = drawSectionTitle(pdf, "3. Actividades", currentY);

  if (!hasActivities) {
    pdf.setFontSize(8);
    pdf.setTextColor(80);
    pdf.text("No hay actividades registradas.", marginLeft, currentY + 4);
    currentY += 10;
  } else {
    pdf.autoTable({
      startY: currentY,
      head: [["Ítem", "Título de actividad", "Detalle de actividad", "Imagen"]],
      body: activities.map((act, index) => [
        String(index + 1),
        act.title || "",
        act.detail || "",
        "", // la imagen se dibuja en didDrawCell
      ]),
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: COLORS.tableHeaderBg,
        textColor: COLORS.tableHeaderText,
        fontStyle: "bold",
      },
      bodyStyles: {
        // *** AQUI se hace cada fila más alta para que la imagen sea grande ***
        minCellHeight: 26,
      },
      alternateRowStyles: {
        fillColor: COLORS.tableStripedBg,
      },
      margin: { left: marginLeft, right: marginLeft },
      columnStyles: {
        0: { cellWidth: 12 },
        1: { cellWidth: 45 },
        2: { cellWidth: 75 },
        3: { cellWidth: 35 },
      },
      didDrawCell: (data) => {
        if (data.section === "body" && data.column.index === 3) {
          const act = activities[data.row.index];
          if (!act?.imageData) return;

          const cell = data.cell;
          const padding = 1.5;

          const availableWidth = cell.width - padding * 2;
          const availableHeight = cell.height - padding * 2;

          // Usamos casi todo el espacio disponible de la celda
          const imgWidth = availableWidth;
          const imgHeight = availableHeight;

          try {
            pdf.addImage(
              act.imageData,
              getImageFormat(act.imageData),
              cell.x + padding,
              cell.y + padding,
              imgWidth,
              imgHeight
            );
          } catch (e) {
            console.warn("No se pudo dibujar imagen de actividad en el PDF", e);
          }
        }
      },
    });

    currentY = (pdf.lastAutoTable?.finalY || currentY) + 8;
  }

  // ============= 4. Pruebas después del servicio =============
  currentY = drawSectionTitle(pdf, "4. Pruebas después del servicio", currentY);

  if (afterTests.length === 0) {
    pdf.setFontSize(8);
    pdf.setTextColor(80);
    pdf.text("No hay pruebas registradas.", marginLeft, currentY + 4);
    currentY += 10;
  } else {
    pdf.autoTable({
      startY: currentY,
      head: [["Ítem", "Parámetro", "Valor"]],
      body: afterTests.map((row, index) => [
        String(index + 1),
        row.parameter || "",
        row.value || "",
      ]),
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: COLORS.tableHeaderBg,
        textColor: COLORS.tableHeaderText,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: COLORS.tableStripedBg,
      },
      margin: { left: marginLeft, right: marginLeft },
      columnStyles: {
        0: { cellWidth: 12 },
      },
    });

    currentY = (pdf.lastAutoTable?.finalY || currentY) + 8;
  }

  // ============= 5. Datos del equipo =============
  const eq = report?.equipment || {};
  currentY = drawSectionTitle(pdf, "5. Datos del equipo", currentY);

  const equipmentRows = [
    ["Equipo / Unidad", eq.unit || ""],
    ["Marca", eq.brand || ""],
    ["Modelo", eq.model || ""],
    ["Serie", eq.serial || ""],
    ["Placa / Código interno", eq.plate || ""],
    ["Recorrido (km)", eq.mileageKm || ""],
    ["Tiempo de vida útil (horas)", eq.lifeHours || ""],
    ["Año de fabricación", eq.manufactureYear || ""],
    ["VIN", eq.vin || ""],
  ];

  pdf.autoTable({
    startY: currentY,
    head: [["Campo", "Detalle"]],
    body: equipmentRows,
    theme: "grid",
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: COLORS.tableHeaderBg,
      textColor: COLORS.tableHeaderText,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: COLORS.tableStripedBg,
    },
    margin: { left: marginLeft, right: marginLeft },
  });

  currentY = (pdf.lastAutoTable?.finalY || currentY) + 8;

  // ============= 6. Firmas =============
  currentY = drawSectionTitle(pdf, "6. Firmas", currentY);

  const sig = report?.digitalSignatures || {};
  const sigAstap = sig.astap;
  const sigClient = sig.client;

  const boxWidth = (pageWidth - marginLeft * 2 - 10) / 2;
  const boxHeight = 35;
  const yBox = currentY + 4;

  // Recuadros
  pdf.setDrawColor(0);
  pdf.rect(marginLeft, yBox, boxWidth, boxHeight);
  pdf.rect(marginLeft + boxWidth + 10, yBox, boxWidth, boxHeight);

  // Firmas
  const drawSignature = (dataUrl, x, y, w, h) => {
    if (!dataUrl) return;
    const padding = 3;
    const imgW = w - padding * 2;
    const imgH = h - padding * 2;
    try {
      pdf.addImage(
        dataUrl,
        getImageFormat(dataUrl),
        x + padding,
        y + padding,
        imgW,
        imgH
      );
    } catch (e) {
      console.warn("No se pudo dibujar firma en el PDF", e);
    }
  };

  drawSignature(sigAstap, marginLeft, yBox, boxWidth, boxHeight);
  drawSignature(sigClient, marginLeft + boxWidth + 10, yBox, boxWidth, boxHeight);

  // Etiquetas de firmas
  pdf.setFontSize(8);
  pdf.setTextColor(0, 0, 0);
  pdf.setFont("helvetica", "bold");
  pdf.text("Firma técnico ASTAP", marginLeft + boxWidth / 2, yBox + boxHeight + 5, {
    align: "center",
  });
  pdf.text(
    "Firma cliente",
    marginLeft + boxWidth + 10 + boxWidth / 2,
    yBox + boxHeight + 5,
    { align: "center" }
  );

  // Finalmente, guardar
  const fileName = `ASTAP_Reporte_${internalCode || "sin-codigo"}.pdf`;
  pdf.save(fileName);
};
