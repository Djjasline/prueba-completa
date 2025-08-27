import React from "react";
import Input from "../../../components/ui/Input";
import { TECHNICIANS, findTechnician } from "../../../data/technicians";

const ResponsiblePartiesSection = ({ formData, updateFormData }) => {
  // Estado del técnico ASTAP dentro de responsibleParties
  const astap = formData?.responsibleParties?.astap || {};

  const setAstap = (patch) => {
    updateFormData("responsibleParties", {
      ...(formData?.responsibleParties || {}),
      astap: { ...(formData?.responsibleParties?.astap || {}), ...patch },
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Técnico ASTAP</h3>

      {/* Nombre completo con <datalist> */}
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
    </div>
  );
};

export default ResponsiblePartiesSection;
