// src/pages/service-report-creation/index.jsx
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
  const [selectedActivityIndex, setSelectedActivityIndex] = useState(0);

  // =====================
  // Cargar borrador si existe (solo UNA VEZ)
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
    // seleccionar automáticamente la nueva
    setSelectedActivityIndex((prevIndex) => prevIndex + 1);
  };

  const removeActivityRow = (index) => {
    setActivitiesIncidents((prev) => {
      const list = prev.activities || [];
      if (list.length === 1) return prev; // dejar al menos una
      const updated = list.filter((_, i) => i !== index);
      return { ...prev, activities: updated };
    });

    setSelectedActivityIndex((prev) =>
      prev > 0 ? prev - 1 : 0
    );
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

  // ================
