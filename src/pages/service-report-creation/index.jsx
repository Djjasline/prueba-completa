// src/pages/service-report-creation/index.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Icon from "../../components/AppIcon";
import { useReports } from "../../context/ReportContext";

// =====================
//  Objetos base
// =====================
const emptyGeneralInfo = {
  client: "",
  clientContact: "",
  clientEmail: "",
  clientRole: "",
  serviceDate: "",
  internalCode: "",
  address: "",
  reference: "",
  technicalPersonnel: "",
  technicianPhone: "",
  technicianEmail: "",
};

const emptyTestingRow = {
  parameter: "",
  value: "",
};

const emptyActivitiesIncidents = {
  activities: [
    {
      title: "",
      detail: "",
      imageData: null,
    },
  ],
  incidentsDescription: "",
};

const emptyEquipment = {
  unit: "",
  brand: "",
  model: "",
  serial: "",
  plate: "",
  mileageKm: "",
  lifeHours: "",
  manufactureYear: "",
  vin: "",
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
  const [selectedActivityIndex, setSelectedActivityIndex] = useState(0);

  const fileInputRef = useRef(null);

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
          ? existingActivities.activities.map((a) => ({
              title: a.title || "",
              detail: a.detail || "",
              imageData: a.imageData || null,
            }))
          : emptyActivitiesIncidents.activities,
      incidentsDescription: existingActivities.incidentsDescription || "",
    });

    setEquipment({
      ...emptyEquipment,
      ...(r.equipment || {}),
    });
  }, [currentReport]);

  // =====================
  // Handlers generales
  // =====================

  const handleGeneralChange = (field, value) => {
    setGeneralInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleBeforeChange = (index, field, value) => {
    setBeforeTesting((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  const handleAfterChange = (index, field, value) => {
    setAfterTesting((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  const handleActivitiesChange = (field, value) => {
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

  const handleActivityImageUpload = (index, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setActivitiesIncidents((prev) => {
        const list = prev.activities || [];
        const updated = list.map((act, i) =>
          i === index ? { ...act, imageData: dataUrl } : act
        );
        return { ...prev, activities: updated };
      });
    };
    reader.readAsDataURL(file);
  };

  const addActivityRow = () => {
    setActivitiesIncidents((prev) => ({
      ...prev,
      activities: [
        ...(prev.activities || []),
        {
          title: "",
          detail: "",
          imageData: null,
        },
      ],
    }));
    setSelectedActivityIndex((prev) => prev + 1);
  };

  const removeActivityRow = (index) => {
    setActivitiesIncidents((prev) => {
      const list = prev.activities || [];
      if (list.length === 1) return prev;
      const updated = list.filter((_, i) => i !== index);
      return { ...prev, activities: updated };
    });

    setSelectedActivityIndex((prev) => (prev > 0 ? prev - 1 : 0));
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

  // =====================
  // Construir objeto reporte
  // =====================
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
        (a.detail && a.detail.trim() !== "") ||
        a.imageData
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

  // =====================
  // Acciones de botones
  // =====================
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

  const handleBack = () => {
    navigate("/");
  };

  const handleGoToList = () => {
    navigate("/report-history-management");
  };

  // =====================
  // Datos derivados de actividades
  // =====================
  const activitiesList = activitiesIncidents.activities || [];
  const safeIndex =
    activitiesList.length > 0
      ? Math.min(selectedActivityIndex, activitiesList.length - 1)
      : 0;
  const actividadLabel = `Actividad ${safeIndex + 1}`;
  const selectedActivity = activitiesList[safeIndex] || {};

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

        {/* 1. Información general del servicio */}
        <section className="bg-white rounded-xl shadow border p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            1. Información general del servicio
          </h2>
          <p className="text-xs text-slate-500">
            Datos del cliente, contacto, servicio y técnico responsable.
          </p>

          <div className="space-y-4">
            {/* Cliente */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">
                Cliente (empresa) *
              </label>
              <input
                type="text"
                value={generalInfo.client}
                onChange={(e) =>
                  handleGeneralChange("client", e.target.value)
                }
                className="border rounded-md px-3 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-slate-900/20"
                placeholder="Nombre de la empresa cliente"
              />
            </div>

            {/* Contacto + cargo del cliente */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">
                  Contacto del cliente
                </label>
                <input
                  type="text"
                  value={generalInfo.clientContact}
                  onChange={(e) =>
                    handleGeneralChange("clientContact", e.target.value)
                  }
                  className="border rounded-md px-3 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-slate-900/20"
                  placeholder="Nombre de la persona de contacto"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">
                  Cargo del cliente
                </label>
                <input
                  type="text"
                  value={generalInfo.clientRole}
                  onChange={(e) =>
                    handleGeneralChange("clientRole", e.target.value)
                  }
                  className="border rounded-md px-3 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-slate-900/20"
                  placeholder="Cargo o rol de la persona de contacto"
                />
              </div>
            </div>

            {/* Correo del cliente */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">
                Correo del cliente
              </label>
              <input
                type="email"
                value={generalInfo.clientEmail}
                onChange={(e) =>
                  handleGeneralChange("clientEmail", e.target.value)
                }
                className="border rounded-md px-3 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-slate-900/20"
                placeholder="correo@cliente.com"
              />
            </div>

            {/* Fecha de servicio + Código interno */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">
                  Fecha de servicio
                </label>
                <input
                  type="date"
                  value={generalInfo.serviceDate}
                  onChange={(e) =>
                    handleGeneralChange("serviceDate", e.target.value)
                  }
                  className="border rounded-md px-3 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-slate-900/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">
                  Código interno
                </label>
                <input
                  type="text"
                  value={generalInfo.internalCode}
                  onChange={(e) =>
                    handleGeneralChange("internalCode", e.target.value)
                  }
                  className="border rounded-md px-3 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-slate-900/20"
                  placeholder="Identificador interno del servicio"
                />
              </div>
            </div>

            {/* Dirección + referencia */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">
                Dirección
              </label>
              <input
                type="text"
                value={generalInfo.address}
                onChange={(e) =>
                  handleGeneralChange("address", e.target.value)
                }
                className="border rounded-md px-3 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-slate-900/20"
                placeholder="Dirección donde se realiza el servicio"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">
                Referencia
              </label>
              <textarea
                rows={2}
                value={generalInfo.reference}
                onChange={(e) =>
                  handleGeneralChange("reference", e.target.value)
                }
                className="border rounded-md px-3 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-slate-900/20 resize-y"
                placeholder="Puntos de referencia para llegar al sitio"
              />
            </div>

            {/* Datos del técnico */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">
                  Técnico responsable
                </label>
                <input
                  type="text"
                  value={generalInfo.technicalPersonnel}
                  onChange={(e) =>
                    handleGeneralChange("technicalPersonnel", e.target.value)
                  }
                  className="border rounded-md px-3 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-slate-900/20"
                  placeholder="Nombre del técnico ASTAP"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">
                  Teléfono del técnico
                </label>
                <input
                  type="tel"
                  value={generalInfo.technicianPhone}
                  onChange={(e) =>
                    handleGeneralChange("technicianPhone", e.target.value)
                  }
                  className="border rounded-md px-3 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-slate-900/20"
                  placeholder="+593 ..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">
                  Correo del técnico
                </label>
                <input
                  type="email"
                  value={generalInfo.technicianEmail}
                  onChange={(e) =>
                    handleGeneralChange("technicianEmail", e.target.value)
                  }
                  className="border rounded-md px-3 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-slate-900/20"
                  placeholder="tecnico@astap.com"
                />
              </div>
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
              Agregar fila
            </Button>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 bg-slate-100 border-b text-xs font-semibold text-slate-700">
              <div className="col-span-2 flex items-center justify-center border-r py-2">
                Ítem
              </div>
              <div className="col-span-5 flex items-center justify-center border-r py-2">
                Parámetro
              </div>
              <div className="col-span-5 flex items-center justify-center py-2">
                Valor
              </div>
            </div>

            {beforeTesting.map((row, index) => (
              <div
                key={index}
                className="grid grid-cols-12 border-b last:border-b-0 bg-white"
              >
                <div className="col-span-2 flex items-center justify-center border-r text-xs text-slate-700">
                  {index + 1}
                </div>
                <div className="col-span-5 border-r p-2">
                  <input
                    type="text"
                    value={row.parameter}
                    onChange={(e) =>
                      handleBeforeChange(index, "parameter", e.target.value)
                    }
                    className="border rounded-md px-2 py-1 text-xs w-full outline-none focus:ring-2 focus:ring-slate-900/20"
                    placeholder="Parámetro medido"
                  />
                </div>
                <div className="col-span-5 p-2 flex items-center gap-2">
                  <input
                    type="text"
                    value={row.value}
                    onChange={(e) =>
                      handleBeforeChange(index, "value", e.target.value)
                    }
                    className="border rounded-md px-2 py-1 text-xs w-full outline-none focus:ring-2 focus:ring-slate-900/20"
                    placeholder="Valor medido"
                  />
                  {beforeTesting.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeBeforeRow(index)}
                      className="text-[10px] text-red-500 hover:text-red-700 inline-flex items-center"
                    >
                      <Icon name="Trash2" size={12} className="mr-1" />
                      Quitar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Actividades */}
        <section className="bg-white rounded-xl shadow border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                3. Actividades
              </h2>
              <p className="text-xs text-slate-500">
                Registre cada actividad realizada. Puede agregar tantas como sea
                necesario.
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

          {/* Tabla de actividades */}
          <div className="border rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 bg-slate-100 border-b text-xs font-semibold text-slate-700">
              <div className="col-span-2 flex items-center justify-center border-r py-2">
                Artículo
              </div>
              <div className="col-span-10 flex items-center justify-center py-2">
                Descripción de actividades
              </div>
            </div>

            {activitiesList.map((act, index) => (
              <div
                key={index}
                onClick={() => setSelectedActivityIndex(index)}
                className={
                  "cursor-pointer transition-colors " +
                  (index === safeIndex ? "bg-slate-50" : "bg-white")
                }
              >
                {/* fila título */}
                <div className="grid grid-cols-12 border-b">
                  <div className="col-span-2 flex items-center justify-center border-r text-xs font-medium text-slate-700">
                    {index + 1}
                  </div>
                  <div className="col-span-10 p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-slate-700">
                        Título de actividad
                      </label>
                      {activitiesList.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeActivityRow(index);
                          }}
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
                        handleActivityRowChange(index, "title", e.target.value)
                      }
                      className="border rounded-md px-3 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-slate-900/20"
                      placeholder="Título de la actividad"
                    />
                  </div>
                </div>

                {/* fila detalle */}
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
                        handleActivityRowChange(index, "detail", e.target.value)
                      }
                      className="border rounded-md px-3 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-slate-900/20 resize-y"
                      placeholder="Describa el detalle de la actividad (pasos, ajustes realizados, observaciones, etc.)."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Incidentes (solo para registro, no va al PDF) */}
          <div className="space-y-2 pt-4">
            <label className="text-xs font-medium text-slate-700">
              Incidentes
            </label>
            <textarea
              rows={3}
              value={activitiesIncidents.incidentsDescription}
              onChange={(e) =>
                handleActivitiesChange("incidentsDescription", e.target.value)
              }
              className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20 resize-y"
              placeholder="Registra cualquier incidente relevante (si no hubo, puede dejarlo en blanco)."
            />
          </div>

          {/* Cuadro de imagen + botón (actividad seleccionada) */}
          <div className="mt-4 flex justify-end">
            <div className="w-56 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 flex flex-col items-center justify-start px-3 py-3 text-center">
              <span className="text-sm font-semibold text-slate-700 mb-1">
                Imagen de {actividadLabel}
              </span>
              <p className="text-[11px] text-slate-500 mb-2">
                Esta imagen corresponde a la {actividadLabel} seleccionada en la
                tabla.
              </p>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1 text-[11px] rounded-md border border-slate-300 hover:bg-slate-100 inline-flex items-center"
              >
                <Icon name="Camera" size={12} className="mr-1" />
                Tomar foto / Agregar imagen
              </button>

              {selectedActivity.imageData && (
                <div className="mt-2 w-full">
                  <img
                    src={selectedActivity.imageData}
                    alt={`Imagen de ${actividadLabel}`}
                    className="w-full h-24 object-contain border rounded-md bg-white"
                  />
                  <p className="mt-1 text-[10px] text-emerald-700">
                    Imagen guardada para esta actividad.
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleActivityImageUpload(safeIndex, file);
                    e.target.value = "";
                  }
                }}
              />
            </div>
          </div>
        </section>

        {/* 4. Pruebas después del servicio */}
        <section className="bg-white rounded-xl shadow border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                4. Pruebas después del servicio
              </h2>
              <p className="text-xs text-slate-500">
                Registre los parámetros medidos una vez finalizado el servicio.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              iconName="Plus"
              onClick={addAfterRow}
            >
              Agregar fila
            </Button>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 bg-slate-100 border-b text-xs font-semibold text-slate-700">
              <div className="col-span-2 flex items-center justify-center border-r py-2">
                Ítem
              </div>
              <div className="col-span-5 flex items-center justify-center border-r py-2">
                Parámetro
              </div>
              <div className="col-span-5 flex items-center justify-center py-2">
                Valor
              </div>
            </div>

            {afterTesting.map((row, index) => (
              <div
                key={index}
                className="grid grid-cols-12 border-b last:border-b-0 bg-white"
              >
                <div className="col-span-2 flex items-center justify-center border-r text-xs text-slate-700">
                  {index + 1}
                </div>
                <div className="col-span-5 border-r p-2">
                  <input
                    type="text"
                    value={row.parameter}
                    onChange={(e) =>
                      handleAfterChange(index, "parameter", e.target.value)
                    }
                    className="border rounded-md px-2 py-1 text-xs w-full outline-none focus:ring-2 focus:ring-slate-900/20"
                    placeholder="Parámetro medido"
                  />
                </div>
                <div className="col-span-5 p-2 flex items-center gap-2">
                  <input
                    type="text"
                    value={row.value}
                    onChange={(e) =>
                      handleAfterChange(index, "value", e.target.value)
                    }
                    className="border rounded-md px-2 py-1 text-xs w-full outline-none focus:ring-2 focus:ring-slate-900/20"
                    placeholder="Valor medido"
                  />
                  {afterTesting.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAfterRow(index)}
                      className="text-[10px] text-red-500 hover:text-red-700 inline-flex items-center"
                    >
                      <Icon name="Trash2" size={12} className="mr-1" />
                      Quitar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Datos del equipo */}
        <section className="bg-white rounded-xl shadow border p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            5. Datos del equipo
          </h2>
          <p className="text-xs text-slate-500">
            Información del equipo intervenido y sus datos principales.
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">
                Equipo / Unidad
              </label>
              <input
                type="text"
                value={equipment.unit}
                onChange={(e) =>
                  handleEquipmentChange("unit", e.target.value)
                }
                className="border rounded-md px-3 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-slate-900/20"
                placeholder="Descripción del equipo o unidad"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">
                  Marca
                </label>
                <input
                  type="text"
                  value={equipment.brand}
                  onChange={(e) =>
                    handleEquipmentChange("brand", e.target.value)
                  }
                  className="border rounded-md px-3 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-slate-900/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">
                  Modelo
                </label>
                <input
                  type="text"
                  value={equipment.model}
                  onChange={(e) =>
                    handleEquipmentChange("model", e.target.value)
                  }
                  className="border rounded-md px-3 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-slate-900/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">
                  Serie
                </label>
                <input
                  type="text"
                  value={equipment.serial}
                  onChange={(e) =>
                    handleEquipmentChange("serial", e.target.value)
                  }
                  className="border rounded-md px-3 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-slate-900/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">
                Placa / Código interno
              </label>
              <input
                type="text"
                value={equipment.plate}
                onChange={(e) =>
                  handleEquipmentChange("plate", e.target.value)
                }
                className="border rounded-md px-3 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-slate-900/20"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">
                  Recorrido (km)
                </label>
                <input
                  type="number"
                  value={equipment.mileageKm}
                  onChange={(e) =>
                    handleEquipmentChange("mileageKm", e.target.value)
                  }
                  className="border rounded-md px-3 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-slate-900/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">
                  Tiempo de vida útil (horas)
                </label>
                <input
                  type="number"
                  value={equipment.lifeHours}
                  onChange={(e) =>
                    handleEquipmentChange("lifeHours", e.target.value)
                  }
                  className="border rounded-md px-3 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-slate-900/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">
                  Año de fabricación
                </label>
                <input
                  type="number"
                  value={equipment.manufactureYear}
                  onChange={(e) =>
                    handleEquipmentChange("manufactureYear", e.target.value)
                  }
                  className="border rounded-md px-3 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-slate-900/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">
                VIN
              </label>
              <input
                type="text"
                value={equipment.vin}
                onChange={(e) =>
                  handleEquipmentChange("vin", e.target.value)
                }
                className="border rounded-md px-3 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-slate-900/20"
              />
            </div>
          </div>
        </section>

        {/* Barra inferior de acciones */}
        <section className="flex flex-col md:flex-row items-center justify-between gap-3">
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
              variant="outline"
              size="sm"
              iconName="List"
              onClick={handleGoToList}
            >
              Ver listado de informes
            </Button>

            <button
              type="button"
              onClick={handleSaveDraft}
              className="inline-flex items-center text-xs text-slate-600 hover:text-slate-900"
            >
              <Icon name="Save" size={14} className="mr-1" />
              Guardar borrador
            </button>
          </div>

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
