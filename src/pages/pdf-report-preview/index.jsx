// src/pages/pdf-report-preview/index.jsx
import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Button from "../../components/ui/Button";
import { useReports } from "../../context/ReportContext";

// ===============
// Generador PDF
// ===============
export const generateReportPdf = (report) => {
  const pdf = new jsPDF("p", "mm", "a4");

  const safeReport = report || {};
  const general = safeReport.generalInfo || {};
  const beforeTesting = safeReport.beforeTesting || [];
  const activities = safeReport.activitiesIncidents || {};
  const materials = safeReport.materials || [];
  const afterTesting = safeReport.afterTesting || []; // pruebas después
  const equipment = safeReport.equipment || {};       // datos del equipo
  const signatures = safeReport.digitalSignatures || {};

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const marginLeft = 14;
  const marginRight = 14;
  const usableWidth = pageWidth - marginLeft - marginRight;
  let currentY = 15;

  // ===== 1. ENCABEZADO + DATOS CLAVE =====
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text("ASTAP - Informe de Servicio", pageWidth / 2, currentY, {
    align: "center",
  });

  currentY += 7;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);

  const clienteLine = `Cliente: ${general.client || "—"}`;
  const codigoLine = `Código interno: ${general.internalCode || "—"}`;
  const fechaLine = `Fecha de servicio: ${general.serviceDate || "—"}`;

  pdf.text(clienteLine, marginLeft, currentY);
  pdf.text(codigoLine, marginLeft, currentY + 5);
  pdf.text(fechaLine, marginLeft, currentY + 10);

  currentY += 16;
  pdf.setLineWidth(0.3);
  pdf.line(marginLeft, currentY, pageWidth - marginRight, currentY);
  currentY += 4;

  // ===== 2. TABLA: INFORMACIÓN GENERAL DEL SERVICIO =====
  // Aquí incluimos datos del cliente (empresa y contacto) y del técnico
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text("Información general del servicio", marginLeft, currentY);
  currentY += 4;

  pdf.autoTable({
    startY: currentY,
    theme: "grid",
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [230, 230, 230] },
    columnStyles: {
      0: { cellWidth: 45 },
      1: { cellWidth: usableWidth - 45 },
    },
    head: [["Campo", "Detalle"]],
    body: [
      ["Cliente", general.client || "—"],
      ["Contacto cliente", general.clientContact || "—"],
      ["Correo cliente", general.clientEmail || "—"],
      ["Cargo cliente", general.clientRole || "—"],
      ["Dirección", general.address || "—"],
      ["Referencia", general.reference || "—"],
      ["Técnico responsable", general.technicalPersonnel || "—"],
      ["Teléfono técnico", general.technicianPhone || "—"],
      ["Correo técnico", general.technicianEmail || "—"],
    ],
  });

  currentY = pdf.lastAutoTable.finalY + 8;

  // ===== 3. TABLA: PRUEBAS ANTES DEL SERVICIO =====
  if (beforeTesting.length > 0) {
    if (currentY > pageHeight - 60) {
      pdf.addPage();
      currentY = 20;
    }

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.text("Pruebas antes del servicio", marginLeft, currentY);
    currentY += 4;

    pdf.autoTable({
      startY: currentY,
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [230, 230, 230] },
      head: [["Parámetro", "Valor"]],
      body: beforeTesting.map((row) => [
        row.parameter || "",
        row.value || "",
      ]),
    });

    currentY = pdf.lastAutoTable.finalY + 8;
  }

  // ===== 4. BLOQUE: ACTIVIDADES E INCIDENTES =====
  if (currentY > pageHeight - 80) {
    pdf.addPage();
    currentY = 20;
  }

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text("Actividades e incidentes", marginLeft, currentY);
  currentY += 5;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.text("Actividades realizadas:", marginLeft, currentY);
  currentY += 4;

  pdf.setFont("helvetica", "normal");
  const actText =
    activities.activitiesDescription ||
    "Sin descripción de actividades registrada.";
  const actLines = pdf.splitTextToSize(actText, usableWidth);
  pdf.text(actLines, marginLeft, currentY);
  currentY += actLines.length * 5 + 6;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.text("Incidentes:", marginLeft, currentY);
  currentY += 4;

  pdf.setFont("helvetica", "normal");
  const incText =
    activities.incidentsDescription ||
    "Sin incidentes registrados.";
  const incLines = pdf.splitTextToSize(incText, usableWidth);
  pdf.text(incLines, marginLeft, currentY);
  currentY += incLines.length * 5 + 8;

  // ===== 5. TABLA: MATERIALES UTILIZADOS =====
  if (materials.length > 0) {
    if (currentY > pageHeight - 70) {
      pdf.addPage();
      currentY = 20;
    }

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.text("Materiales utilizados", marginLeft, currentY);
    currentY += 4;

    pdf.autoTable({
      startY: currentY,
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [230, 230, 230] },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 80 },
        2: { cellWidth: 20 },
        3: { cellWidth: 20 },
      },
      head: [["Código", "Descripción", "Cant.", "Und."]],
      body: materials.map((m) => [
        m.code || "",
        m.description || "",
        m.quantity || "",
        m.unit || "",
      ]),
    });

    currentY = pdf.lastAutoTable.finalY + 8;
  }

  // ===== 6. TABLA: PRUEBAS DESPUÉS DEL SERVICIO =====
  if (afterTesting.length > 0) {
    if (currentY > pageHeight - 70) {
      pdf.addPage();
      currentY = 20;
    }

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.text("Pruebas después del servicio", marginLeft, currentY);
    currentY += 4;

    pdf.autoTable({
      startY: currentY,
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [230, 230, 230] },
      head: [["Parámetro", "Valor"]],
      body: afterTesting.map((row) => [
        row.parameter || "",
        row.value || "",
      ]),
    });

    currentY = pdf.lastAutoTable.finalY + 8;
  }

  // ===== 7. TABLA: DATOS DEL EQUIPO =====
  const hasEquipmentData =
    equipment &&
    Object.values(equipment).some(
      (v) => v !== undefined && String(v).trim() !== ""
    );

  if (hasEquipmentData) {
    if (currentY > pageHeight - 70) {
      pdf.addPage();
      currentY = 20;
    }

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.text("Datos del equipo", marginLeft, currentY);
    currentY += 4;

    pdf.autoTable({
      startY: currentY,
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [230, 230, 230] },
      columnStyles: {
        0: { cellWidth: 45 },
        1: { cellWidth: usableWidth - 45 },
      },
      head: [["Campo", "Detalle"]],
      body: [
        ["Equipo / Unidad", equipment.unit || "—"],
        ["Marca", equipment.brand || "—"],
        ["Modelo", equipment.model || "—"],
        ["Serie", equipment.serial || "—"],
        ["Placa / Código interno", equipment.plate || "—"],
        ["Ubicación / Área", equipment.location || "—"],
      ],
    });

    currentY = pdf.lastAutoTable.finalY + 8;
  }

  // ===== 8. FIRMAS (AL FINAL) =====
  if (currentY > pageHeight - 60) {
    pdf.addPage();
    currentY = 20;
  }

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text("Firmas", marginLeft, currentY);
  currentY += 6;

  const boxWidth = (usableWidth - 10) / 2;
  const boxHeight = 30;
  const signaturesY = currentY;

  // Cajas de firma
  pdf.setDrawColor(0);
  pdf.setLineWidth(0.2);

  // Caja Técnico ASTAP
  pdf.rect(marginLeft, signaturesY, boxWidth, boxHeight);
  pdf.setFontSize(9);
  pdf.text("Firma Técnico ASTAP", marginLeft + 4, signaturesY + 6);

  // Caja Cliente
  pdf.rect(marginLeft + boxWidth + 10, signaturesY, boxWidth, boxHeight);
  pdf.text(
    "Firma Cliente",
    marginLeft + boxWidth + 10 + 4,
    signaturesY + 6
  );

  // Firmas (imágenes dentro de las cajas)
  if (signatures.astap) {
    try {
      pdf.addImage(
        signatures.astap,
        "PNG",
        marginLeft + 4,
        signaturesY + 8,
        boxWidth - 8,
        boxHeight - 12
      );
    } catch (e) {
      console.error("Error agregando firma ASTAP al PDF", e);
    }
  }

  if (signatures.client) {
    try {
      pdf.addImage(
        signatures.client,
        "PNG",
        marginLeft + boxWidth + 10 + 4,
        signaturesY + 8,
        boxWidth - 8,
        boxHeight - 12
      );
    } catch (e) {
      console.error("Error agregando firma Cliente al PDF", e);
    }
  }

  // NOMBRES bajo las firmas (cliente y técnico)
  const namesY = signaturesY + boxHeight + 6;
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");

  const tecnicoName =
    general.technicalPersonnel && general.technicalPersonnel.trim() !== ""
      ? general.technicalPersonnel
      : "________________________";

  const clienteName =
    (general.clientContact && String(general.clientContact).trim() !== ""
      ? general.clientContact
      : null) ||
    (general.client && String(general.client).trim() !== ""
      ? general.client
      : "________________________");

  pdf.text(
    `Nombre técnico: ${tecnicoName}`,
    marginLeft,
    namesY
  );
  pdf.text(
    `Nombre cliente: ${clienteName}`,
    marginLeft + boxWidth + 10,
    namesY
  );

  // ===== PIE DE PÁGINA =====
  const totalPages = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(120);
    const footerText = `ASTAP - Informe de Servicio  |  Página ${i} de ${totalPages}`;
    pdf.text(
      footerText,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
  }

  // Guardar PDF
  pdf.save(
    `ASTAP_Reporte_${general.internalCode || "sin-codigo"}.pdf`
  );
};

// ===============
// Componente UI
// ===============
const PDFReportPreview = () => {
  const { currentReport, saveCompleted } = useReports();

  const handleGenerate = () => {
    if (!currentReport) {
      alert(
        "No hay datos de reporte cargados. Guarda primero el formulario."
      );
      return;
    }

    generateReportPdf(currentReport);
    saveCompleted(currentReport);
  };

  const general = currentReport?.generalInfo || {};

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Encabezado */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Vista previa / generación de PDF
            </h1>
            <p className="text-sm text-slate-600">
              El PDF se genera con el esquema: información general (cliente y
              técnico), pruebas antes, actividades e incidentes, materiales,
              pruebas después, datos del equipo y firmas con nombres
              automáticos.
            </p>
          </div>
          <Button
            size="sm"
            iconName="Download"
            onClick={handleGenerate}
          >
            Generar y descargar PDF
          </Button>
        </header>

        {/* Resumen */}
        {currentReport ? (
          <section className="bg-white rounded-xl shadow border p-6 space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Resumen del informe
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-slate-500 text-xs">Cliente</p>
                <p className="font-medium">
                  {general.client || "—"}
                </p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">Código interno</p>
                <p className="font-medium">
                  {general.internalCode || "—"}
                </p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">
                  Fecha de servicio
                </p>
                <p className="font-medium">
                  {general.serviceDate || "—"}
                </p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">Dirección</p>
                <p className="font-medium">
                  {general.address || "—"}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Si necesitas corregir información, vuelve al formulario o a la
              sección de firmas antes de generar el PDF final.
            </p>
          </section>
        ) : (
          <section className="bg-white rounded-xl shadow border p-6">
            <p className="text-sm text-slate-600">
              No hay informe actual cargado. Vuelve al listado y selecciona un
              informe o completa uno nuevo.
            </p>
          </section>
        )}
      </div>
    </div>
  );
};

export default PDFReportPreview;
