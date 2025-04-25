import React, { useState } from "react";
import './login_nutricionista.css';
import { Link, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../components/firebase/firebaseConfig";
import bg2 from "../../content/foto_fundo_login_nutricionista.png";

export default function LoginNutricionista() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (): Promise<void> => {
    try {
      console.log("Tentando logar com:", email, senha);

      const ref = collection(db, "nutricionistas"); 
      const q = query(ref, where("email", "==", email), where("senha", "==", senha));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        console.log("Login autorizado!");
        const doc = querySnapshot.docs[0];
        localStorage.setItem("nutriId", doc.id);
        localStorage.setItem("nutriEmail", email);
        navigate("/perfil_nutricionista");
      } else {
        setErro("Email ou senha inválidos.");
      }
    } catch (error) {
      console.error("Erro real do Firebase:", error);
      setErro("Erro ao tentar fazer login.");
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

        <button onClick={handleLogin} className="botao-login">LOGIN</button>

        <div className="nao-cadastro">
          <span>Não possui cadastro?</span>
          <Link to="/cadastro_nutricionista" className="botao-clique-aqui2">Clique Aqui.</Link>
        </div>
      </div>
    </div>
  );
}
