// src/utils/generateReportPdf.js
import jsPDF from "jspdf";
import "jspdf-autotable";
import astapLogo from "../astap-logo.jpg";

// Generador de PDF para informes ASTAP
export const generateReportPdf = (report) => {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();

  const primaryDark = [0, 55, 98];      // azul oscuro ASTAP
  const headerLight = [176, 216, 244];  // azul claro para cabeceras

  const drawDocument = (logoImg) => {
    let y = 15;
    const gi = report?.generalInfo || {};

    // ======= Encabezado =======
    doc.setFillColor(...primaryDark);
    doc.rect(0, 10, pageWidth, 10, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text("ASTAP - Informe de Servicio", 14, 17);

    // Logo (si existe)
    if (logoImg) {
      try {
        doc.addImage(logoImg, "JPEG", pageWidth - 40, 12, 22, 22);
      } catch (e) {
        console.warn("No se pudo dibujar el logo ASTAP:", e);
      }
    }

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);

    const summaryY = 25;
    doc.text(`Código interno: ${gi.internalCode || "—"}`, 14, summaryY);
    doc.text(`Cliente: ${gi.client || "—"}`, 14, summaryY + 5);
    doc.text(
      `Fecha de servicio: ${gi.serviceDate || "—"}`,
      14,
      summaryY + 10
    );
    y = summaryY + 18;

    const addSectionTitle = (title) => {
      doc.setFillColor(...primaryDark);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.rect(10, y, pageWidth - 20, 7, "F");
      doc.text(title, 12, y + 4.8);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      y += 10;
    };

    const autoTable = (options) => {
      doc.autoTable({
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: {
          fillColor: headerLight,
          textColor: 0,
          fontStyle: "bold",
          halign: "left",
        },
        ...options,
      });
      y = doc.lastAutoTable.finalY + 8;
    };

    // ======= 1. Información general del servicio =======
    addSectionTitle("1. Información general del servicio");
    autoTable({
      startY: y,
      head: [["Campo", "Detalle"]],
      body: [
        ["Cliente (empresa)", gi.client || "—"],
        ["Contacto cliente", gi.clientContact || "—"],
        ["Cargo del cliente", gi.clientRole || "—"],
        ["Correo del cliente", gi.clientEmail || "—"],
        ["Dirección", gi.address || "—"],
        ["Referencia", gi.reference || "—"],
        ["Técnico responsable", gi.technicalPersonnel || "—"],
        ["Teléfono del técnico", gi.technicianPhone || "—"],
        ["Correo del técnico", gi.technicianEmail || "—"],
      ],
      columnStyles: { 0: { cellWidth: 60 } },
    });

    // ======= 2. Pruebas antes del servicio =======
    addSectionTitle("2. Pruebas antes del servicio");
    const before = Array.isArray(report?.beforeTesting)
      ? report.beforeTesting
      : [];
    autoTable({
      startY: y,
      head: [["Ítem", "Parámetro", "Valor"]],
      body:
        before.length > 0
          ? before.map((row, idx) => [
              String(idx + 1),
              row.parameter || "",
              row.value || "",
            ])
          : [["—", "—", "—"]],
      columnStyles: { 0: { cellWidth: 15 }, 1: { cellWidth: 70 } },
    });

    // ======= 3. Actividades (con imagen) =======
    addSectionTitle("3. Actividades");
    const activities =
      report?.activitiesIncidents?.activities &&
      report.activitiesIncidents.activities.length
        ? report.activitiesIncidents.activities
        : [];

    autoTable({
      startY: y,
      head: [
        ["Ítem", "Título de actividad", "Detalle de actividad", "Imagen"],
      ],
      body:
        activities.length > 0
          ? activities.map((a, idx) => [
              String(idx + 1),
              a.title || "",
              a.detail || "",
              "", // la imagen se pinta en didDrawCell
            ])
          : [["—", "—", "—", ""]],
      columnStyles: {
        0: { cellWidth: 12 },
        1: { cellWidth: 40 },
        2: { cellWidth: 80 },
        3: { cellWidth: 30 },
      },
      didDrawCell: (data) => {
        if (
          data.section === "body" &&
          data.column.index === 3 && // columna Imagen
          activities[data.row.index] &&
          activities[data.row.index].imageData
        ) {
          const imgData = activities[data.row.index].imageData;
          const padding = 1.5;
          const w = data.cell.width - padding * 2;
          const h = data.cell.height - padding * 2;
          const x = data.cell.x + padding;
          const yImg = data.cell.y + padding;
          try {
            doc.addImage(imgData, "PNG", x, yImg, w, h);
          } catch (e) {
            console.warn("No se pudo dibujar imagen de actividad:", e);
          }
        }
      },
    });

    // ======= 4. Pruebas después del servicio =======
    addSectionTitle("4. Pruebas después del servicio");
    const after = Array.isArray(report?.afterTesting)
      ? report.afterTesting
      : [];
    autoTable({
      startY: y,
      head: [["Ítem", "Parámetro", "Valor"]],
      body:
        after.length > 0
          ? after.map((row, idx) => [
              String(idx + 1),
              row.parameter || "",
              row.value || "",
            ])
          : [["—", "—", "—"]],
      columnStyles: { 0: { cellWidth: 15 }, 1: { cellWidth: 70 } },
    });

    // ======= 5. Datos del equipo =======
    addSectionTitle("5. Datos del equipo");
    const eq = report?.equipment || {};
    autoTable({
      startY: y,
      head: [["Campo", "Detalle"]],
      body: [
        ["Equipo / Unidad", eq.unit || "—"],
        ["Marca", eq.brand || "—"],
        ["Modelo", eq.model || "—"],
        ["Serie", eq.serial || "—"],
        ["Placa / Código interno", eq.plate || "—"],
        ["Recorrido (km)", eq.mileageKm || "—"],
        ["Tiempo de vida útil (horas)", eq.lifeHours || "—"],
        ["Año de fabricación", eq.manufactureYear || "—"],
        ["VIN", eq.vin || "—"],
      ],
      columnStyles: { 0: { cellWidth: 60 } },
    });

    // ======= 6. Firmas =======
    addSectionTitle("6. Firmas");
    const startY = y;

    const boxWidth = (pageWidth - 40) / 2;
    const boxHeight = 35;
    const leftX = 15;
    const rightX = leftX + boxWidth + 10;
    const boxY = startY + 2;

    // Marcos
    doc.setDrawColor(0);
    doc.rect(leftX, boxY, boxWidth, boxHeight);
    doc.rect(rightX, boxY, boxWidth, boxHeight);

    const sigAstap = report?.digitalSignatures?.astap;
    const sigClient = report?.digitalSignatures?.client;

    if (sigAstap) {
      try {
        doc.addImage(
          sigAstap,
          "PNG",
          leftX + 2,
          boxY + 2,
          boxWidth - 4,
          boxHeight - 6
        );
      } catch (e) {
        console.warn("No se pudo dibujar firma ASTAP:", e);
      }
    }
    if (sigClient) {
      try {
        doc.addImage(
          sigClient,
          "PNG",
          rightX + 2,
          boxY + 2,
          boxWidth - 4,
          boxHeight - 6
        );
      } catch (e) {
        console.warn("No se pudo dibujar firma cliente:", e);
      }
    }

    // Textos de las firmas (negro y centrado)
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.text("Firma técnico ASTAP", leftX + boxWidth / 2, boxY + boxHeight + 6, {
      align: "center",
    });
    doc.text("Firma cliente", rightX + boxWidth / 2, boxY + boxHeight + 6, {
      align: "center",
    });

    // Guardar PDF
    const code = gi.internalCode || "sin-codigo";
    doc.save(`ASTAP_Reporte_${code}.pdf`);
  };

  // Cargamos el logo como <img> para poder pasarlo a jsPDF
  const img = new Image();
  img.src = astapLogo;
  img.onload = () => drawDocument(img);
  img.onerror = () => drawDocument(null);
};
