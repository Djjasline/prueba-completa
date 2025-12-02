import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Icon from "../../components/AppIcon";
import { useReports } from "../../context/ReportContext";

// =====================
//  Objetos base
// =====================
const emptyGeneralInfo = {
  // Cliente (empresa)
  client: "",
  // Datos de contacto del cliente
  clientContact: "",
  clientEmail: "",
  clientRole: "",
  // Datos del servicio
  serviceDate: "",
  internalCode: "",
  address: "",
  reference: "",
  // Datos del técnico
  technicalPersonnel: "",
  technicianPhone: "",
  technicianEmail: "",
};

const emptyTestingRow = {
  parameter: "",
  value: "",
};

const emptyActivitiesIncidents = {
  // Lista de actividades: cada una con título y detalle
  activities: [
    {
      title: "",
      detail: "",
    },
  ],
  // Resumen de incidentes
  incidentsDescription: "",
};

const emptyEquipment = {
  unit: "",
  brand: "",
  model: "",
  serial: "",
  plate: "",
  location: "",
};

// =====================
//  Componente principal
// =====================
const ServiceReportCreation = () => {
  const navigate = useNavigate();
  const { currentReport, saveDraft, setCurrentReport } = useReports
    ? useReports()
    : { currentReport: null, saveDraft: () => {}, setCurrentReport: () => {} };

  const [generalInfo, setGeneralInfo] = useState(emptyGeneralInfo);
  const [beforeTesting, setBeforeTesting] = useState([emptyTestingRow]);
  const [afterTesting, setAfterTesting] = useState([emptyTestingRow]);
  const [activitiesIncidents, setActivitiesIncidents] = useState(
    emptyActivitiesIncidents
  );
  const [equipment, setEquipment] = useState(emptyEquipment);

  // =====================
  // Cargar borrador si existe
  // =====================
  useEffect(() => {
    if (!currentReport) return;

    const r = currentReport;

    setGeneralInfo({ ...emptyGeneralInfo, ...(r.generalInfo || {}) });

    setBeforeTesting(
      r.beforeTesting && r.beforeTesting.length > 0
        ? r.beforeTesting
        : [emptyTestingRow]
    );

    setAfterTesting(
      r.afterTesting && r.afterTesting.length > 0
        ? r.afterTesting
        : [emptyTestingRow]
    );

    const existingActivities = r.activitiesIncidents || {};
    setActivitiesIncidents({
      activities:
        existingActivities.activities &&
        existingActivities.activities.length > 0
          ? existingActivities.activities
          : emptyActivitiesIncidents.activities,
      incidentsDescription:
        existingActivities.incidentsDescription || "",
    });

    setEquipment({ ...emptyEquipment, ...(r.equipment || {}) });
  }, [currentReport]);

  // =====================
  // Handlers
  // =====================

  const handleGeneralChange = (field, value) => {
    setGeneralInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleBeforeChange = (index, field, value) => {
    setBeforeTesting((prev) =>
      prev.map((row, i) =>
        i === index ? { ...row, [field]: value } : row
      )
    );
  };

  const handleAfterChange = (index, field, value) => {
    setAfterTesting((prev) =>
      prev.map((row, i) =>
        i === index ? { ...row, [field]: value } : row
      )
    );
  };

  const handleActivitiesChange = (field, value) => {
    // Por ahora solo usamos esto para incidentsDescription
    setActivitiesIncidents((prev) => ({ ...prev, [field]: value }));
  };

  const handleActivityRowChange = (index, field, value) => {
    setActivitiesIncidents((prev) => {
      const list = prev.activities || [];
      const updated = list.map((act, i) =>
        i === index ? { ...act, [field]: value } : act
      );
      return { ...prev, activities: updated };
    });
  };

  const addActivityRow = () => {
    setActivitiesIncidents((prev) => ({
      ...prev,
      activities: [
        ...(prev.activities || []),
        {
          title: "",
          detail: "",
        },
      ],
    }));
  };

  const removeActivityRow = (index) => {
    setActivitiesIncidents((prev) => {
      const list = prev.activities || [];
      if (list.length === 1) return prev; // deja siempre al menos una
      const updated = list.filter((_, i) => i !== index);
      return { ...prev, activities: updated };
    });
  };

  const handleEquipmentChange = (field, value) => {
    setEquipment((prev) => ({ ...prev, [field]: value }));
  };

  const addBeforeRow = () =>
    setBeforeTesting((prev) => [...prev, { ...emptyTestingRow }]);

  const removeBeforeRow = (index) =>
    setBeforeTesting((prev) =>
      prev.length === 1 ? prev : prev.filter((_, i) => i !== index)
    );

  const addAfterRow = () =>
    setAfterTesting((prev) => [...prev, { ...emptyTestingRow }]);

  const removeAfterRow = (index) =>
    setAfterTesting((prev) =>
      prev.length === 1 ? prev : prev.filter((_, i) => i !== index)
    );

  // Construir objeto de reporte
  const buildReportObject = () => {
    const cleanedBefore = beforeTesting.filter(
      (r) => r.parameter.trim() !== "" || r.value.trim() !== ""
    );
    const cleanedAfter = afterTesting.filter(
      (r) => r.parameter.trim() !== "" || r.value.trim() !== ""
    );
    const cleanedActivities = (activitiesIncidents.activities || []).filter(
      (a) =>
        (a.title && a.title.trim() !== "") ||
        (a.detail && a.detail.trim() !== "")
    );

    return {
      id: currentReport?.id || Date.now().toString(),
      status: currentReport?.status || "draft",
      generalInfo,
      beforeTesting: cleanedBefore,
      afterTesting: cleanedAfter,
      activitiesIncidents: {
        ...activitiesIncidents,
        activities: cleanedActivities,
      },
      equipment,
      digitalSignatures: currentReport?.digitalSignatures || {
        astap: null,
        client: null,
      },
      createdAt: currentReport?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  const handleSaveDraft = () => {
    const report = buildReportObject();
    try {
      saveDraft && saveDraft(report);
      setCurrentReport && setCurrentReport(report);
      alert("Borrador guardado correctamente.");
    } catch (e) {
      console.error(e);
      alert("Error al guardar el borrador.");
    }
  };

  const handleNextToSignature = () => {
    const report = buildReportObject();
    setCurrentReport && setCurrentReport(report);
    navigate("/digital-signature-capture");
  };

  // Autosave ligero al cambiar datos (solo en memoria del contexto)
  useEffect(() => {
    const report = buildReportObject();
    setCurrentReport && setCurrentReport(report);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generalInfo, beforeTesting, afterTesting, activitiesIncidents, equipment]);

  // =====================
  // Render
  // =====================

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Encabezado superior */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Crear Reporte de Servicio
            </h1>
            <p className="text-sm text-slate-600">
              Complete la información general, las pruebas realizadas, las
              actividades y los datos del equipo antes de pasar a la firma
              digital.
            </p>
          </div>
        </header>

        {/* 1. Información general */}
        <section className="bg-white rounded-xl shadow border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                1. Información general del servicio
              </h2>
              <p className="text-xs text-slate-500">
                Datos del cliente, contacto, servicio y técnico responsable.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cliente (empresa) */}
            <div className="md:col-span-2 flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-700">
                Cliente (empresa) *
              </label>
              <input
                type="text"
                value={generalInfo.client}
                onChange={(e) =>
                  handleGeneralChange("client", e.target.value)
                }
                className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
                placeholder="Nombre de la empresa"
              />
            </div>

            {/* Contacto del cliente */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-700">
                Contacto del cliente
              </label>
              <input
                type="text"
                value={generalInfo.clientContact}
                onChange={(e) =>
                  handleGeneralChange(
                    "clientContact",
                    e.target.value
                  )
                }
                className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
                placeholder="Nombre de la persona de contacto"
              />
            </div>

            {/* Cargo del cliente */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-700">
                Cargo del cliente
              </label>
              <input
                type="text"
                value={generalInfo.clientRole}
                onChange={(e) =>
                  handleGeneralChange("clientRole", e.target.value)
                }
                className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
                placeholder="Ej: Jefe de mantenimiento"
              />
            </div>

            {/* Correo del cliente */}
            <div className="md:col-span-2 flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-700">
                Correo del cliente
              </label>
              <input
                type="email"
                value={generalInfo.clientEmail}
                onChange={(e) =>
                  handleGeneralChange(
                    "clientEmail",
                    e.target.value
                  )
                }
                className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
                placeholder="correo@cliente.com"
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
                  handleGeneralChange(
                    "internalCode",
                    e.target.value
                  )
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
                  handleGeneralChange(
                    "serviceDate",
                    e.target.value
                  )
                }
                className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
              />
            </div>

            {/* Dirección */}
            <div className="md:col-span-2 flex flex-col gap-1">
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
                  handleGeneralChange(
                    "reference",
                    e.target.value
                  )
                }
                className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
                placeholder="Descripción breve del problema o referencia"
              />
            </div>

            {/* Técnico personal */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-700">
                Técnico responsable *
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

        {/* 2. Pruebas antes del servicio */}
        <section className="bg-white rounded-xl shadow border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                2. Pruebas antes del servicio
              </h2>
              <p className="text-xs text-slate-500">
                Registre los parámetros medidos antes de iniciar el servicio.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              iconName="Plus"
              onClick={addBeforeRow}
            >
              Agregar parámetro
            </Button>
          </div>

          <div className="space-y-3">
            {beforeTesting.map((row, index) => (
              <div
                key={`before-${index}`}
                className="grid grid-cols-12 gap-2 items-center"
              >
                <input
                  type="text"
                  className="col-span-5 border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
                  placeholder="Parámetro"
                  value={row.parameter}
                  onChange={(e) =>
                    handleBeforeChange(
                      index,
                      "parameter",
                      e.target.value
                    )
                  }
                />
                <input
                  type="text"
                  className="col-span-5 border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
                  placeholder="Valor"
                  value={row.value}
                  onChange={(e) =>
                    handleBeforeChange(index, "value", e.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => removeBeforeRow(index)}
                  className="col-span-2 inline-flex items-center justify-center rounded-md border border-red-200 px-2 py-2 text-xs text-red-600 hover:bg-red-50"
                >
                  <Icon name="Trash2" size={14} className="mr-1" />
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Pruebas después del servicio */}
        <section className="bg-white rounded-xl shadow border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                3. Pruebas después del servicio
              </h2>
              <p className="text-xs text-slate-500">
                Registre los parámetros medidos después de completar el
                servicio.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              iconName="Plus"
              onClick={addAfterRow}
            >
              Agregar parámetro
            </Button>
          </div>

          <div className="space-y-3">
            {afterTesting.map((row, index) => (
              <div
                key={`after-${index}`}
                className="grid grid-cols-12 gap-2 items-center"
              >
                <input
                  type="text"
                  className="col-span-5 border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
                  placeholder="Parámetro"
                  value={row.parameter}
                  onChange={(e) =>
                    handleAfterChange(
                      index,
                      "parameter",
                      e.target.value
                    )
                  }
                />
                <input
                  type="text"
                  className="col-span-5 border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
                  placeholder="Valor"
                  value={row.value}
                  onChange={(e) =>
                    handleAfterChange(index, "value", e.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => removeAfterRow(index)}
                  className="col-span-2 inline-flex items-center justify-center rounded-md border border-red-200 px-2 py-2 text-xs text-red-600 hover:bg-red-50"
                >
                  <Icon name="Trash2" size={14} className="mr-1" />
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Actividades (tabla con ítems) */}
        <section className="bg-white rounded-xl shadow border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                4. Actividades
              </h2>
              <p className="text-xs text-slate-500">
                Registre cada actividad realizada. Puede agregar tantos ítems
                como sea necesario.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              iconName="Plus"
              onClick={addActivityRow}
            >
              Agregar actividad
            </Button>
          </div>

          <div className="border rounded-lg overflow-hidden">
            {/* Encabezado de tabla */}
            <div className="grid grid-cols-12 bg-slate-100 border-b text-xs font-semibold text-slate-700">
              <div className="col-span-2 flex items-center justify-center border-r py-2">
                Ítem
              </div>
              <div className="col-span-10 flex items-center justify-center py-2">
                Descripción de actividades
              </div>
            </div>

            {/* Filas de actividades */}
            {activitiesIncidents.activities.map((act, index) => (
              <React.Fragment key={index}>
                {/* Fila título */}
                <div className="grid grid-cols-12 border-b">
                  <div className="col-span-2 flex items-center justify-center border-r text-xs font-medium text-slate-700">
                    {index + 1}
                  </div>
                  <div className="col-span-10 p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-slate-700">
                        Título de actividad
                      </label>
                      {activitiesIncidents.activities.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeActivityRow(index)}
                          className="inline-flex items-center text-[10px] text-red-500 hover:text-red-700"
                        >
                          <Icon name="Trash2" size={12} className="mr-1" />
                          Eliminar
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={act.title}
                      onChange={(e) =>
                        handleActivityRowChange(
                          index,
                          "title",
                          e.target.value
                        )
                      }
                      className="border rounded-md px-3 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-slate-900/20"
                      placeholder="Título de la actividad"
                    />
                  </div>
                </div>

                {/* Fila detalle */}
                <div className="grid grid-cols-12 border-b last:border-b-0">
                  <div className="col-span-2 flex items-start justify-center border-r text-xs text-slate-700 pt-3">
                    {`${index + 1}.1`}
                  </div>
                  <div className="col-span-10 p-3 space-y-1">
                    <label className="text-xs font-medium text-slate-700">
                      Detalle de la actividad
                    </label>
                    <textarea
                      rows={3}
                      value={act.detail}
                      onChange={(e) =>
                        handleActivityRowChange(
                          index,
                          "detail",
                          e.target.value
                        )
                      }
                      className="border rounded-md px-3 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-slate-900/20 resize-y"
                      placeholder="Describa el detalle de la actividad (pasos, ajustes realizados, observaciones, etc.)."
                    />
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* Incidentes (campo separado) */}
          <div className="space-y-2 pt-4 border-t">
            <label className="text-xs font-medium text-slate-700">
              Incidentes
            </label>
            <textarea
              rows={3}
              value={activitiesIncidents.incidentsDescription}
              onChange={(e) =>
                handleActivitiesChange(
                  "incidentsDescription",
                  e.target.value
                )
              }
              className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20 resize-y"
              placeholder="Registra cualquier incidente relevante (si no hubo, puede dejarlo en blanco)."
            />
          </div>
        </section>

        {/* 5. Datos del equipo */}
        <section className="bg-white rounded-xl shadow border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                5. Datos del equipo
              </h2>
              <p className="text-xs text-slate-500">
                Información de la unidad/equipo sobre el cual se realizó el
                servicio.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-700">
                Equipo / Unidad
              </label>
              <input
                type="text"
                value={equipment.unit}
                onChange={(e) =>
                  handleEquipmentChange("unit", e.target.value)
                }
                className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
                placeholder="Nombre o identificación del equipo"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-700">
                Marca
              </label>
              <input
                type="text"
                value={equipment.brand}
                onChange={(e) =>
                  handleEquipmentChange("brand", e.target.value)
                }
                className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-700">
                Modelo
              </label>
              <input
                type="text"
                value={equipment.model}
                onChange={(e) =>
                  handleEquipmentChange("model", e.target.value)
                }
                className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-700">
                Serie
              </label>
              <input
                type="text"
                value={equipment.serial}
                onChange={(e) =>
                  handleEquipmentChange("serial", e.target.value)
                }
                className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-700">
                Placa / Código interno
              </label>
              <input
                type="text"
                value={equipment.plate}
                onChange={(e) =>
                  handleEquipmentChange("plate", e.target.value)
                }
                className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
              />
            </div>

            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-xs font-medium text-slate-700">
                Ubicación / Área
              </label>
              <input
                type="text"
                value={equipment.location}
                onChange={(e) =>
                  handleEquipmentChange(
                    "location",
                    e.target.value
                  )
                }
                className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
                placeholder="Ej: Planta norte, pozo 3, sala de bombas"
              />
            </div>
          </div>
        </section>

        {/* Barra inferior de acciones */}
        <section className="flex flex-col md:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="inline-flex items-center text-xs text-slate-600 hover:text-slate-900"
          >
            <Icon name="Save" size={14} className="mr-1" />
            Guardar borrador
          </button>

          <Button
            size="sm"
            iconName="ArrowRight"
            iconPosition="right"
            onClick={handleNextToSignature}
          >
            Continuar en Firma Digital
          </Button>
        </section>
      </div>
    </div>
  );
};

export default ServiceReportCreation;
