import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './cadastro_nutricionista.css'
import { collection, addDoc, updateDoc } from "firebase/firestore";
import { db } from "../../components/firebase/firebaseConfig";
import bg2 from "../../content/foto_fundo_cadastro_nutri.jpg";

export default function CadastroNutricionista() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [crn, setCrn] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const navigate = useNavigate();

  const handleCadastro = async () => {
    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    if (!nome || !email || !senha || !confirmarSenha || !crn) {
      setErro("Preencha todos os campos.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "nutricionistas"), {
        nome,
        email,
        senha,
        crn,
      });

      await updateDoc(docRef, {
        id: docRef.id,
      });

      console.log("Nutricionista cadastrado com id:", docRef.id);
      setErro("");
      setSucesso(true);

      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      setErro("Erro ao tentar cadastrar.");
    }
  };

  return (
    <div className="cadastro-page">
      <div
        className="cadastro-background-image"
        style={{ backgroundImage: `url(${bg2})` }}
      ></div>
      <div className="cadastro-box">
        <h2 className="cadastro-titulo">Cadastro Nutricionista</h2>

        <div className="cadastro-input-group">
          <label htmlFor="nome">NOME</label>
          <input id="nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
        </div>

        <div className="cadastro-input-group">
          <label htmlFor="email">EMAIL</label>
          <input id="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="cadastro-input-group">
          <label htmlFor="senha">SENHA</label>
          <input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
        </div>

        <div className="cadastro-input-group">
          <label htmlFor="confirmarSenha">CONFIRMAR SENHA</label>
          <input id="confirmarSenha" type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} />
        </div>

        <div className="cadastro-input-group">
          <label htmlFor="crn">CRN</label>
          <input id="crn" type="text" value={crn} onChange={(e) => setCrn(e.target.value)} />
        </div>

        {erro && <p style={{ color: "red" }}>{erro}</p>}
        {sucesso && <p style={{ color: "green" }}>Cadastro realizado com sucesso!</p>}

        <button onClick={handleCadastro} className="cadastro-botao">CADASTRAR</button>

        <div className="cadastro-voltar-login">
          <span>Já possui cadastro?</span>
          <Link to="/login_nutricionista" className="cadastro-link-login">Fazer login</Link>
        </div>
      </div>
    </div>
  );
}
