import React from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { TECHNICIANS, findTechnician } from '../../../data/technicians';

const GeneralInformationSection = ({ 
  formData, 
  updateFormData, 
  isCollapsed, 
  onToggleCollapse 
}) => {
  const handleInputChange = (field, value) => {
    updateFormData('generalInfo', { ...formData?.generalInfo, [field]: value });
  };

  // 🔄 Sincroniza con "Partes responsables → Técnico ASTAP"
  const setResponsibleAstap = (patch) => {
    const current = formData?.responsibleParties || {};
    updateFormData('responsibleParties', {
      ...current,
      astap: { ...(current.astap || {}), ...patch },
    });
  };

  // ✅ ACTUALIZA TODO EN UNA SOLA LLAMADA para evitar que se pisen updates
  const applyTechnician = (name) => {
    const t = findTechnician(name);
    if (t) {
      const gi = formData?.generalInfo || {};
      // 1 sola actualización para generalInfo
      updateFormData('generalInfo', {
        ...gi,
        technicalPersonnel: t.name,
        technicalPhone: t.phone,
        technicalEmail: t.email,
      });
      // 1 sola actualización para responsables
      setResponsibleAstap({ name: t.name, phone: t.phone, email: t.email });
      return true;
    }
    // sin match: solo escribimos lo que el usuario teclea en el nombre
    updateFormData('generalInfo', {
      ...(formData?.generalInfo || {}),
      technicalPersonnel: name,
    });
    return false;
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-card">
      <div 
        className="flex items-center justify-between p-6 cursor-pointer"
        onClick={onToggleCollapse}
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
            <Icon name="FileText" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Información General
            </h3>
            <p className="text-sm text-muted-foreground">
              Datos básicos del servicio y cliente
            </p>
          </div>
        </div>
        <Icon 
          name={isCollapsed ? "ChevronDown" : "ChevronUp"} 
          size={20} 
          className="text-muted-foreground" 
        />
      </div>

      {!isCollapsed && (
        <div className="px-6 pb-6 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Input
              label="Cliente"
              type="text"
              placeholder="Nombre del cliente"
              value={formData?.generalInfo?.client || ''}
              onChange={(e) => handleInputChange('client', e?.target?.value)}
              required
            />

            <Input
              label="Código Interno"
              type="text"
              placeholder="Código de referencia interno"
              value={formData?.generalInfo?.internalCode || ''}
              onChange={(e) => handleInputChange('internalCode', e?.target?.value)}
              required
            />

            <Input
              label="Fecha de Servicio"
              type="date"
              value={formData?.generalInfo?.serviceDate || ''}
              onChange={(e) => handleInputChange('serviceDate', e?.target?.value)}
              required
            />

            <Input
              label="Dirección"
              type="text"
              placeholder="Dirección del servicio"
              value={formData?.generalInfo?.address || ''}
              onChange={(e) => handleInputChange('address', e?.target?.value)}
              required
            />

            <Input
              label="Referencia"
              type="text"
              placeholder="Referencia adicional"
              value={formData?.generalInfo?.reference || ''}
              onChange={(e) => handleInputChange('reference', e?.target?.value)}
            />

            {/* Personal Técnico con datalist y normalización del nombre */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-foreground mb-1">
                Personal Técnico <span className="text-destructive">*</span>
              </label>
              <input
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
                style={{ color: 'var(--foreground, #111827)' }}
                type="text"
                placeholder="Nombre del técnico asignado"
                value={formData?.generalInfo?.technicalPersonnel || ''}
                onChange={(e) => applyTechnician(e.target.value)}
                onBlur={(e) => applyTechnician(e.target.value)}
                list="tech-list"
                autoComplete="off"
                required
              />
              <datalist id="tech-list">
                {TECHNICIANS.map((t) => (
                  <option key={t.name} value={t.name}>
                    {t.phone} — {t.email}
                  </option>
                ))}
              </datalist>
            </div>

            <Input
              label="Teléfono del Técnico"
              type="tel"
              placeholder="0998511717"
              value={formData?.generalInfo?.technicalPhone || ''}
              onChange={(e) => handleInputChange('technicalPhone', e?.target?.value)}
            />

            <Input
              label="Correo del Técnico"
              type="email"
              placeholder="smaviles@astap.com"
              value={formData?.generalInfo?.technicalEmail || ''}
              onChange={(e) => handleInputChange('technicalEmail', e?.target?.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralInformationSection;
