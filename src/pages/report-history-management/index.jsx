import React from "react";
import { useNavigate } from "react-router-dom";
import { useReports } from "../../context/ReportContext";

const ReportHistoryManagement = () => {
  const { reports, startNewReport, loadReport, deleteReport } = useReports();
  const navigate = useNavigate();

  const handleNew = () => {
    startNewReport();
    navigate("/service-report-creation");
  };

  const handleContinue = (id) => {
    loadReport(id);
    navigate("/service-report-creation");
  };

  const handlePreview = (id) => {
    loadReport(id);
    navigate("/pdf-report-preview");
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900">
            Informes de servicio
          </h1>
          <button
            onClick={handleNew}
            className="px-4 py-2 rounded-md bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
          >
            + Nuevo informe
          </button>
        </div>

        {reports.length === 0 ? (
          <p className="text-sm text-slate-500">
            No tienes informes aún. Haz clic en "Nuevo informe" para crear el
            primero.
          </p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow border">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-3 py-2 text-left">Fecha</th>
                  <th className="px-3 py-2 text-left">Cliente</th>
                  <th className="px-3 py-2 text-left">Código interno</th>
                  <th className="px-3 py-2 text-left">Estado</th>
                  <th className="px-3 py-2 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="px-3 py-2">
                      {r.generalInfo?.serviceDate || "—"}
                    </td>
                    <td className="px-3 py-2">
                      {r.generalInfo?.client || "—"}
                    </td>
                    <td className="px-3 py-2">
                      {r.generalInfo?.internalCode || "—"}
                    </td>
                    <td className="px-3 py-2">
                      {r.status === "completed" ? "Completado" : "Borrador"}
                    </td>
                    <td className="px-3 py-2 space-x-2">
                      <button
                        onClick={() => handleContinue(r.id)}
                        className="px-2 py-1 text-xs border rounded hover:bg-slate-50"
                      >
                        Continuar
                      </button>
                      <button
                        onClick={() => handlePreview(r.id)}
                        className="px-2 py-1 text-xs border rounded hover:bg-slate-50"
                      >
                        PDF
                      </button>
                      <button
                        onClick={() => deleteReport(r.id)}
                        className="px-2 py-1 text-xs border rounded text-red-600 hover:bg-red-50"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportHistoryManagement;
