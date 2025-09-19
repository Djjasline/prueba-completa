import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const PDFReportPreview = () => {
  const captureRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Recibimos los datos del reporte desde ServiceReportCreation
  const report = location.state?.reportData || {};

  const handleDownloadPdf = async () => {
    if (!captureRef.current) return;

    const canvas = await html2canvas(captureRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = 210;

    // 🔹 Encabezado corporativo
    const headerImg = new Image();
    headerImg.src = "/assets/encabezado.jpg"; // asegúrate de tenerlo en /public/assets
    pdf.addImage(headerImg, "JPEG", 0, 0, pageWidth, 30);

    // 🔹 Contenido del reporte debajo del encabezado
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 10, 40, imgWidth, imgHeight);

    pdf.save(`ASTAP_Reporte_${report?.generalInfo?.internalCode || "sin-codigo"}.pdf`);
  };

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <h1 className="text-2xl font-bold mb-4">Vista previa del informe</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Revisar el documento antes de generar el PDF final
      </p>

      {/* Contenedor de vista previa */}
      <div
        ref={captureRef}
        className="bg-white shadow-lg rounded-lg p-6 border border-border space-y-6"
      >
        {/* Información General */}
        <section>
          <h2 className="text-lg font-semibold mb-2">Información del reporte</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <p><strong>Cliente:</strong> {report?.generalInfo?.client || "---"}</p>
            <p><strong>Código interno:</strong> {report?.generalInfo?.internalCode || "---"}</p>
            <p><strong>Fecha de servicio:</strong> {report?.generalInfo?.serviceDate || "---"}</p>
            <p><strong>Dirección:</strong> {report?.generalInfo?.address || "---"}</p>
            <p><strong>Referencia:</strong> {report?.generalInfo?.reference || "---"}</p>
            <p><strong>Técnico:</strong> {report?.generalInfo?.technicalPersonnel || "---"}</p>
          </div>
        </section>

        {/* Equipo */}
        <section>
          <h2 className="text-lg font-semibold mb-2">Equipo intervenido</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <p><strong>Tipo:</strong> {report?.equipmentDetails?.type || "---"}</p>
            <p><strong>Marca:</strong> {report?.equipmentDetails?.brand || "---"}</p>
            <p><strong>Modelo:</strong> {report?.equipmentDetails?.model || "---"}</p>
            <p><strong>Serie:</strong> {report?.equipmentDetails?.serialNumber || "---"}</p>
            <p><strong>Año:</strong> {report?.equipmentDetails?.year || "---"}</p>
            <p><strong>Horas de trabajo:</strong> {report?.equipmentDetails?.workHours || "---"}</p>
          </div>
        </section>

        {/* Pruebas antes */}
        <section>
          <h2 className="text-lg font-semibold mb-2">Pruebas antes del servicio</h2>
          {report?.beforeTesting?.length > 0 ? (
            <ul className="list-disc pl-6 text-sm">
              {report.beforeTesting.map((test, i) => (
                <li key={i}>
                  {test.parameter}: esperado {test.expectedValue}, medido {test.actualValue}
                </li>
              ))}
            </ul>
          ) : <p>No registradas</p>}
        </section>

        {/* Actividades e incidentes */}
        <section>
          <h2 className="text-lg font-semibold mb-2">Actividades e Incidentes</h2>
          <p><strong>Actividades:</strong> {report?.activitiesIncidents?.activitiesDescription || "Sin actividades"}</p>
          <p><strong>Incidentes:</strong> {report?.activitiesIncidents?.incidentsDescription || "Sin incidentes"}</p>
        </section>

        {/* Pruebas después */}
        <section>
          <h2 className="text-lg font-semibold mb-2">Pruebas después del servicio</h2>
          {report?.afterTesting?.length > 0 ? (
            <ul className="list-disc pl-6 text-sm">
              {report.afterTesting.map((test, i) => (
                <li key={i}>
                  {test.parameter}: esperado {test.expectedValue}, medido {test.actualValue}
                </li>
              ))}
            </ul>
          ) : <p>No registradas</p>}
        </section>

        {/* Materiales */}
        <section>
          <h2 className="text-lg font-semibold mb-2">Materiales utilizados</h2>
          {report?.materialsUsage?.length > 0 ? (
            <table className="w-full text-sm border">
              <thead className="bg-muted">
                <tr>
                  <th className="border px-2 py-1">Cantidad</th>
                  <th className="border px-2 py-1">Material</th>
                  <th className="border px-2 py-1">Código</th>
                </tr>
              </thead>
              <tbody>
                {report.materialsUsage.map((m, i) => (
                  <tr key={i}>
                    <td className="border px-2 py-1">{m.quantity}</td>
                    <td className="border px-2 py-1">{m.materialName}</td>
                    <td className="border px-2 py-1">{m.materialCode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p>No hay materiales registrados</p>}
        </section>

        {/* Responsables */}
        <section>
          <h2 className="text-lg font-semibold mb-2">Partes responsables</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-medium">Técnico ASTAP</h3>
              <p>{report?.responsibleParties?.astap?.name || "---"}</p>
              <p>{report?.responsibleParties?.astap?.position || "---"}</p>
              <p>{report?.responsibleParties?.astap?.phone || "---"}</p>
              <p>{report?.responsibleParties?.astap?.email || "---"}</p>
            </div>
            <div>
              <h3 className="font-medium">Representante del Cliente</h3>
              <p>{report?.responsibleParties?.client?.name || "---"}</p>
              <p>{report?.responsibleParties?.client?.position || "---"}</p>
              <p>{report?.responsibleParties?.client?.phone || "---"}</p>
              <p>{report?.responsibleParties?.client?.email || "---"}</p>
            </div>
          </div>
        </section>

        {/* Firmas */}
        <section>
          <h2 className="text-lg font-semibold mb-2">Firmas</h2>
          <div className="flex gap-12">
            {report?.digitalSignatures?.astap && (
              <div>
                <p className="text-sm font-medium">Firma ASTAP</p>
                <img src={report.digitalSignatures.astap} alt="Firma ASTAP" className="h-20" />
              </div>
            )}
            {report?.digitalSignatures?.client && (
              <div>
                <p className="text-sm font-medium">Firma Cliente</p>
                <img src={report.digitalSignatures.client} alt="Firma Cliente" className="h-20" />
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded bg-muted text-foreground"
        >
          Volver
        </button>
        <button
          onClick={handleDownloadPdf}
          className="px-4 py-2 rounded bg-primary text-primary-foreground"
        >
          Descargar PDF
        </button>
      </div>
    </div>
  );
};

export default PDFReportPreview;
