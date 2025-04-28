import React, { useState } from "react";
import { collection, addDoc, updateDoc } from "firebase/firestore";
import { db } from "../../components/firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import './cadastro_paciente.css';

export default function CadastroPaciente() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const navigate = useNavigate();

  const handleCadastro = async () => {
    if (!nome || !cpf) {
      setErro("Preencha todos os campos.");
      return;
    }

    const nutricionistaId = localStorage.getItem("nutriId");
    if (!nutricionistaId) {
      setErro("Nutricionista não identificado.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "pacientes"), {
        nome,
        cpf,
        nutricionistaId
      });

      await updateDoc(docRef, {
        pacienteId: docRef.id
      });

      setNome("");
      setCpf("");
      setErro("");
      setSucesso(true);

      setTimeout(() => navigate("/lista_paciente"), 1500);
    } catch (error) {
      console.error("Erro ao cadastrar paciente:", error);
      setErro("Erro ao cadastrar paciente.");
    }
  };

  return (
    <div className="cadastro-paciente-container">
      <h2>Cadastrar Novo Paciente</h2>

      <div className="input-group">
        <label>Nome</label>
        <input value={nome} onChange={(e) => setNome(e.target.value)} />
      </div>

      <div className="input-group">
        <label>CPF</label>
        <input value={cpf} onChange={(e) => setCpf(e.target.value)} type="text" />
      </div>

      {erro && <p style={{ color: "red" }}>{erro}</p>}
      {sucesso && <p style={{ color: "green" }}>Paciente cadastrado com sucesso!</p>}

      <button className="botao-cadastrar" onClick={handleCadastro}>
        Cadastrar Paciente
      </button>
    </div>
  );
}