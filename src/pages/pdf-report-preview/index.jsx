import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// util formateo fecha
const fmt = (iso) => {
  try {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString("es-EC", { day: "2-digit", month: "long", year: "numeric" });
  } catch { return iso; }
};

const Line = () => <div className="h-px bg-border my-4" />;

const Section = ({ title, children }) => (
  <section className="bg-card rounded-lg border border-border p-4 md:p-6 mb-6">
    <h3 className="text-base md:text-lg font-semibold text-foreground mb-3">{title}</h3>
    {children}
  </section>
);

export default function PdfReportPreview() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const rootRef = useRef(null);

  // 1) Trae data de navigate o del localStorage (borrador en curso)
  const reportData = useMemo(() => {
    if (state?.reportData) return state.reportData;
    try {
      const raw = localStorage.getItem("astap-current-report");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [state]);

  // 2) Estado para habilitar el botón cuando está listo
  const [isReady, setIsReady] = useState(false);

  // 3) Espera a que se monte el DOM y carguen imágenes (firmas)
  useEffect(() => {
    if (!reportData) return;
    const el = rootRef.current;
    if (!el) return;

    const imgs = Array.from(el.querySelectorAll("img"));
    if (imgs.length === 0) {
      setIsReady(true);
      return;
    }
    let loaded = 0;
    const done = () => {
      loaded += 1;
      if (loaded >= imgs.length) setIsReady(true);
    };
    imgs.forEach((img) => {
      if (img.complete) done();
      else {
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", done, { once: true });
      }
    });
  }, [reportData]);

  if (!reportData) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10">
        <p className="text-foreground mb-6">No encontré datos del informe.</p>
        <button
          className="inline-flex items-center px-4 py-2 rounded bg-primary text-primary-foreground"
          onClick={() => navigate(-1)}
        >
          Volver
        </button>
      </div>
    );
  }

  const {
    generalInfo,
    equipmentDetails,
    materialsUsage = [],
    beforeTesting = [],
    afterTesting = [],
    activitiesIncidents = {},
    responsibleParties = {},
    digitalSignatures = {}
  } = reportData;

  const genPDF = async () => {
    if (!rootRef.current) return;
    const canvas = await html2canvas(rootRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      windowWidth: rootRef.current.scrollWidth,
      windowHeight: rootRef.current.scrollHeight
    });

    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "pt", "a4");
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();

    // Escalar al ancho de la página
    const ratio = Math.min(pageW / canvas.width, pageH / canvas.height);
    const imgW = canvas.width * ratio;
    const imgH = canvas.height * ratio;

    let y = 0;
    // partir si el contenido es más alto que una página
    if (imgH <= pageH) {
      pdf.addImage(img, "PNG", 0, 0, imgW, imgH);
    } else {
      let remaining = imgH;
      let srcY = 0;
      const pageCanvas = document.createElement("canvas");
      const pageCtx = pageCanvas.getContext("2d");

      pageCanvas.width = canvas.width;
      pageCanvas.height = Math.floor(pageH / ratio);

      while (remaining > 0) {
        pageCtx.clearRect(0, 0, pageCanvas.width, pageCanvas.height);
        pageCtx.drawImage(
          canvas,
          0, srcY, pageCanvas.width, pageCanvas.height,
          0, 0, pageCanvas.width, pageCanvas.height
        );
        const pageImg = pageCanvas.toDataURL("image/png");
        pdf.addImage(pageImg, "PNG", 0, 0, pageW, pageH);

        remaining -= pageCanvas.height;
        srcY += pageCanvas.height;
        if (remaining > 0) pdf.addPage();
      }
    }

    pdf.save(`ASTAP_Reporte_${generalInfo?.internalCode || "SIN-COD"}.pdf`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Vista previa del informe</h1>
        <div className="flex gap-2">
          <button
            className="inline-flex items-center px-4 py-2 rounded border border-input hover:bg-muted"
            onClick={() => navigate(-1)}
          >
            Volver
          </button>
          <button
            disabled={!isReady}
            className={`inline-flex items-center px-4 py-2 rounded ${isReady ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            onClick={genPDF}
            title={isReady ? "Descargar PDF" : "Preparando contenido…"}
          >
            Descargar PDF
          </button>
        </div>
      </div>

      {/* CONTENIDO A IMPRIMIR */}
      <div id="report-root" ref={rootRef} className="bg-white p-4 md:p-6 rounded-lg border border-border">
        <Section title="Información general">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Cliente</p>
              <p className="font-medium">{generalInfo?.client || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Código interno</p>
              <p className="font-medium">{generalInfo?.internalCode || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fecha de servicio</p>
              <p className="font-medium">{fmt(generalInfo?.serviceDate) || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Dirección</p>
              <p className="font-medium">{generalInfo?.address || "—"}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground">Referencia</p>
              <p className="font-medium">{generalInfo?.reference || "—"}</p>
            </div>
          </div>
        </Section>

        <Section title="Equipo intervenido">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div><p className="text-sm text-muted-foreground">Tipo</p><p className="font-medium">{equipmentDetails?.type || "—"}</p></div>
            <div><p className="text-sm text-muted-foreground">Marca</p><p className="font-medium">{equipmentDetails?.brand || "—"}</p></div>
            <div><p className="text-sm text-muted-foreground">Modelo</p><p className="font-medium">{equipmentDetails?.model || "—"}</p></div>
            <div><p className="text-sm text-muted-foreground">N.º serie</p><p className="font-medium">{equipmentDetails?.serialNumber || "—"}</p></div>
            <div><p className="text-sm text-muted-foreground">Año</p><p className="font-medium">{equipmentDetails?.year || "—"}</p></div>
            <div><p className="text-sm text-muted-foreground">VIN/Chasis</p><p className="font-medium">{equipmentDetails?.vinChassis || "—"}</p></div>
            <div><p className="text-sm text-muted-foreground">Placa</p><p className="font-medium">{equipmentDetails?.plateNumber || "—"}</p></div>
            <div><p className="text-sm text-muted-foreground">Horas de trabajo</p><p className="font-medium">{equipmentDetails?.workHours || "—"}</p></div>
            <div><p className="text-sm text-muted-foreground">Kilometraje</p><p className="font-medium">{equipmentDetails?.mileage || "—"}</p></div>
          </div>
        </Section>

        <Section title="Materiales utilizados">
          <div className="w-full border border-border rounded">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-2">Cantidad</th>
                  <th className="text-left p-2">Material</th>
                  <th className="text-left p-2">Código</th>
                </tr>
              </thead>
              <tbody>
                {materialsUsage.length === 0 ? (
                  <tr><td className="p-2" colSpan="3">—</td></tr>
                ) : materialsUsage.map((m) => (
                  <tr key={m.id}>
                    <td className="p-2">{m.quantity || "—"}</td>
                    <td className="p-2">{m.materialName || "—"}</td>
                    <td className="p-2">{m.materialCode || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Pruebas antes del servicio">
          <div className="w-full border border-border rounded">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-2">Parámetro</th>
                  <th className="text-left p-2">Valor</th>
                  <th className="text-left p-2">Unidad</th>
                  <th className="text-left p-2">Observación</th>
                </tr>
              </thead>
              <tbody>
                {beforeTesting.length === 0 ? (
                  <tr><td className="p-2" colSpan="4">—</td></tr>
                ) : beforeTesting.map((r, i) => (
                  <tr key={i}>
                    <td className="p-2">{r.parameter || "—"}</td>
                    <td className="p-2">{r.actualValue || "—"}</td>
                    <td className="p-2">{r.unit || "—"}</td>
                    <td className="p-2">{r.note || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Actividades e incidentes">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Actividades</p>
              <p className="font-medium whitespace-pre-wrap">{activitiesIncidents?.activitiesDescription || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Incidentes</p>
              <p className="font-medium whitespace-pre-wrap">{activitiesIncidents?.incidentsDescription || "—"}</p>
            </div>
          </div>
        </Section>

        <Section title="Pruebas después del servicio">
          <div className="w-full border border-border rounded">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-2">Parámetro</th>
                  <th className="text-left p-2">Valor</th>
                  <th className="text-left p-2">Unidad</th>
                  <th className="text-left p-2">Observación</th>
                </tr>
              </thead>
              <tbody>
                {afterTesting.length === 0 ? (
                  <tr><td className="p-2" colSpan="4">—</td></tr>
                ) : afterTesting.map((r, i) => (
                  <tr key={i}>
                    <td className="p-2">{r.parameter || "—"}</td>
                    <td className="p-2">{r.actualValue || "—"}</td>
                    <td className="p-2">{r.unit || "—"}</td>
                    <td className="p-2">{r.note || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Partes responsables">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="font-semibold mb-1">Técnico ASTAP</p>
              <p>{responsibleParties?.astap?.name || "—"}</p>
              <p className="text-sm text-muted-foreground">{responsibleParties?.astap?.position || "—"}</p>
              <p className="text-sm">{responsibleParties?.astap?.phone || "—"}</p>
              <p className="text-sm">{responsibleParties?.astap?.email || "—"}</p>
              {digitalSignatures?.astap && (
                <>
                  <Line />
                  <img
                    src={digitalSignatures.astap}
                    alt="Firma ASTAP"
                    className="h-32 object-contain"
                  />
                </>
              )}
            </div>

            <div>
              <p className="font-semibold mb-1">Representante del Cliente</p>
              <p>{responsibleParties?.client?.name || "—"}</p>
              <p className="text-sm text-muted-foreground">{responsibleParties?.client?.position || "—"}</p>
              <p className="text-sm">{responsibleParties?.client?.phone || "—"}</p>
              <p className="text-sm">{responsibleParties?.client?.email || "—"}</p>
              {digitalSignatures?.client && (
                <>
                  <Line />
                  <img
                    src={digitalSignatures.client}
                    alt="Firma Cliente"
                    className="h-32 object-contain"
                  />
                </>
              )}
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
