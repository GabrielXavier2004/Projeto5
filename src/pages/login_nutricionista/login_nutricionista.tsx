import React, { useState } from "react";
import './login_nutricionista.css';
import { Link, useNavigate } from "react-router-dom";
import bg2 from "../../content/foto_fundo_login_nutricionista.png";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../components/firebase/firebaseConfig";

export default function LoginNutricionista() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleLoginNutricionista = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      navigate("/perfil_nutricionista");
    } catch (error) {
      console.error("Erro ao logar:", error);
      setErro("Email ou senha inválidos.");
    }
  };
  

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
          <input id="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="input-group">
          <label htmlFor="senha">SENHA</label>
          <input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
          <div className="esqueceu-senha">
            <span>Esqueceu a senha?</span>
            <Link to="/" className="botao-clique-aqui2">Clique Aqui.</Link>
          </div>
        </div>

        {erro && <p style={{ color: "red" }}>{erro}</p>}

        <button onClick={handleLoginNutricionista} className="botao-login">LOGIN</button>

        <div className="nao-cadastro">
          <span>Não possui cadastro?</span>
          <Link to="/" className="botao-clique-aqui2">Clique Aqui.</Link>
        </div>
      </div>
    </div>
  );
}
