// src/pages/service-report-creation/index.jsx
import React, { useEffect, useRef, useState } from "react";
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

  // Materiales
  const [materials, setMaterials] = useState([
    { id: 1, code: "", description: "", quantity: "", unit: "" },
  ]);

  // Para autosave
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const autoSaveTimerRef = useRef(null);
  const isInitialLoadRef = useRef(true);

  // Cargar datos del reporte actual (si existe)
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

      setMaterials(
        (currentReport.materials || []).length > 0
          ? currentReport.materials.map((m, idx) => ({
              id: idx + 1,
              code: m.code || "",
              description: m.description || "",
              quantity: m.quantity || "",
              unit: m.unit || "",
            }))
          : [{ id: 1, code: "", description: "", quantity: "", unit: "" }]
      );
    }

    // La primera vez que cargamos desde currentReport no queremos disparar autosave
    isInitialLoadRef.current = true;
    setLastSavedAt(currentReport?.updatedAt || null);
  }, [currentReport]);

  // Handlers de formulario general
  const handleGeneralChange = (field, value) => {
    setGeneralInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Pruebas antes del servicio
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

  // Materiales
  const handleMaterialChange = (id, field, value) => {
    setMaterials((rows) =>
      rows.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const handleAddMaterialRow = () => {
    setMaterials((rows) => [
      ...rows,
      { id: Date.now(), code: "", description: "", quantity: "", unit: "" },
    ]);
  };

  const handleRemoveMaterialRow = (id) => {
    setMaterials((rows) => {
      const filtered = rows.filter((r) => r.id !== id);
      return filtered.length > 0
        ? filtered
        : [{ id: 1, code: "", description: "", quantity: "", unit: "" }];
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
      materials: materials
        .filter(
          (m) => m.code || m.description || m.quantity || m.unit
        )
        .map((m) => ({
          code: m.code,
          description: m.description,
          quantity: m.quantity,
          unit: m.unit,
        })),
      digitalSignatures: currentReport?.digitalSignatures || {},
    };
  };

  // Guardar como borrador (manual)
  const handleSaveDraft = () => {
    const report = buildReportObject();
    const saved = saveDraft(report);
    setLastSavedAt(saved.updatedAt || new Date().toISOString());
    alert("Borrador guardado correctamente.");
  };

  // Guardar y pasar a firmas
  const handleGoToSignatures = () => {
    const report = buildReportObject();
    const saved = saveDraft(report);
    setLastSavedAt(saved.updatedAt || new Date().toISOString());
    navigate("/digital-signature-capture");
  };

  // 🔁 AUTOSAVE: cuando cambie algo del formulario, guardamos automáticamente
  useEffect(() => {
    // Evitar autosave inmediato después de cargar datos iniciales
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      return;
    }

    // Limpiamos cualquier timer previo
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    // Programar guardado después de 4 segundos sin cambios
    autoSaveTimerRef.current = setTimeout(() => {
      const report = buildReportObject();
      const saved = saveDraft(report);
      setLastSavedAt(saved.updatedAt || new Date().toISOString());
      // No mostramos alert aquí para que no moleste al técnico
      console.log("Autosave del informe", saved.id);
    }, 4000);

    // Cleanup
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    generalInfo,
    beforeTesting,
    materials,
    activitiesDescription,
    incidentsDescription,
  ]);

  const formatLastSaved = () => {
    if (!lastSavedAt) return "Sin guardar todavía";
    try {
      const d = new Date(lastSavedAt);
      return `Último guardado: ${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
    } catch {
      return `Último guardado: ${lastSavedAt}`;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Encabezado */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Crear Reporte de Servicio
            </h1>
            <p className="text-sm text-slate-600">
              Completa la información del servicio técnico realizado.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-[11px] text-slate-500 italic">
              {formatLastSaved()}
            </span>
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
          </div>
        </header>

        {/* Información general */}
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
                  handleGeneralChange(
                    "technicianPhone",
                    e.target.value
                  )
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
                  handleGeneralChange(
                    "technicianEmail",
                    e.target.value
                  )
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

        {/* Materiales utilizados */}
        <section className="bg-white rounded-xl shadow border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Materiales utilizados
              </h2>
              <p className="text-xs text-slate-500">
                Registra los materiales, repuestos o insumos usados en el
                servicio.
              </p>
            </div>
            <Button
              variant="outline"
              size="xs"
              onClick={handleAddMaterialRow}
              iconName="Plus"
            >
              Agregar material
            </Button>
          </div>

          <div className="space-y-2">
            {materials.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-12 gap-2 items-center"
              >
                <input
                  className="col-span-2 border rounded-md px-2 py-2 text-xs outline-none focus:ring-2 focus:ring-slate-900/20"
                  placeholder="Código"
                  value={row.code}
                  onChange={(e) =>
                    handleMaterialChange(row.id, "code", e.target.value)
                  }
                />
                <input
                  className="col-span-6 border rounded-md px-2 py-2 text-xs outline-none focus:ring-2 focus:ring-slate-900/20"
                  placeholder="Descripción del material"
                  value={row.description}
                  onChange={(e) =>
                    handleMaterialChange(
                      row.id,
                      "description",
                      e.target.value
                    )
                  }
                />
                <input
                  className="col-span-2 border rounded-md px-2 py-2 text-xs outline-none focus:ring-2 focus:ring-slate-900/20"
                  placeholder="Cant."
                  value={row.quantity}
                  onChange={(e) =>
                    handleMaterialChange(
                      row.id,
                      "quantity",
                      e.target.value
                    )
                  }
                />
                <input
                  className="col-span-1 border rounded-md px-2 py-2 text-xs outline-none focus:ring-2 focus:ring-slate-900/20"
                  placeholder="Und."
                  value={row.unit}
                  onChange={(e) =>
                    handleMaterialChange(row.id, "unit", e.target.value)
                  }
                />
                <div className="col-span-1 flex justify-end">
                  <Button
                    variant="outline"
                    size="xs"
                    iconName="Trash2"
                    onClick={() => handleRemoveMaterialRow(row.id)}
                  />
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
