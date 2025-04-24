import React, { useEffect, useState } from "react";
import './perfil_nutricionista.css';
import { Link } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../components/firebase/firebaseConfig";

import userIcon from '../../content/user_icon.png';
import pacientesIcon from '../../content/paciente_icon.png';
import iaIcon from '../../content/ia_icon.png';
import agendaIcon from '../../content/agenda_icon.png';
import logo from "../../content/logo.png";

export default function PerfilNutricionista() {
  const [nomeNutri, setNomeNutri] = useState("Carregando...");

  useEffect(() => {
    const fetchNutri = async () => {
      const email = localStorage.getItem("nutriEmail");
      if (!email) return;

      const q = query(collection(db, "nutricionistas"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data();
        setNomeNutri(data.nome || "Nutricionista");
      } else {
        setNomeNutri("Nutricionista");
      }
    };

    fetchNutri();
  }, []);

  return (
    <div className="perfil-container">
      <header className="perfil-header">
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={logo} alt="Logo" className="logo" />
          <nav className="menu">
            <Link to="/home_paciente">Home</Link>
            <Link to="/dieta">Dieta</Link>
            <Link to="/agenda">Agenda</Link>
          </nav>
        </div>
        <Link to="/"><button className="logout-button">Logout</button></Link>
      </header>

      <main className="perfil-main">
        <img src={userIcon} alt="Perfil" className="user-icon" />
        <h2>Doutor {nomeNutri}</h2>

        <div className="card-container">
          <Link to="/cadastro_paciente" className="card">
            <img src={pacientesIcon} alt="Minha Dieta" />
            <span>Pacientes</span>
          </Link>
          <Link to="/ia_paciente" className="card">
            <img src={iaIcon} alt="IA" />
            <span>IA</span>
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
