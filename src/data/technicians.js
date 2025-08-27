// src/data/technicians.js

export const TECHNICIANS = [
  { name: "AVILES SANTIAGO",   phone: "0998511717", email: "smaviles@astap.com" },
  { name: "BRIONES ARIEL",     phone: "0958897066", email: "abriones@astap.com" },
  { name: "CAMPUSANO DIEGO",   phone: "0998739968", email: "serviciosgye@astap.com" },
  { name: "PILLAJO JOSE LUIS", phone: "0983346583", email: "jpillajo@astap.com" },
];

// Coincidencia flexible (exacto, empieza-con o incluye)
export function findTechnician(input) {
  if (!input) return null;
  const q = String(input).trim().toLowerCase();
  return (
    TECHNICIANS.find((t) => {
      const n = t.name.toLowerCase();
      return n === q || n.startsWith(q) || n.includes(q);
    }) || null
  );
}
