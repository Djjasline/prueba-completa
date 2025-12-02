// src/pages/digital-signature-capture/index.jsx
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { useReports } from "../../context/ReportContext";
import CustomSignatureCanvas from "./components/SignatureCanvas";

const DigitalSignatureCapture = () => {
  const navigate = useNavigate();
  const { currentReport, saveDraft } = useReports();

  const [astapSignature, setAstapSignature] = useState(null);
  const [clientSignature, setClientSignature] = useState(null);

  const astapRef = useRef(null);
  const clientRef = useRef(null);

  // Cargar firmas si ya existían en el reporte
  useEffect(() => {
    if (currentReport?.digitalSignatures) {
      setAstapSignature(currentReport.digitalSignatures.astap || null);
      setClientSignature(currentReport.digitalSignatures.client || null);
    }
  }, [currentReport]);

  if (!currentReport) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md bg-white rounded-xl shadow p-6 space-y-3 text-center">
          <h1 className="text-lg font-semibold text-slate-900">
            No hay informe cargado
          </h1>
          <p className="text-sm text-slate-600">
            Vuelve al listado y crea o selecciona un informe antes de capturar
            las firmas.
          </p>
          <Button onClick={() => navigate("/")}>Volver al listado</Button>
        </div>
      </div>
    );
  }

  const handleSaveSignatures = () => {
    const report = {
      ...currentReport,
      digitalSignatures: {
        astap: astapSignature,
        client: clientSignature,
      },
    };
    saveDraft(report);
    alert("Firmas guardadas en el informe.");
  };

  const handleContinueToPdf = () => {
    const report = {
      ...currentReport,
      digitalSignatures: {
        astap: astapSignature,
        client: clientSignature,
      },
    };
    saveDraft(report);
    navigate("/pdf-report-preview");
  };

  const handleBackToForm = () => {
    navigate("/service-report-creation");
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Encabezado */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Firma digital del informe
            </h1>
            <p className="text-sm text-slate-600">
              Captura la firma del técnico de ASTAP y la del cliente.
            </p>
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="ArrowLeft"
              onClick={handleBackToForm}
            >
              Volver al formulario
            </Button>
          </div>
        </header>

        {/* Firmas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Firma ASTAP */}
          <CustomSignatureCanvas
            ref={astapRef}
            title="Firma Técnico ASTAP"
            subtitle="Responsable del servicio"
            onSignatureChange={setAstapSignature}
            disabled={false}
          />

          {/* Firma Cliente */}
          <CustomSignatureCanvas
            ref={clientRef}
            title="Firma del Cliente"
            subtitle="Confirmación de recepción del servicio"
            onSignatureChange={setClientSignature}
            disabled={false}
          />
        </div>

        {/* Acciones */}
        <footer className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            iconName="Save"
            onClick={handleSaveSignatures}
          >
            Guardar firmas
          </Button>
          <Button
            size="sm"
            iconName="ArrowRight"
            onClick={handleContinueToPdf}
          >
            Continuar a Vista previa PDF
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default DigitalSignatureCapture;
