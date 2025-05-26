import React from 'react';
import './header_paciente.css'; 
import { Link } from "react-router-dom";


import logo from "../../content/logo.png";

const HeaderNutri: React.FC = () => {
  return (
    <header className="perfil-header">
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link to="/perfil_nutricionista"><img src={logo} alt="Logo" className="logo" /></Link>
          <nav className="menu">
            <Link to="/perfil_nutricionista">Home</Link>
            <Link to="../lista_paciente">Pacientes</Link>
            <Link to="../agenda">Agenda</Link>
          </nav>
        </div>
        <Link to="/"><button className="logout-button">Logout</button></Link>
      </header>
  );
};

export default HeaderNutri;
