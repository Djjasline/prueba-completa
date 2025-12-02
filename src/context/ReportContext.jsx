// src/context/ReportContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  loadReports,
  upsertReport,
  getReportById,
  removeReport,
} from "../utils/reportStorage";

const ReportContext = createContext(null);

export const useReports = () => {
  const ctx = useContext(ReportContext);
  if (!ctx) throw new Error("useReports must be used inside ReportProvider");
  return ctx;
};

const EMPTY_REPORT = {
  id: null,
  status: "draft", // "draft" | "completed"
  generalInfo: {},
  beforeTesting: [],
  activitiesIncidents: {},
  digitalSignatures: {},
  materials: [],
};

export const ReportProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
  const [currentReport, setCurrentReport] = useState(null);

  // Cargar de localStorage al inicio
  useEffect(() => {
    if (typeof window !== "undefined") {
      const all = loadReports();
      setReports(all);
      if (all.length > 0) {
        setCurrentReport(all[all.length - 1]); // último como actual
      }
    }
  }, []);

  const reloadReports = () => {
    setReports(loadReports());
  };

  // 2° botón “Nuevo informe”
  const startNewReport = () => {
    setCurrentReport({ ...EMPTY_REPORT, id: null });
  };

  // Guardar el reporte actual como borrador
  const saveDraft = (partial) => {
    const merged = {
      ...EMPTY_REPORT,
      ...currentReport,
      ...partial,
      status: "draft",
    };
    const saved = upsertReport(merged);
    setCurrentReport(saved);
    reloadReports();
    return saved;
  };

  // Marcar como completado (cuando se genera y envía, por ejemplo)
  const saveCompleted = (partial) => {
    const merged = {
      ...EMPTY_REPORT,
      ...currentReport,
      ...partial,
      status: "completed",
    };
    const saved = upsertReport(merged);
    setCurrentReport(saved);
    reloadReports();
    return saved;
  };

  // 1° cargar un reporte para seguir editando
  const loadReport = (id) => {
    const r = getReportById(id);
    setCurrentReport(r);
    return r;
  };

  const deleteReport = (id) => {
    removeReport(id);
    reloadReports();
    if (currentReport?.id === id) {
      setCurrentReport(null);
    }
  };

  const value = {
    reports,
    currentReport,
    setCurrentReport,
    startNewReport,
    saveDraft,
    saveCompleted,
    loadReport,
    deleteReport,
  };

  return (
    <ReportContext.Provider value={value}>{children}</ReportContext.Provider>
  );
};
