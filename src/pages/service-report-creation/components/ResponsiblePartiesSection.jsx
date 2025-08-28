import React from "react";
import Input from "../../../components/ui/Input";
import { TECHNICIANS, findTechnician } from "../../../data/technicians";

const ResponsiblePartiesSection = ({ formData, updateFormData }) => {
  // Estado actual (soporta ambas claves por compatibilidad)
  const rp   = formData?.responsibleParties || {};
  const res  = formData?.responsibles || {};
  const astap = rp.astap || res.astap || {};
  const client = rp.client || res.client || {};

  // Utilidad: actualiza una sub-sección ("astap" o "client") en ambas claves
  const setSection = (sectionKey, patch) => {
    // Escribir en responsibleParties
    const nextRP = {
      ...(formData?.responsibleParties || {}),
      [sectionKey]: {
        ...(formData?.responsibleParties?.[sectionKey] || {}),
        ...patch,
      },
    };
    updateFormData("responsibleParties", nextRP);

    // Escribir también en responsibles (compat con validador)
    const nextRes = {
      ...(formData?.responsibles || {}),
      [sectionKey]: {
        ...(formData?.responsibles?.[sectionKey] || {}),
        ...patch,
      },
    };
    updateFormData("responsibles", nextRes);
  };

  const setAstap  = (patch) => setSection("astap", patch);
  const setClient = (patch) => setSection("client", patch);

  return (
    <div className="bg-card rounded-lg border border-border p-6 space-y-8">
      {/* =====================  TÉCNICO ASTAP  ===================== */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Técnico ASTAP</h3>

        {/* Nombre con datalist */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Nombre Completo <span className="text-destructive">*</span>
          </label>
          <input
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            type="text"
            placeholder="Nombre del técnico ASTAP"
            value={astap?.name || ""}
            onChange={(e) => {
              const name = e.target.value;
              setAstap({ name });
              const t = findTechnician(name);
              if (t) setAstap({ name: t.name, phone: t.phone, email: t.email });
            }}
            onBlur={(e) => {
              const t = findTechnician(e.target.value);
              if (t) setAstap({ name: t.name, phone: t.phone, email: t.email });
            }}
            list="tech-list-astap"
            autoComplete="off"
            required
          />
          <datalist id="tech-list-astap">
            {TECHNICIANS.map((t) => (
              <option key={t.name} value={t.name}>
                {t.phone} — {t.email}
              </option>
            ))}
          </datalist>
        </div>

        <Input
          label="Carga/Posición"
          type="text"
          placeholder="Técnico Senior, Especialista, etc."
          value={astap?.position || ""}
          onChange={(e) => setAstap({ position: e.target.value })}
        />
        <Input
          label="Teléfono"
          type="tel"
          placeholder="+57 300 123 4567"
          value={astap?.phone || ""}
          onChange={(e) => setAstap({ phone: e.target.value })}
        />
        <Input
          label="Correo electrónico"
          type="email"
          placeholder="tecnico@astap.com"
          value={astap?.email || ""}
          onChange={(e) => setAstap({ email: e.target.value })}
        />
      </section>

      {/* ============  REPRESENTANTE DEL CLIENTE  ============ */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          Representante del Cliente
        </h3>

        <Input
          label="Nombre del representante del cliente"
          required
          placeholder="Nombre completo"
          value={client?.name || ""}
          onChange={(e) => setClient({ name: e.target.value })}
        />
        <Input
          label="Cargo del representante del cliente"
          required
          placeholder="Cargo/posición"
          value={client?.position || ""}
          onChange={(e) => setClient({ position: e.target.value })}
        />
        <Input
          label="Teléfono del representante del cliente"
          required
          type="tel"
          placeholder="0990000000"
          value={client?.phone || ""}
          onChange={(e) => setClient({ phone: e.target.value })}
        />
        <Input
          label="Correo del representante del cliente"
          type="email"
          placeholder="correo@cliente.com"
          value={client?.email || ""}
          onChange={(e) => setClient({ email: e.target.value })}
        />
      </section>
    </div>
  );
};

export default ResponsiblePartiesSection;
