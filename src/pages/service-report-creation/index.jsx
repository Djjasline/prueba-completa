// src/pages/service-report-creation/index.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { useReports } from "../../context/ReportContext";

const emptyGeneralInfo = {
  client: "",
  serviceDate: "",
  internalCode: "",
  address: "",
  reference: "",
  technicalPersonnel: "",
  technicianPhone: "",
  technicianEmail: "",
};

const ServiceReportCreation = () => {
  const navigate = useNavigate();
  const { currentReport, saveDraft } = useReports();

  const [generalInfo, setGeneralInfo] = useState(emptyGeneralInfo);
  const [beforeTesting, setBeforeTesting] = useState([
    { id: 1, parameter: "", value: "" },
  ]);
  const [activitiesDescription, setActivitiesDescription] = useState("");
  const [incidentsDescription, setIncidentsDescription] = useState("");

  // Al entrar a la pantalla, cargar datos del reporte actual (si existe)
  useEffect(() => {
    if (currentReport) {
      setGeneralInfo({
        ...emptyGeneralInfo,
        ...(currentReport.generalInfo || {}),
      });

      setBeforeTesting(
        (currentReport.beforeTesting || []).length > 0
          ? currentReport.beforeTesting.map((row, idx) => ({
              id: idx + 1,
              parameter: row.parameter || "",
              value: row.value || "",
            }))
          : [{ id: 1, parameter: "", value: "" }]
      );

      setActivitiesDescription(
        currentReport.activitiesIncidents?.activitiesDescription || ""
      );
      setIncidentsDescription(
        currentReport.activitiesIncidents?.incidentsDescription || ""
      );
    }
  }, [currentReport]);

  // Handlers de formulario
  const handleGeneralChange = (field, value) => {
    setGeneralInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBeforeTestingChange = (id, field, value) => {
    setBeforeTesting((rows) =>
      rows.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const handleAddBeforeRow = () => {
    setBeforeTesting((rows) => [
      ...rows,
      { id: Date.now(), parameter: "", value: "" },
    ]);
  };

  const handleRemoveBeforeRow = (id) => {
    setBeforeTesting((rows) => {
      const filtered = rows.filter((r) => r.id !== id);
      return filtered.length > 0 ? filtered : [{ id: 1, parameter: "", value: "" }];
    });
  };

  // Arma el objeto completo de reporte a partir del formulario
  const buildReportObject = () => {
    return {
      ...currentReport,
      generalInfo: { ...generalInfo },
      beforeTesting: beforeTesting
        .filter((r) => r.parameter || r.value)
        .map((r) => ({ parameter: r.parameter, value: r.value })),
      activitiesIncidents: {
        activitiesDescription,
        incidentsDescription,
      },
      // preservamos firmas, materiales, etc. que se llenan en otras pantallas
      digitalSignatures: currentReport?.digitalSignatures || {},
      materials: currentReport?.materials || [],
    };
  };

  // Guardar como borrador
  const handleSaveDraft = () => {
    const report = buildReportObject();
    saveDraft(report);
    alert("Borrador guardado correctamente.");
  };

  // Guardar y pasar a firmas
  const handleGoToSignatures = () => {
    const report = buildReportObject();
    saveDraft(report); // seguimos en borrador hasta que se genere/envíe
    navigate("/digital-signature-capture");
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Encabezado */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Crear Reporte de Servicio
            </h1>
            <p className="text-sm text-slate-600">
              Completa la información del servicio técnico realizado.
            </p>
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveDraft}
              iconName="Save"
            >
              Guardar borrador
            </Button>
            <Button
              size="sm"
              onClick={handleGoToSignatures}
              iconName="ArrowRight"
            >
              Continuar a Firma Digital
            </Button>
          </div>
        </header>

        {/* Card Información general */}
        <section className="bg-white rounded-xl shadow border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Información general
              </h2>
              <p className="text-xs text-slate-500">
                Datos básicos del servicio y cliente
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cliente */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-700">
                Cliente *
              </label>
              <input
                type="text"
                value={generalInfo.client}
                onChange={(e) =>
                  handleGeneralChange("client", e.target.value)
                }
                className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
                placeholder="Nombre del cliente"
              />
            </div>

            {/* Código interno */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-700">
                Código interno *
              </label>
              <input
                type="text"
                value={generalInfo.internalCode}
                onChange={(e) =>
                  handleGeneralChange("internalCode", e.target.value)
                }
                className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
                placeholder="Ej: P25-059"
              />
            </div>

            {/* Fecha de servicio */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-700">
                Fecha de servicio *
              </label>
              <input
                type="date"
                value={generalInfo.serviceDate}
                onChange={(e) =>
                  handleGeneralChange("serviceDate", e.target.value)
                }
                className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
              />
            </div>

            {/* Dirección */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-700">
                Dirección *
              </label>
              <input
                type="text"
                value={generalInfo.address}
                onChange={(e) =>
                  handleGeneralChange("address", e.target.value)
                }
                className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
                placeholder="Dirección del servicio"
              />
            </div>

            {/* Referencia */}
            <div className="md:col-span-2 flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-700">
                Referencia
              </label>
              <input
                type="text"
                value={generalInfo.reference}
                onChange={(e) =>
                  handleGeneralChange("reference", e.target.value)
                }
                className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
                placeholder="Descripción breve del problema o referencia"
              />
            </div>

            {/* Técnico personal */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-700">
                Técnico personal *
              </label>
              <input
                type="text"
                value={generalInfo.technicalPersonnel}
                onChange={(e) =>
                  handleGeneralChange(
                    "technicalPersonnel",
                    e.target.value
                  )
                }
                className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
                placeholder="Nombre del técnico"
              />
            </div>

            {/* Teléfono del técnico */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-700">
                Teléfono del técnico
              </label>
              <input
                type="tel"
                value={generalInfo.technicianPhone}
                onChange={(e) =>
                  handleGeneralChange("technicianPhone", e.target.value)
                }
                className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
                placeholder="Número de contacto"
              />
            </div>

            {/* Correo del técnico */}
            <div className="md:col-span-2 flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-700">
                Correo del técnico
              </label>
              <input
                type="email"
                value={generalInfo.technicianEmail}
                onChange={(e) =>
                  handleGeneralChange("technicianEmail", e.target.value)
                }
                className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
                placeholder="correo@astap.com"
              />
            </div>
          </div>
        </section>

        {/* Pruebas antes del servicio */}
        <section className="bg-white rounded-xl shadow border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Pruebas Antes del Servicio
              </h2>
              <p className="text-xs text-slate-500">
                Parámetros medidos antes de iniciar el servicio
              </p>
            </div>
            <Button
              variant="outline"
              size="xs"
              onClick={handleAddBeforeRow}
              iconName="Plus"
            >
              Agregar parámetro
            </Button>
          </div>

          <div className="space-y-2">
            {beforeTesting.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-12 gap-2 items-center"
              >
                <input
                  className="col-span-5 border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
                  placeholder="Parámetro"
                  value={row.parameter}
                  onChange={(e) =>
                    handleBeforeTestingChange(
                      row.id,
                      "parameter",
                      e.target.value
                    )
                  }
                />
                <input
                  className="col-span-5 border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
                  placeholder="Valor"
                  value={row.value}
                  onChange={(e) =>
                    handleBeforeTestingChange(
                      row.id,
                      "value",
                      e.target.value
                    )
                  }
                />
                <div className="col-span-2 flex justify-end">
                  <Button
                    variant="outline"
                    size="xs"
                    iconName="Trash2"
                    onClick={() => handleRemoveBeforeRow(row.id)}
                  >
                    Quitar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Actividades e incidentes */}
        <section className="bg-white rounded-xl shadow border p-6 space-y-4 mb-16">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Actividades e Incidentes
            </h2>
            <p className="text-xs text-slate-500">
              Detalla las actividades realizadas e incidentes ocurridos
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-700">
              Actividades realizadas
            </label>
            <textarea
              value={activitiesDescription}
              onChange={(e) => setActivitiesDescription(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20 min-h-[80px]"
              placeholder="Describe las actividades realizadas durante el servicio"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-700">
              Incidentes
            </label>
            <textarea
              value={incidentsDescription}
              onChange={(e) => setIncidentsDescription(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20 min-h-[80px]"
              placeholder="Registra cualquier incidente relevante"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveDraft}
              iconName="Save"
            >
              Guardar borrador
            </Button>
            <Button
              size="sm"
              onClick={handleGoToSignatures}
              iconName="ArrowRight"
            >
              Continuar a Firma Digital
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ServiceReportCreation;
