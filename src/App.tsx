import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Home from "./pages/home/home";
import LoginPaciente from "./pages/login_paciente/login_paciente";
import LoginNutricionista from "./pages/login_nutricionista/login_nutricionista"
import PerfilPaciente from "./pages/perfil_paciente/perfil_paciente";
import PerfilNutricionista from "./pages/perfil_nutricionista/perfil_nutricionista";
import MinhaDietaPaciente from "./pages/minhaDieta_paciente/minhaDieta_paciente";
import Sem_Token from "./pages/sem_token/sem_token";
import AnamneseForm from "./pages/anamnse/anamnese_form";
import CadastroNutricionista from "./pages/cadastro_nutricionista/cadastro_nutricionista";
import CadastroPaciente from "./pages/cadastro_paciente/cadastro_paciente";
import ListaPacientes from "./pages/lista_pacientes/lista_pacientes";
import PacienteDetalhes from "./pages/paciente_detalhes/paciente_detalhes";
import ReceitasList from "./pages/biblioteca/biblioteca";

export default function App() {

  return (
    <Router>
        <Routes> 
          <Route path="/" element={<Home />} />
          <Route path="/login_paciente" element={<LoginPaciente />} />
          <Route path="/login_nutricionista" element={<LoginNutricionista />} />
          <Route path="/perfil_paciente" element={<PerfilPaciente />} />
          <Route path="/perfil_nutricionista" element={<PerfilNutricionista />} />
          <Route path="/minha_dieta/:pacienteId" element={<MinhaDietaPaciente />} />
          <Route path="/token" element={<Sem_Token />} />
          <Route path="/anamnese" element={<AnamneseForm />} />
          <Route path="/cadastro_nutricionista" element={<CadastroNutricionista />} />
          <Route path="/cadastro_paciente" element={<CadastroPaciente />} />
          <Route path="/lista_paciente" element={<ListaPacientes />} />
          <Route path="/paciente/:pacienteId" element={<PacienteDetalhes />} />
          <Route path="/biblioteca" element={<ReceitasList />} />
        </Routes>
    </Router>
  );
}