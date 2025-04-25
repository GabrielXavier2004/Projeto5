import React, { useEffect, useState } from "react";
import './perfil_paciente.css';
import { Link } from "react-router-dom";
import Header from '../../components/headers/header_paciente';
import userIcon from '../../content/user_icon.png';
import dietaIcon from '../../content/dieta_icon.png';
import iaIcon from '../../content/ia_icon.png';
import agendaIcon from '../../content/agenda_icon.png';

export default function PerfilPaciente() {
  const [nome, setNome] = useState("");

  useEffect(() => {
    const nomePaciente = localStorage.getItem("nome");
    if (nomePaciente) {
      setNome(nomePaciente);
    }
  }, []);

  return (
    <div className="perfil-container">
      <header className="perfil-header">
        <Header />
        <Link to="/"><button className="logout-button">Logout</button></Link>
      </header>

      <main className="perfil-main">
        <img src={userIcon} alt="Perfil" className="user-icon" />
        <h2>Olá {nome || "Paciente"}!</h2>

        <div className="card-container">
          <Link to="/minhaDieta_paciente" className="card">
            <img src={dietaIcon} alt="Minha Dieta" />
            <span>Minha Dieta</span>
          </Link>
          <Link to="/anamnese" className="card">
            <img src={iaIcon} alt="IA" />
            <span>Anamnese</span>
          </Link>
          <Link to="/agenda_paciente" className="card">
            <img src={agendaIcon} alt="Agenda" />
            <span>Agenda</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
