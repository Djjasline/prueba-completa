// src/pages/email-integration-interface/index.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { useReports } from "../../context/ReportContext";

const EmailIntegrationInterface = () => {
  const navigate = useNavigate();
  const { currentReport, reports } = useReports();

  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  // Al entrar, prellenar campos usando el reporte actual
  useEffect(() => {
    let report = currentReport;

    // Si no hay currentReport, usamos el último completo / borrador
    if (!report && reports.length > 0) {
      report = reports[reports.length - 1];
    }

    if (!report) return;

    const general = report.generalInfo || {};
    const client = general.client || "";
    const internalCode = general.internalCode || "";
    const serviceDate = general.serviceDate || "";
    const address = general.address || "";
    const reference = general.reference || "";
    const technicalPersonnel = general.technicalPersonnel || "";
    const technicianEmail = general.technicianEmail || "";

    // Destinatario inicial: correo del técnico (puedes cambiarlo a correo del cliente)
    setTo(technicianEmail || "");

    // Asunto propuesto
    setSubject(
      `Informe de servicio ASTAP - ${internalCode || "sin código"}`
    );

    // Cuerpo del correo (texto plano)
    const lines = [
      `Estimado/a,`,
      "",
      `Adjunto el informe de servicio correspondiente.`,
      "",
      `Cliente: ${client || "---"}`,
      `Fecha de servicio: ${serviceDate || "---"}`,
      `Código interno: ${internalCode || "---"}`,
      `Dirección: ${address || "---"}`,
      `Referencia: ${reference || "---"}`,
      "",
      `Técnico responsable: ${technicalPersonnel || "---"}`,
      "",
      "Por favor revise el informe en el archivo PDF adjunto.",
      "",
      "Saludos cordiales,",
      "Equipo ASTAP",
    ];

    setBody(lines.join("\n"));
  }, [currentReport, reports]);

  const handleBackToPreview = () => {
    navigate("/pdf-report-preview");
  };

  const handleBackToList = () => {
    navigate("/");
  };

  const handleSendEmail = () => {
    if (!to) {
      alert("Por favor ingrese al menos un destinatario en el campo 'Para'.");
      return;
    }

    const mailtoUrl = `mailto:${encodeURIComponent(
      to
    )}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}${
      cc ? `&cc=${encodeURIComponent(cc)}` : ""
    }`;

    // Abre el cliente de correo del dispositivo
    window.location.href = mailtoUrl;
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow border p-6 space-y-6">
        {/* Encabezado */}
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Enviar informe por correo
            </h1>
            <p className="text-sm text-slate-600">
              Usa esta pantalla para preparar el correo con el informe. Primero
              genera y descarga el PDF desde la vista previa y luego adjúntalo
              manualmente en tu cliente de correo.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              iconName="FileText"
              onClick={handleBackToPreview}
            >
              Ver / generar PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="List"
              onClick={handleBackToList}
            >
              Volver al listado
            </Button>
          </div>
        </header>

        {/* Formulario de correo */}
        <section className="space-y-4">
          {/* Para */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-700">
              Para *
            </label>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="correo@cliente.com"
              className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
            />
            <p className="text-[11px] text-slate-500">
              Puedes ingresar uno o varios correos separados por coma.
            </p>
          </div>

          {/* CC */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-700">
              CC
            </label>
            <input
              type="text"
              value={cc}
              onChange={(e) => setCc(e.target.value)}
              placeholder="otro@correo.com, supervisor@astap.com"
              className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
            />
          </div>

          {/* Asunto */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-700">
              Asunto
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
            />
          </div>

          {/* Cuerpo */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-700">
              Cuerpo del mensaje
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20 min-h-[160px]"
            />
            <p className="text-[11px] text-slate-500">
              Cuando se abra tu cliente de correo, recuerda adjuntar el archivo
              PDF generado desde la vista previa.
            </p>
          </div>
        </section>

        {/* Botón enviar */}
        <footer className="flex justify-end pt-2 border-t border-slate-100">
          <Button
            size="sm"
            iconName="Send"
            iconPosition="right"
            onClick={handleSendEmail}
          >
            Abrir cliente de correo
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default EmailIntegrationInterface;
