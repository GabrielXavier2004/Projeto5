import React from "react";
import './login_nutricionista.css';
import { Link } from "react-router-dom";
import bg2 from "../content/foto_fundo_login_nutricionista.png";

export default function LoginNutricionista() {
  return (
    <div className="login-page">
      <div
        className="background-image"
        style={{ backgroundImage: `url(${bg2})` }}
      ></div>
      <div className="login-box">
        <h2 className="login-titulo">Login Nutricionista</h2>

        <div className="input-group">
          <label htmlFor="email">EMAIL</label>
          <input id="email" type="text" />
        </div>

        <div className="input-group">
          <label htmlFor="senha">SENHA</label>
          <input id="senha" type="text" />
          <div className="esqueceu-senha">
            <span>Esqueceu a senha?</span>
            <Link to="/" className="botao-clique-aqui2">Clique Aqui.</Link>
          </div>
        </div>

        <Link to="/perfil_nutricionista"><button className="botao-login">LOGIN</button></Link>

        <div className="nao-cadastro">
            <span>Não possui cadastro?</span>
            <Link to="/" className="botao-clique-aqui2">Clique Aqui.</Link>
          </div>
      </div>
    </div>
  );
}
