import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";

import ReportHistoryManagement from "./pages/report-history-management";

// 🔹 INSPECCIONES
import InspeccionRoutes from "./app/inspeccion/Routes";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <Routes>
          {/* HOME */}
          <Route path="/" element={<ReportHistoryManagement />} />

          {/* MÓDULO INSPECCIONES */}
          <Route path="/inspeccion/*" element={<InspeccionRoutes />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
