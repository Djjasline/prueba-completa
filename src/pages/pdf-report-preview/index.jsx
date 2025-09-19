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
  const pageHeight = 297;

  // 🔹 Insertamos encabezado corporativo
  const headerImg = new Image();
  headerImg.src = "/assets/encabezado.jpg"; // la ruta desde /public
  pdf.addImage(headerImg, "JPEG", 0, 0, pageWidth, 30); // ancho total, altura 30mm aprox

  // 🔹 Insertamos el contenido del reporte debajo del encabezado
  const imgWidth = pageWidth - 20;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  pdf.addImage(imgData, "PNG", 10, 40, imgWidth, imgHeight); // nota: inicia en y=40 para no tapar encabezado

  pdf.save(`ASTAP_Reporte_${report?.generalInfo?.internalCode || "sin-codigo"}.pdf`);
};
