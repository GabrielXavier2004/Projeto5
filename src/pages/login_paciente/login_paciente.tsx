import React, { useState } from "react";
import './login_paciente.css';
import bg from '../../content/foto_fundo_login_paciente.png'; 
import { Link, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../components/firebase/firebaseConfig";

export default function LoginPaciente() {
  const [cpf, setCpf] = useState("");
  const [token, setToken] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const q = query(
        collection(db, "pacientes"),
        where("cpf", "==", cpf),
        where("pacienteId", "==", token)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const paciente = querySnapshot.docs[0];
        const dados = paciente.data();

        localStorage.setItem("pacienteId", paciente.id);
        localStorage.setItem("cpf", dados.cpf);
        localStorage.setItem("nome", dados.nome);

        navigate("/perfil_paciente");
      } else {
        setErro("CPF ou Token inválido.");
      }
    } catch (error) {
      console.error("Erro ao logar paciente:", error);
      setErro("Erro ao tentar fazer login.");
    }
  };

  return (
    <div className="login-page">
      <div
        className="background-image"
        style={{ backgroundImage: `url(${bg})` }} 
      ></div>
      <div className="login-box">
        <h2 className="login-titulo">Login Paciente</h2>

        <div className="input-group">
          <label htmlFor="cpf">CPF</label>
          <input
            id="cpf"
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="token">TOKEN</label>
          <input
            id="token"
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </div>

        {erro && <p style={{ color: "red", marginBottom: 10 }}>{erro}</p>}

        <button className="botao-login" onClick={handleLogin}>LOGIN</button>

        <div className="texto-token">
          <span>Não possui token?</span>
          <Link to="/token" className="botao-clique-aqui">Clique Aqui.</Link>
        </div>
      </div>
    </div>
  );
}
