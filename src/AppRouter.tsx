import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { App } from "./App";
export function AppRouter() {
  return <BrowserRouter>
          <Routes>
            {/* catch-all so App can handle nested routes like /login and /register */}
            <Route path="/*" element={<App />} />
          </Routes>
      </BrowserRouter>;
}