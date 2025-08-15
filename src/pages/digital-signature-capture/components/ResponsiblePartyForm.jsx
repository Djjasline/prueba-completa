import React from 'react';
import Input from '../../../components/ui/Input';

const ResponsiblePartyForm = ({ 
  title,
  data = {},
  onChange,
  disabled = false,
  className = '' 
}) => {
  const handleInputChange = (field, value) => {
    onChange && onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-foreground mb-4">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nombre Completo"
          type="text"
          placeholder="Ingrese nombre completo"
          value={data?.name || ''}
          onChange={(e) => handleInputChange('name', e?.target?.value)}
          disabled={disabled}
          required
        />

        <Input
          label="Cargo/Posición"
          type="text"
          placeholder="Ingrese cargo o posición"
          value={data?.position || ''}
          onChange={(e) => handleInputChange('position', e?.target?.value)}
          disabled={disabled}
          required
        />

        <Input
          label="Número de Teléfono"
          type="tel"
          placeholder="Ingrese número de teléfono"
          value={data?.phone || ''}
          onChange={(e) => handleInputChange('phone', e?.target?.value)}
          disabled={disabled}
          required
        />

        <Input
          label="Email (Opcional)"
          type="email"
          placeholder="Ingrese email"
          value={data?.email || ''}
          onChange={(e) => handleInputChange('email', e?.target?.value)}
          disabled={disabled}
        />
      </div>
      {data?.name && data?.position && (
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <div className="text-sm text-muted-foreground">
            <strong className="text-foreground">{data?.name}</strong> firmará como{' '}
            <strong className="text-foreground">{data?.position}</strong>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponsiblePartyForm;