// src/utils/generateReportPdf.js
import jsPDF from "jspdf";
import "jspdf-autotable";
import astapLogo from "../astap-logo.jpg"; // tu logo real

// Colores corporativos (aprox)
const BRAND_BLUE = { r: 4, g: 55, b: 94 }; // azul oscuro
const HEADER_PASTEL = [173, 216, 230];     // celeste pastel (puedes ajustar)
const PAGE_WIDTH = 210;
const MARGIN_X = 14;

// ===============================
// Encabezado principal con logo
// ===============================
const drawMainHeader = async (pdf, general) => {
  // Barra azul superior
  pdf.setFillColor(BRAND_BLUE.r, BRAND_BLUE.g, BRAND_BLUE.b);
  pdf.rect(0, 0, PAGE_WIDTH, 22, "F");

  // Título blanco centrado
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.text("ASTAP - Informe de Servicio", PAGE_WIDTH / 2, 12, {
    align: "center",
  });

  // Logo (si se puede cargar)
  try {
    if (astapLogo) {
      const img = new Image();
      img.src = astapLogo;

      await new Promise((resolve) => {
        img.onload = () => {
          pdf.addImage(img, "JPEG", PAGE_WIDTH - 14 - 25, 4, 25, 14);
          resolve();
        };
        img.onerror = () => resolve();
      });
    }
  } catch (e) {
    console.warn("No se pudo cargar el logo ASTAP:", e);
  }

  // Texto pequeño bajo la barra
  pdf.setTextColor(0, 0, 0);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);

  const code = general?.internalCode || "—";
  const client = general?.client || "—";
  const date = general?.serviceDate || "—";

  pdf.text(`Código interno: ${code}`, MARGIN_X, 26);
  pdf.text(`Cliente: ${client}`, MARGIN_X, 31);
  pdf.text(`Fecha de servicio: ${date}`, MARGIN_X, 36);

  return 42; // pos Y donde empezamos el contenido
};

// ==================================
// Encabezado de sección (barra azul)
// ==================================
const drawSectionHeader = (pdf, text, y) => {
  const height = 7;
  pdf.setFillColor(BRAND_BLUE.r, BRAND_BLUE.g, BRAND_BLUE.b);
  pdf.rect(MARGIN_X, y - height + 1, PAGE_WIDTH - 2 * MARGIN_X, height, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text(text, MARGIN_X + 2, y);

  // Volver a texto negro
  pdf.setTextColor(0, 0, 0);
};

// ==================================
// Generador de PDF principal
// ==================================
export const generateReportPdf = async (report) => {
  if (!report) {
    alert("No hay datos del reporte para generar el PDF.");
    return;
  }

  const pdf = new jsPDF("p", "mm", "a4");

  const general = report.generalInfo || {};
  const beforeTesting = report.beforeTesting || [];
  const afterTesting = report.afterTesting || [];
  const activitiesBlock = report.activitiesIncidents || {};
  const activities = activitiesBlock.activities || [];
  const equipment = report.equipment || {};

  // 1) Encabezado principal
  let currentY = await drawMainHeader(pdf, general);

  // ================================
  // 1. Información general servicio
  // ================================
  drawSectionHeader(pdf, "1. Información general del servicio", currentY);
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
    headStyles: {
      fillColor: HEADER_PASTEL,
      textColor: [0, 0, 0], // texto negro
    },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 120 },
    },
  });

  currentY = pdf.lastAutoTable.finalY + 8;

  // ================================
  // 2. Pruebas antes del servicio
  // ================================
  if (beforeTesting.length > 0) {
    drawSectionHeader(pdf, "2. Pruebas antes del servicio", currentY);
    currentY += 4;

    const body = beforeTesting.map((row, idx) => [
      idx + 1,
      row.parameter || "—",
      row.value || "—",
    ]);

    pdf.autoTable({
      startY: currentY,
      head: [["Ítem", "Parámetro", "Valor"]],
      body,
      styles: { fontSize: 8 },
      headStyles: {
        fillColor: HEADER_PASTEL,
        textColor: [0, 0, 0],
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 90 },
        2: { cellWidth: 60 },
      },
    });

    currentY = pdf.lastAutoTable.finalY + 8;
  }

  // ================================
  // 3. Actividades
  // ================================
  drawSectionHeader(pdf, "3. Actividades", currentY);
  currentY += 4;

  if (activities.length > 0) {
    const body = activities.map((act, index) => [
      index + 1,
      act.title || "—",
      act.detail || "—",
      "", // columna de imagen vacía (placeholder)
    ]);

    pdf.autoTable({
      startY: currentY,
      head: [
        [
          "Ítem",
          "Título de actividad",
          "Detalle de actividad",
          "Imagen",
        ],
      ],
      body,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: {
        fillColor: HEADER_PASTEL,
        textColor: [0, 0, 0],
      },
      columnStyles: {
        0: { cellWidth: 12 },
        1: { cellWidth: 55 },
        2: { cellWidth: 88 },
        3: { cellWidth: 25 },
      },
    });

    currentY = pdf.lastAutoTable.finalY + 8;
  }

  // ⚠️ Ya NO mostramos el bloque de “Incidentes”
  // (lo eliminaste en el diseño)

  // ================================
  // 4. Pruebas después del servicio
  // ================================
  if (afterTesting.length > 0) {
    if (currentY > 260) {
      pdf.addPage();
      currentY = 20;
    }

    drawSectionHeader(pdf, "4. Pruebas después del servicio", currentY);
    currentY += 4;

    const bodyAfter = afterTesting.map((row, idx) => [
      idx + 1,
      row.parameter || "—",
      row.value || "—",
    ]);

    pdf.autoTable({
      startY: currentY,
      head: [["Ítem", "Parámetro", "Valor"]],
      body: bodyAfter,
      styles: { fontSize: 8 },
      headStyles: {
        fillColor: HEADER_PASTEL,
        textColor: [0, 0, 0],
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 90 },
        2: { cellWidth: 60 },
      },
    });

    currentY = pdf.lastAutoTable.finalY + 8;
  }

  // ================================
  // 5. Datos del equipo
  // ================================
  if (currentY > 260) {
    pdf.addPage();
    currentY = 20;
  }

  drawSectionHeader(pdf, "5. Datos del equipo", currentY);
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
    headStyles: {
      fillColor: HEADER_PASTEL,
      textColor: [0, 0, 0],
    },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 120 },
    },
  });

  currentY = pdf.lastAutoTable.finalY + 12;

  // ================================
  // 6. Firmas
  // ================================
  if (currentY > 230) {
    pdf.addPage();
    currentY = 40;
  }

  drawSectionHeader(pdf, "6. Firmas", currentY);
  currentY += 8;

  const ySignature = currentY;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);

  // Recuadros de firmas
  pdf.rect(MARGIN_X, ySignature, 80, 30);
  pdf.text("Firma técnico ASTAP", MARGIN_X + 40, ySignature + 26, {
    align: "center",
  });

  pdf.rect(110, ySignature, 80, 30);
  pdf.text("Firma cliente", 110 + 40, ySignature + 26, {
    align: "center",
  });

  // Firmas como imágenes (si existen)
  if (report.digitalSignatures?.astap) {
    try {
      pdf.addImage(
        report.digitalSignatures.astap,
        "PNG",
        MARGIN_X + 5,
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

  const code = general.internalCode || "sin-codigo";
  pdf.save(`ASTAP_Reporte_${code}.pdf`);
};
