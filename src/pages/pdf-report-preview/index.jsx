import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const PdfReportPreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const captureRef = useRef(null);

  // 1) Traemos el reporte desde state o desde localStorage
  const report = useMemo(() => {
    if (location.state?.reportData) return location.state.reportData;

    try {
      const raw = localStorage.getItem("astap-current-report");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [location.state]);

  // 2) Si no hay datos, devolvemos al formulario con aviso
  useEffect(() => {
    if (!report) {
      alert("No se encontró información del reporte. Vuelve a 'Crear informe'.");
      navigate("/service-report-creation");
    }
  }, [report, navigate]);

  // Datos que deben verse en la caja grande
  const client = report?.generalInfo?.client || "—";
  const serviceDate = report?.generalInfo?.serviceDate || "—";

  // Contenido “de muestra” para paginado (puedes cambiarlo por tu maquetado real)
  const [page, setPage] = useState(0);
  const pages = [
    {
      key: "p1",
      title: "Vista previa del reporte",
      content: (
        <div className="space-y-2">
          <p>
            <strong>Cliente:</strong> {client}
          </p>
          <p>
            <strong>Fecha:</strong> {serviceDate}
          </p>
        </div>
      ),
    },
    {
      key: "p2",
      title: "Datos del equipo",
      content: (
        <div className="space-y-2">
          <p>
            <strong>Tipo:</strong> {report?.equipmentDetails?.type || "—"}
          </p>
          <p>
            <strong>Marca:</strong> {report?.equipmentDetails?.brand || "—"}
          </p>
          <p>
            <strong>Modelo:</strong> {report?.equipmentDetails?.model || "—"}
          </p>
          <p>
            <strong>N° serie:</strong> {report?.equipmentDetails?.serialNumber || "—"}
          </p>
        </div>
      ),
    },
    {
      key: "p3",
      title: "Responsables",
      content: (
        <div className="space-y-2">
          <p className="font-semibold">Técnico ASTAP</p>
          <p>
            {report?.responsibleParties?.astap?.name || "—"} •{" "}
            {report?.responsibleParties?.astap?.phone || "—"} •{" "}
            {report?.responsibleParties?.astap?.email || "—"}
          </p>
          <p className="font-semibold mt-3">Representante del cliente</p>
          <p>
            {report?.responsibleParties?.client?.name || "—"} •{" "}
            {report?.responsibleParties?.client?.phone || "—"} •{" "}
            {report?.responsibleParties?.client?.email || "—"}
          </p>
        </div>
      ),
    },
  ];

  const prev = () => setPage((p) => Math.max(0, p - 1));
  const next = () => setPage((p) => Math.min(pages.length - 1, p + 1));

  // 3) Descargar PDF: captura el bloque visible (lo que está dentro de captureRef)
  const handleDownloadPdf = async () => {
    if (!captureRef.current) return;
    const canvas = await html2canvas(captureRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = 210;
    const pageHeight = 297;

    // Ajustamos la imagen al ancho de A4 manteniendo proporción
    const imgWidth = pageWidth - 20; // márgenes
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    pdf.save(`ASTAP_Reporte_${report?.generalInfo?.internalCode || "sin-codigo"}.pdf`);
  };

  if (!report) return null;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Vista previa del informe</h1>
        <div className="text-sm text-muted-foreground">
          Página {page + 1} de {pages.length}
        </div>
      </div>

      {/* Contenedor CAPTURABLE */}
      <div
        ref={captureRef}
        className="border border-border rounded-lg p-5 bg-white shadow-sm"
      >
        <h2 className="text-lg font-medium text-foreground mb-3">
          {pages[page].title}
        </h2>
        {pages[page].content}
      </div>

      {/* Controles */}
      <div className="flex items-center justify-between mt-6">
        <div className="space-x-2">
          <button
            className="px-4 py-2 rounded-md border hover:bg-muted"
            onClick={() => navigate(-1)}
          >
            Volver
          </button>
          <button
            className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:opacity-90"
            onClick={handleDownloadPdf}
          >
            Descargar PDF
          </button>
        </div>

        <div className="space-x-2">
          <button
            disabled={page === 0}
            onClick={prev}
            className={`px-4 py-2 rounded-md border ${
              page === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-muted"
            }`}
          >
            Anterior
          </button>
          <button
            disabled={page === pages.length - 1}
            onClick={next}
            className={`px-4 py-2 rounded-md border ${
              page === pages.length - 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-muted"
            }`}
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
};

export default PdfReportPreview;
