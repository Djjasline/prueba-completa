import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const EmailComposer = ({ 
  reportData = {}, 
  onSendEmail, 
  onSaveDraft, 
  onScheduleDelivery,
  isLoading = false 
}) => {
  const [emailData, setEmailData] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: `Reporte de Servicio ASTAP - ${reportData?.internalCode || 'REP-001'} - ${new Date()?.toLocaleDateString('es-ES')}`,
    template: 'maintenance',
    customMessage: ''
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const templateOptions = [
    { 
      value: 'maintenance', 
      label: 'Mantenimiento Preventivo',
      description: 'Para servicios de mantenimiento rutinario'
    },
    { 
      value: 'repair', 
      label: 'Reparación Correctiva',
      description: 'Para servicios de reparación y corrección'
    },
    { 
      value: 'inspection', 
      label: 'Inspección Técnica',
      description: 'Para inspecciones y evaluaciones'
    },
    { 
      value: 'emergency', 
      label: 'Servicio de Emergencia',
      description: 'Para servicios urgentes o críticos'
    },
    { 
      value: 'custom', 
      label: 'Mensaje Personalizado',
      description: 'Crear mensaje desde cero'
    }
  ];

  const getTemplateMessage = (template) => {
    const baseInfo = `Estimado/a,

Se adjunta el reporte de servicio técnico realizado por ASTAP con los siguientes detalles:

• Cliente: ${reportData?.clientName || 'N/A'}
• Código Interno: ${reportData?.internalCode || 'N/A'}
• Fecha de Servicio: ${reportData?.serviceDate || new Date()?.toLocaleDateString('es-ES')}
• Dirección: ${reportData?.address || 'N/A'}
• Técnico Responsable: ${reportData?.technicianName || 'N/A'}

`;

    const templates = {
      maintenance: `${baseInfo}RESUMEN DEL SERVICIO:
El mantenimiento preventivo ha sido completado satisfactoriamente según los procedimientos establecidos. Se han realizado todas las verificaciones programadas y el equipo se encuentra en condiciones óptimas de funcionamiento.

PRÓXIMOS PASOS:
• Se recomienda el próximo mantenimiento en la fecha programada
• Cualquier anomalía debe ser reportada inmediatamente
• El equipo cuenta con garantía de servicio por 30 días

Quedamos a su disposición para cualquier consulta adicional.

Atentamente,
Equipo Técnico ASTAP`,

      repair: `${baseInfo}RESUMEN DE LA REPARACIÓN:
Se ha completado exitosamente la reparación correctiva del equipo. Los problemas identificados han sido solucionados y el sistema ha sido probado para garantizar su correcto funcionamiento.

TRABAJOS REALIZADOS:
• Diagnóstico completo del problema
• Reparación de componentes defectuosos
• Pruebas de funcionamiento post-reparación
• Verificación de parámetros operativos

El equipo se encuentra nuevamente operativo y cuenta con garantía de reparación por 90 días.

Atentamente,
Equipo Técnico ASTAP`,

      inspection: `${baseInfo}RESUMEN DE LA INSPECCIÓN:
Se ha completado la inspección técnica programada del equipo. El informe detallado se encuentra adjunto con todas las observaciones y recomendaciones correspondientes.

HALLAZGOS PRINCIPALES:
• Estado general del equipo evaluado
• Identificación de áreas de mejora
• Recomendaciones de mantenimiento
• Cronograma de acciones sugeridas

Para cualquier aclaración sobre los resultados de la inspección, no dude en contactarnos.

Atentamente,
Equipo Técnico ASTAP`,

      emergency: `${baseInfo}RESUMEN DEL SERVICIO DE EMERGENCIA:
Se ha atendido exitosamente la solicitud de servicio de emergencia. El problema crítico ha sido resuelto y el equipo se encuentra nuevamente operativo.

ACCIONES REALIZADAS:
• Respuesta inmediata al llamado de emergencia
• Diagnóstico rápido del problema crítico
• Solución temporal/definitiva implementada
• Verificación de funcionamiento seguro

El servicio de emergencia incluye seguimiento por 48 horas para garantizar la estabilidad del sistema.

Atentamente,
Equipo Técnico ASTAP`,

      custom: ''
    };

    return templates?.[template] || templates?.maintenance;
  };

  const handleInputChange = (field, value) => {
    setEmailData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTemplateChange = (template) => {
    setEmailData(prev => ({
      ...prev,
      template,
      customMessage: template === 'custom' ? prev?.customMessage : getTemplateMessage(template)
    }));
  };

  const handleSend = () => {
    const emailContent = {
      ...emailData,
      message: emailData?.template === 'custom' ? emailData?.customMessage : getTemplateMessage(emailData?.template),
      reportData
    };
    onSendEmail?.(emailContent);
  };

  const handleSaveDraft = () => {
    const draftContent = {
      ...emailData,
      message: emailData?.template === 'custom' ? emailData?.customMessage : getTemplateMessage(emailData?.template),
      reportData,
      savedAt: new Date()?.toISOString()
    };
    onSaveDraft?.(draftContent);
  };

  const handleSchedule = () => {
    const scheduleContent = {
      ...emailData,
      message: emailData?.template === 'custom' ? emailData?.customMessage : getTemplateMessage(emailData?.template),
      reportData
    };
    onScheduleDelivery?.(scheduleContent);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
            <Icon name="Mail" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Composición de Email
            </h3>
            <p className="text-sm text-muted-foreground">
              Configurar envío del reporte de servicio
            </p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          iconName={showAdvanced ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
        >
          Opciones Avanzadas
        </Button>
      </div>
      <div className="space-y-6">
        {/* Recipients */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Para (Destinatarios)"
            type="email"
            placeholder="supervisor@astap.com, cliente@empresa.com"
            value={emailData?.to}
            onChange={(e) => handleInputChange('to', e?.target?.value)}
            required
            description="Separar múltiples emails con comas"
          />
          
          {showAdvanced && (
            <Input
              label="CC (Copia)"
              type="email"
              placeholder="gerencia@astap.com"
              value={emailData?.cc}
              onChange={(e) => handleInputChange('cc', e?.target?.value)}
              description="Copia visible para otros destinatarios"
            />
          )}
        </div>

        {showAdvanced && (
          <Input
            label="CCO (Copia Oculta)"
            type="email"
            placeholder="archivo@astap.com"
            value={emailData?.bcc}
            onChange={(e) => handleInputChange('bcc', e?.target?.value)}
            description="Copia oculta para archivo interno"
          />
        )}

        {/* Subject */}
        <Input
          label="Asunto"
          type="text"
          placeholder="Reporte de Servicio ASTAP"
          value={emailData?.subject}
          onChange={(e) => handleInputChange('subject', e?.target?.value)}
          required
          description="Línea de asunto del email"
        />

        {/* Template Selection */}
        <Select
          label="Plantilla de Mensaje"
          options={templateOptions}
          value={emailData?.template}
          onChange={handleTemplateChange}
          description="Seleccionar tipo de servicio para mensaje automático"
        />

        {/* Message Preview/Editor */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">
            {emailData?.template === 'custom' ? 'Mensaje Personalizado' : 'Vista Previa del Mensaje'}
          </label>
          
          {emailData?.template === 'custom' ? (
            <textarea
              className="w-full h-64 p-4 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Escribir mensaje personalizado..."
              value={emailData?.customMessage}
              onChange={(e) => handleInputChange('customMessage', e?.target?.value)}
            />
          ) : (
            <div className="h-64 p-4 border border-border rounded-lg bg-muted/50 overflow-y-auto">
              <pre className="text-sm text-foreground whitespace-pre-wrap font-sans">
                {getTemplateMessage(emailData?.template)}
              </pre>
            </div>
          )}
          
          <p className="text-xs text-muted-foreground">
            El archivo PDF del reporte se adjuntará automáticamente
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
          <Button
            variant="default"
            onClick={handleSend}
            loading={isLoading}
            iconName="Send"
            iconPosition="left"
            className="flex-1"
            disabled={!emailData?.to?.trim() || !emailData?.subject?.trim()}
          >
            Enviar Email
          </Button>
          
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            iconName="Save"
            iconPosition="left"
            className="flex-1"
          >
            Guardar Borrador
          </Button>
          
          {showAdvanced && (
            <Button
              variant="secondary"
              onClick={handleSchedule}
              iconName="Clock"
              iconPosition="left"
              className="flex-1"
            >
              Programar Envío
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailComposer;