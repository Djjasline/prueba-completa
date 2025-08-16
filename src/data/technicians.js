// src/data/technicians.js
export const TECHNICIANS = [
  { name: "AVILES SANTIAGO",     phone: "0998511717", email: "smaviles@astap.com" },
  { name: "BRIONES ARIEL",       phone: "0958897066", email: "abriones@astap.com" },
  { name: "CAMPUSANO DIEGO",     phone: "0998739968", email: "serviciosgye@astap.com" },
  { name: "PILLAJO JOSE LUIS",   phone: "0983346583", email: "jpillajo@astap.com" },
];

// Búsqueda flexible (ignora mayúsculas y espacios extra)
export function findTechnicianByName(name) {
  if (!name) return null;
  const norm = s => String(s).trim().toLowerCase();
  const q = norm(name);
  return TECHNICIANS.find(t => norm(t.name) === q) || null;
}
