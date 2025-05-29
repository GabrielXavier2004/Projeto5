import React from 'react';
import './header_paciente.css'; 
import { Link } from "react-router-dom";
import logo from "../../content/logo.png";

const Header: React.FC = () => {
  return (
    <header className="perfil-header">
      <div style={{ display: "flex", alignItems: "center" }}>
        <img src={logo} alt="Logo" className="logo" />
        <nav className="menu">
          <Link to="../../perfil_paciente">Home</Link>
          <Link to={`/minha_dieta/${localStorage.getItem("pacienteId")}`}>Minha Dieta</Link>
          <Link to="../biblioteca_paciente">Biblioteca de Alimentos</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
