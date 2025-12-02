// src/pages/pdf-report-preview/index.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { useReports } from "../../context/ReportContext";
import { generateReportPdf } from "../../utils/generateReportPdf";

const PDFReportPreview = () => {
  const navigate = useNavigate();
  const { currentReport } = useReports ? useReports() : { currentReport: null };

  const general = currentReport?.generalInfo || {};

  const handleBack = () => {
    // volver al formulario inicial
    navigate("/");
  };

  const handleGeneratePdf = async () => {
    if (!currentReport) {
      alert("No hay datos de reporte cargados.");
      return;
    }

    try {
      await generateReportPdf(currentReport);
    } catch (error) {
      console.error("Error al generar PDF:", error);
      alert("Ocurrió un error al generar el PDF.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Encabezado */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Vista previa / generación de PDF
            </h1>
            <p className="text-xs text-slate-600 max-w-xl">
              El PDF se genera con el esquema: información general (cliente y
              técnico), pruebas antes, actividades e incidentes, pruebas
              después, datos del equipo y firmas con nombres automáticos.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              iconName="ArrowLeft"
              onClick={handleBack}
            >
              Volver
            </Button>

            <Button
              size="sm"
              iconName="Download"
              iconPosition="left"
              onClick={handleGeneratePdf}
            >
              Generar y descargar PDF
            </Button>
          </div>
        </header>

        {/* Resumen del informe */}
        <section className="bg-white rounded-xl shadow border p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-4">
            Resumen del informe
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 text-xs">
            <div className="space-y-1">
              <p className="text-slate-500">Cliente</p>
              <p className="font-medium text-slate-900">
                {general.client || "—"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-slate-500">Código interno</p>
              <p className="font-medium text-slate-900">
                {general.internalCode || "—"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-slate-500">Fecha de servicio</p>
              <p className="font-medium text-slate-900">
                {general.serviceDate || "—"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-slate-500">Dirección</p>
              <p className="font-medium text-slate-900">
                {general.address || "—"}
              </p>
            </div>
          </div>

          <p className="mt-6 text-[11px] text-slate-500">
            Si necesitas corregir información, vuelve al formulario o a la
            sección de firmas antes de generar el PDF final.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PDFReportPreview;
