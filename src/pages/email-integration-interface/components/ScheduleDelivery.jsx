import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const ScheduleDelivery = ({ 
  onSchedule, 
  onCancel,
  isLoading = false,
  className = '' 
}) => {
  const [scheduleData, setScheduleData] = useState({
    deliveryType: 'immediate',
    scheduledDate: '',
    scheduledTime: '',
    timezone: 'America/Mexico_City',
    recurring: false,
    recurringType: 'weekly',
    recurringEnd: '',
    notifications: true,
    priority: 'normal'
  });

  const deliveryTypeOptions = [
    { 
      value: 'immediate', 
      label: 'Envío Inmediato',
      description: 'Enviar ahora mismo'
    },
    { 
      value: 'scheduled', 
      label: 'Programar Envío',
      description: 'Enviar en fecha y hora específica'
    },
    { 
      value: 'business_hours', 
      label: 'Horario Laboral',
      description: 'Enviar en el próximo horario laboral'
    }
  ];

  const recurringOptions = [
    { value: 'daily', label: 'Diario', description: 'Cada día' },
    { value: 'weekly', label: 'Semanal', description: 'Cada semana' },
    { value: 'monthly', label: 'Mensual', description: 'Cada mes' },
    { value: 'quarterly', label: 'Trimestral', description: 'Cada 3 meses' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Baja', description: 'Prioridad baja' },
    { value: 'normal', label: 'Normal', description: 'Prioridad estándar' },
    { value: 'high', label: 'Alta', description: 'Prioridad alta' },
    { value: 'urgent', label: 'Urgente', description: 'Envío urgente' }
  ];

  const timezoneOptions = [
    { value: 'America/Mexico_City', label: 'México (GMT-6)', description: 'Hora del Centro de México' },
    { value: 'America/Bogota', label: 'Colombia (GMT-5)', description: 'Hora de Colombia' },
    { value: 'America/Lima', label: 'Perú (GMT-5)', description: 'Hora de Perú' },
    { value: 'America/Argentina/Buenos_Aires', label: 'Argentina (GMT-3)', description: 'Hora de Argentina' }
  ];

  const handleInputChange = (field, value) => {
    setScheduleData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSchedule = () => {
    const scheduleConfig = {
      ...scheduleData,
      createdAt: new Date()?.toISOString(),
      id: Date.now()
    };
    
    onSchedule?.(scheduleConfig);
  };

  const getMinDateTime = () => {
    const now = new Date();
    now?.setMinutes(now?.getMinutes() + 5); // Minimum 5 minutes from now
    return now?.toISOString()?.slice(0, 16);
  };

  const getBusinessHoursInfo = () => {
    const now = new Date();
    const currentHour = now?.getHours();
    
    if (currentHour >= 9 && currentHour < 18) {
      return "Se enviará inmediatamente (horario laboral actual)";
    } else if (currentHour < 9) {
      const nextBusinessDay = new Date(now);
      nextBusinessDay?.setHours(9, 0, 0, 0);
      return `Se enviará mañana a las 9:00 AM (${nextBusinessDay?.toLocaleDateString('es-ES')})`;
    } else {
      const nextBusinessDay = new Date(now);
      nextBusinessDay?.setDate(nextBusinessDay?.getDate() + 1);
      nextBusinessDay?.setHours(9, 0, 0, 0);
      return `Se enviará mañana a las 9:00 AM (${nextBusinessDay?.toLocaleDateString('es-ES')})`;
    }
  };

  const isFormValid = () => {
    if (scheduleData?.deliveryType === 'scheduled') {
      return scheduleData?.scheduledDate && scheduleData?.scheduledTime;
    }
    return true;
  };

  return (
    <div className={`bg-card rounded-lg border border-border p-6 ${className}`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-warning/10 rounded-lg">
          <Icon name="Clock" size={20} className="text-warning" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Programar Entrega
          </h3>
          <p className="text-sm text-muted-foreground">
            Configurar cuándo enviar el reporte
          </p>
        </div>
      </div>
      <div className="space-y-6">
        {/* Delivery Type */}
        <Select
          label="Tipo de Entrega"
          options={deliveryTypeOptions}
          value={scheduleData?.deliveryType}
          onChange={(value) => handleInputChange('deliveryType', value)}
          description="Seleccionar cuándo enviar el email"
        />

        {/* Business Hours Info */}
        {scheduleData?.deliveryType === 'business_hours' && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Información de Horario Laboral
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  {getBusinessHoursInfo()}
                </p>
                <p className="text-xs text-blue-600 mt-2">
                  Horario laboral: Lunes a Viernes, 9:00 AM - 6:00 PM
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Scheduled Date & Time */}
        {scheduleData?.deliveryType === 'scheduled' && (
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <h4 className="text-sm font-medium text-foreground">
              Fecha y Hora Programada
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Fecha"
                type="date"
                value={scheduleData?.scheduledDate}
                onChange={(e) => handleInputChange('scheduledDate', e?.target?.value)}
                min={new Date()?.toISOString()?.split('T')?.[0]}
                required
              />
              
              <Input
                label="Hora"
                type="time"
                value={scheduleData?.scheduledTime}
                onChange={(e) => handleInputChange('scheduledTime', e?.target?.value)}
                required
              />
            </div>

            <Select
              label="Zona Horaria"
              options={timezoneOptions}
              value={scheduleData?.timezone}
              onChange={(value) => handleInputChange('timezone', value)}
            />
          </div>
        )}

        {/* Recurring Options */}
        {scheduleData?.deliveryType === 'scheduled' && (
          <div className="space-y-4">
            <Checkbox
              label="Envío Recurrente"
              description="Programar envíos automáticos repetidos"
              checked={scheduleData?.recurring}
              onChange={(e) => handleInputChange('recurring', e?.target?.checked)}
            />

            {scheduleData?.recurring && (
              <div className="space-y-4 p-4 bg-muted/30 rounded-lg ml-6">
                <Select
                  label="Frecuencia"
                  options={recurringOptions}
                  value={scheduleData?.recurringType}
                  onChange={(value) => handleInputChange('recurringType', value)}
                />
                
                <Input
                  label="Fecha de Finalización"
                  type="date"
                  value={scheduleData?.recurringEnd}
                  onChange={(e) => handleInputChange('recurringEnd', e?.target?.value)}
                  min={scheduleData?.scheduledDate || new Date()?.toISOString()?.split('T')?.[0]}
                  description="Dejar vacío para envíos indefinidos"
                />
              </div>
            )}
          </div>
        )}

        {/* Additional Options */}
        <div className="space-y-4 pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-foreground">
            Opciones Adicionales
          </h4>
          
          <Select
            label="Prioridad"
            options={priorityOptions}
            value={scheduleData?.priority}
            onChange={(value) => handleInputChange('priority', value)}
            description="Nivel de prioridad del email"
          />

          <Checkbox
            label="Notificaciones de Estado"
            description="Recibir confirmaciones de entrega y errores"
            checked={scheduleData?.notifications}
            onChange={(e) => handleInputChange('notifications', e?.target?.checked)}
          />
        </div>

        {/* Summary */}
        <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="Calendar" size={16} className="text-accent mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Resumen de Programación
              </p>
              <div className="text-sm text-muted-foreground mt-1 space-y-1">
                {scheduleData?.deliveryType === 'immediate' && (
                  <p>• El email se enviará inmediatamente</p>
                )}
                {scheduleData?.deliveryType === 'business_hours' && (
                  <p>• El email se enviará en el próximo horario laboral</p>
                )}
                {scheduleData?.deliveryType === 'scheduled' && scheduleData?.scheduledDate && (
                  <>
                    <p>• Fecha: {new Date(scheduleData.scheduledDate)?.toLocaleDateString('es-ES')}</p>
                    {scheduleData?.scheduledTime && (
                      <p>• Hora: {scheduleData?.scheduledTime}</p>
                    )}
                    {scheduleData?.recurring && (
                      <p>• Frecuencia: {recurringOptions?.find(r => r?.value === scheduleData?.recurringType)?.label}</p>
                    )}
                  </>
                )}
                <p>• Prioridad: {priorityOptions?.find(p => p?.value === scheduleData?.priority)?.label}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
          <Button
            variant="default"
            onClick={handleSchedule}
            loading={isLoading}
            iconName="Calendar"
            iconPosition="left"
            className="flex-1"
            disabled={!isFormValid()}
          >
            Confirmar Programación
          </Button>
          
          <Button
            variant="outline"
            onClick={onCancel}
            iconName="X"
            iconPosition="left"
            className="flex-1"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleDelivery;