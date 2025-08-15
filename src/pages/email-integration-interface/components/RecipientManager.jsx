import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const RecipientManager = ({ 
  recipients = [], 
  onRecipientsChange,
  className = '' 
}) => {
  const [newRecipient, setNewRecipient] = useState({
    email: '',
    name: '',
    role: 'client',
    type: 'to'
  });

  const roleOptions = [
    { value: 'supervisor', label: 'Supervisor ASTAP', description: 'Personal de supervisión interno' },
    { value: 'client', label: 'Cliente Principal', description: 'Contacto principal del cliente' },
    { value: 'client-secondary', label: 'Cliente Secundario', description: 'Contacto adicional del cliente' },
    { value: 'management', label: 'Gerencia', description: 'Personal gerencial ASTAP' },
    { value: 'technician', label: 'Técnico', description: 'Personal técnico ASTAP' },
    { value: 'external', label: 'Externo', description: 'Contacto externo o tercero' }
  ];

  const typeOptions = [
    { value: 'to', label: 'Para (TO)', description: 'Destinatario principal' },
    { value: 'cc', label: 'Copia (CC)', description: 'Copia visible' },
    { value: 'bcc', label: 'Copia Oculta (BCC)', description: 'Copia oculta' }
  ];

  const handleAddRecipient = () => {
    if (!newRecipient?.email?.trim()) return;

    const recipient = {
      id: Date.now(),
      email: newRecipient?.email?.trim(),
      name: newRecipient?.name?.trim() || newRecipient?.email?.split('@')?.[0],
      role: newRecipient?.role,
      type: newRecipient?.type,
      addedAt: new Date()?.toISOString()
    };

    const updatedRecipients = [...recipients, recipient];
    onRecipientsChange?.(updatedRecipients);

    // Reset form
    setNewRecipient({
      email: '',
      name: '',
      role: 'client',
      type: 'to'
    });
  };

  const handleRemoveRecipient = (id) => {
    const updatedRecipients = recipients?.filter(r => r?.id !== id);
    onRecipientsChange?.(updatedRecipients);
  };

  const handleInputChange = (field, value) => {
    setNewRecipient(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getRoleIcon = (role) => {
    const icons = {
      supervisor: 'UserCheck',
      client: 'Building',
      'client-secondary': 'Users',
      management: 'Crown',
      technician: 'Wrench',
      external: 'ExternalLink'
    };
    return icons?.[role] || 'User';
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      supervisor: 'bg-primary/10 text-primary',
      client: 'bg-blue-100 text-blue-700',
      'client-secondary': 'bg-blue-50 text-blue-600',
      management: 'bg-purple-100 text-purple-700',
      technician: 'bg-green-100 text-green-700',
      external: 'bg-gray-100 text-gray-700'
    };
    return colors?.[role] || 'bg-gray-100 text-gray-700';
  };

  const getTypeIcon = (type) => {
    const icons = {
      to: 'Mail',
      cc: 'Copy',
      bcc: 'EyeOff'
    };
    return icons?.[type] || 'Mail';
  };

  return (
    <div className={`bg-card rounded-lg border border-border p-6 ${className}`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-secondary/10 rounded-lg">
          <Icon name="Users" size={20} className="text-secondary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Gestión de Destinatarios
          </h3>
          <p className="text-sm text-muted-foreground">
            Administrar lista de contactos para el envío
          </p>
        </div>
      </div>
      {/* Add New Recipient Form */}
      <div className="space-y-4 p-4 bg-muted/30 rounded-lg mb-6">
        <h4 className="text-sm font-medium text-foreground">
          Agregar Nuevo Destinatario
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="contacto@empresa.com"
            value={newRecipient?.email}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            required
          />
          
          <Input
            label="Nombre (Opcional)"
            type="text"
            placeholder="Juan Pérez"
            value={newRecipient?.name}
            onChange={(e) => handleInputChange('name', e?.target?.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Rol"
            options={roleOptions}
            value={newRecipient?.role}
            onChange={(value) => handleInputChange('role', value)}
          />
          
          <Select
            label="Tipo de Destinatario"
            options={typeOptions}
            value={newRecipient?.type}
            onChange={(value) => handleInputChange('type', value)}
          />
        </div>

        <Button
          variant="outline"
          onClick={handleAddRecipient}
          iconName="Plus"
          iconPosition="left"
          disabled={!newRecipient?.email?.trim()}
          className="w-full md:w-auto"
        >
          Agregar Destinatario
        </Button>
      </div>
      {/* Recipients List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-foreground">
            Lista de Destinatarios ({recipients?.length})
          </h4>
          
          {recipients?.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRecipientsChange?.([])}
              iconName="Trash2"
              iconPosition="left"
              className="text-destructive hover:text-destructive"
            >
              Limpiar Todo
            </Button>
          )}
        </div>

        {recipients?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="Users" size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">No hay destinatarios agregados</p>
            <p className="text-xs">Agrega contactos para enviar el reporte</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {recipients?.map((recipient) => (
              <div
                key={recipient?.id}
                className="flex items-center justify-between p-3 bg-background rounded-lg border border-border"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-full">
                    <Icon 
                      name={getRoleIcon(recipient?.role)} 
                      size={14} 
                      className="text-muted-foreground" 
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-foreground truncate">
                        {recipient?.name}
                      </p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(recipient?.role)}`}>
                        {roleOptions?.find(r => r?.value === recipient?.role)?.label}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-xs text-muted-foreground truncate">
                        {recipient?.email}
                      </p>
                      <div className="flex items-center space-x-1">
                        <Icon 
                          name={getTypeIcon(recipient?.type)} 
                          size={12} 
                          className="text-muted-foreground" 
                        />
                        <span className="text-xs text-muted-foreground uppercase">
                          {recipient?.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveRecipient(recipient?.id)}
                  iconName="X"
                  className="text-muted-foreground hover:text-destructive ml-2"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipientManager;