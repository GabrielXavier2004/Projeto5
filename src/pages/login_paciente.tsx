import React from "react";
import './login_paciente.css';
import bg from '../content/foto_fundo_login_paciente.png'; 
import { Link } from "react-router-dom";

export default function LoginPaciente() {
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
          <input id="cpf" type="text"/>
        </div>
        <div className="input-group">
          <label htmlFor="token">TOKEN</label>
          <input id="token" type="text"/>
        </div>
        <button className="botao-login">LOGIN</button>

        <div className="texto-token">
            <span>Não possui token?</span>
            <Link to="/" className="botao-clique-aqui">Clique Aqui.</Link>
          </div>
      </div>
    </div>
  );
}
