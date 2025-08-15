import React from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const SearchAndActions = ({ 
  searchTerm, 
  onSearchChange, 
  onNewReport, 
  onExportAll, 
  onClearHistory,
  selectedCount,
  totalCount 
}) => {
  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-card">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Search Section */}
        <div className="flex-1 max-w-md">
          <Input
            type="search"
            placeholder="Buscar por nombre de archivo..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e?.target?.value)}
            className="w-full"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          {/* Selection Info */}
          {selectedCount > 0 && (
            <div className="flex items-center space-x-2 px-3 py-2 bg-muted rounded-lg">
              <Icon name="CheckSquare" size={16} className="text-primary" />
              <span className="text-sm text-muted-foreground">
                {selectedCount} de {totalCount} seleccionados
              </span>
            </div>
          )}

          {/* Export All */}
          <Button
            variant="outline"
            iconName="Download"
            iconPosition="left"
            onClick={onExportAll}
            className="whitespace-nowrap"
          >
            Exportar Todo
          </Button>

          {/* Clear History */}
          <Button
            variant="destructive"
            iconName="Trash2"
            iconPosition="left"
            onClick={onClearHistory}
            disabled={totalCount === 0}
            className="whitespace-nowrap"
          >
            Limpiar Historial
          </Button>

          {/* New Report */}
          <Button
            variant="default"
            iconName="Plus"
            iconPosition="left"
            onClick={onNewReport}
            className="whitespace-nowrap"
          >
            Nuevo Reporte
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchAndActions;