// src/utils/reportStorage.js

const STORAGE_KEY = "astap_reports_v1";

// Lee todos los reportes guardados
export function loadReports() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Error leyendo reports de localStorage", e);
    return [];
  }
}

// Guarda la lista completa
function persist(reports) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch (e) {
    console.error("Error guardando reports en localStorage", e);
  }
}

// Crea un id simple
function generateId() {
  return `r_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

// Crea o actualiza un reporte
export function upsertReport(report) {
  const now = new Date().toISOString();
  let reports = loadReports();

  let next = { ...report };
  if (!next.id) {
    next.id = generateId();
    next.createdAt = now;
  }
  next.updatedAt = now;

  const idx = reports.findIndex((r) => r.id === next.id);
  if (idx >= 0) {
    reports[idx] = next;
  } else {
    reports.push(next);
  }

  persist(reports);
  return next;
}

// Obtiene un reporte por id
export function getReportById(id) {
  return loadReports().find((r) => r.id === id) || null;
}

// Elimina un reporte
export function removeReport(id) {
  const filtered = loadReports().filter((r) => r.id !== id);
  persist(filtered);
}

// Borra todo (por si algún día quieres)
export function clearAllReports() {
  persist([]);
}
