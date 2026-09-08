import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import App from "./App"
import Dashboard from "./Dashboard"
import Create from "./Create"
import Landing from "./Landing"
import Success from "./Success"
import Privacy from "./Privacy"
import Promise from "./Promise"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/camera" element={<App />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<Create />} />
        <Route path="/success" element={<Success />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/promise" element={<Promise />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)