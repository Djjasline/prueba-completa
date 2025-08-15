import React, { useState, useRef, useEffect, forwardRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DocumentPreviewPanel = forwardRef(({ reportData, onZoomChange, currentZoom = 100 }, ref) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(3); 
  const previewRef = useRef(null);

  return (
    <div ref={ref} id="pdf-content" className="flex-1 bg-muted p-6 overflow-hidden">

      {/* Zoom and Page Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Button onClick={() => onZoomChange(currentZoom - 10)} disabled={currentZoom <= 50}>
            -
          </Button>
          <span>{currentZoom}%</span>
          <Button onClick={() => onZoomChange(currentZoom + 10)} disabled={currentZoom >= 150}>
            +
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
            Prev
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
            Next
          </Button>
        </div>
      </div>

      {/* Aquí renderizas tu contenido del preview */}
      <div ref={previewRef} className="bg-white shadow p-4">
        {/* TODO: contenido del reporte */}
        <h1 className="text-xl font-bold">Vista previa del reporte</h1>
        <p>Cliente: {reportData?.generalInfo?.client || '---'}</p>
        <p>Fecha: {reportData?.generalInfo?.date || '---'}</p>
        {/* Agrega aquí el resto de tu contenido dinámico */}
      </div>
    </div>
  );
});

export default DocumentPreviewPanel;
