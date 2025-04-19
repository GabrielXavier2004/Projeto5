import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Home from "./pages/home";
import LoginPaciente from "./pages/login_paciente";
import LoginNutricionista from "./pages/login_nutricionista"
import PerfilPaciente from "./pages/perfil_paciente";
import PerfilNutricionista from "./pages/perfil_nutricionista";

export default function App() {

  return (
    <Router>
        <Routes> 
          <Route path="/" element={<Home />} />
          <Route path="/login_paciente" element={<LoginPaciente />} />
          <Route path="/login_nutricionista" element={<LoginNutricionista />} />
          <Route path="/perfil_paciente" element={<PerfilPaciente />} />
          <Route path="/perfil_nutricionista" element={<PerfilNutricionista />} />
        </Routes>
    </Router>
  );
}