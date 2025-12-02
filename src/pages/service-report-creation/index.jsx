// src/pages/pdf-report-preview/index.jsx
import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Button from "../../components/ui/Button";
import { useReports } from "../../context/ReportContext";

// Generador de PDF para informes ASTAP
export const generateReportPdf = (report) => {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = 210;

  const safeReport = report || {};
  const general = safeReport.generalInfo || {};
  const beforeTesting = safeReport.beforeTesting || [];
  const activities = safeReport.activitiesIncidents || {};
  const signatures = safeReport.digitalSignatures || {};

  // Encabezado
  pdf.setFontSize(18);
  pdf.text("ASTAP - Reporte de Servicio", pageWidth / 2, 15, {
    align: "center",
  });

  pdf.setFontSize(10);
  pdf.text(`Fecha: ${general.serviceDate || "---"}`, 14, 25);
  pdf.text(`Cliente: ${general.client || "---"}`, 14, 30);
  pdf.text(
    `Código Interno: ${general.internalCode || "---"}`,
    14,
    35
  );

  // Información general
  pdf.setFontSize(14);
  pdf.text("Información General", 14, 50);

  pdf.setFontSize(10);
  pdf.text(`Dirección: ${general.address || "---"}`, 14, 57);
  pdf.text(`Referencia: ${general.reference || "---"}`, 14, 62);
  pdf.text(
    `Técnico: ${general.technicalPersonnel || "---"}`,
    14,
    67
  );
  pdf.text(
    `Teléfono técnico: ${general.technicianPhone || "---"}`,
    14,
    72
  );
  pdf.text(
    `Correo técnico: ${general.technicianEmail || "---"}`,
    14,
    77
  );

  // Pruebas antes del servicio
  let currentY = 90;
  if (beforeTesting.length > 0) {
    pdf.setFontSize(14);
    pdf.text("Pruebas Antes del Servicio", 14, currentY);

    pdf.autoTable({
      startY: currentY + 5,
      head: [["Parámetro", "Valor"]],
      body: beforeTesting.map((row) => [
        row.parameter || "",
        row.value || "",
      ]),
    });

    currentY = pdf.lastAutoTable.finalY + 10;
  } else {
    currentY = 100;
  }

  // Actividades e incidentes
  pdf.setFontSize(14);
  pdf.text("Actividades e Incidentes", 14, currentY);

  pdf.setFontSize(10);
  const actText =
    `Actividades: ${activities.activitiesDescription || "---"}`;
  const incText =
    `Incidentes: ${activities.incidentsDescription || "---"}`;

  pdf.text(actText, 14, currentY + 7, { maxWidth: 180 });
  pdf.text(incText, 14, currentY + 21, { maxWidth: 180 });

  // Firmas
  const signaturesBaseY = currentY + 45;
  pdf.setFontSize(14);
  pdf.text("Firmas", 14, signaturesBaseY);

  pdf.setFontSize(10);
  if (signatures.astap) {
    pdf.text("Técnico ASTAP:", 14, signaturesBaseY + 10);
    pdf.addImage(
      signatures.astap,
      "PNG",
      14,
      signaturesBaseY + 15,
      40,
      20
    );
  }

  if (signatures.client) {
    pdf.text("Cliente:", 120, signaturesBaseY + 10);
    pdf.addImage(
      signatures.client,
      "PNG",
      120,
      signaturesBaseY + 15,
      40,
      20
    );
  }

  // Guardar archivo
  pdf.save(
    `ASTAP_Reporte_${general.internalCode || "sin-codigo"}.pdf`
  );
};

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
    saveCompleted(currentReport); // marcar como completado en el historial
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
              Verifica los datos del informe antes de generar el PDF final.
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

        {/* Resumen rápido del informe */}
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
              El PDF incluirá la información general, pruebas antes del
              servicio, actividades, incidentes y firmas registradas.
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
