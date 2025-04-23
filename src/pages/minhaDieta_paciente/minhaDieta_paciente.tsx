import React from "react";
import { Link } from "react-router-dom";
import './minhaDieta_paciente.css'; 
import Header from '../../components/headers/header_paciente'; 

export default function MinhaDietaPaciente() {
  return (
    <div className="minha-dieta-container">
      <header className="perfil-header">
      <Header />
        <Link to="/"><button className="logout-button">Logout</button></Link>
      </header>

      <main className="minha-dieta-main">
        <h1>Minha Dieta</h1>
      </main>
    </div>
  );
}
