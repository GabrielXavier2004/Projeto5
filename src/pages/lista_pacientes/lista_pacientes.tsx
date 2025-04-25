import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../components/firebase/firebaseConfig";
import { Link } from "react-router-dom";
import './lista_pacientes.css';
import HeaderNutri from "../../components/headers/header_nutri";

interface Paciente {
  id: string;
  nome: string;
  cpf: string;
  pacienteId: string;
  modoEdicao?: boolean;
}

export default function ListaPacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const fetchPacientes = async () => {
      const nutricionistaId = localStorage.getItem("nutriId");
      if (!nutricionistaId) return;

      const q = query(collection(db, "pacientes"), where("nutricionistaId", "==", nutricionistaId));
      const querySnapshot = await getDocs(q);

      const lista: Paciente[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Paciente));
      setPacientes(lista);
      setCarregando(false);
    };

    fetchPacientes();
  }, []);

  const ativarEdicao = (id: string) => {
    setPacientes(prev => prev.map(p => p.id === id ? { ...p, modoEdicao: true } : p));
  };

  const salvarEdicao = async (paciente: Paciente) => {
    const ref = doc(db, "pacientes", paciente.id);
    await updateDoc(ref, {
      nome: paciente.nome,
      cpf: paciente.cpf,
    });

    setPacientes(prev =>
      prev.map(p => p.id === paciente.id ? { ...p, modoEdicao: false } : p)
    );
  };

  const handleChange = (id: string, campo: keyof Paciente, valor: string) => {
    setPacientes(prev =>
      prev.map(p => p.id === id ? { ...p, [campo]: valor } : p)
    );
  };

  return (
    <div>
      <HeaderNutri />
      <div className="lista-pacientes-container">
        <div className="lista-pacientes-header">
          <h2>Meus Pacientes</h2>
          <Link to="/cadastro_paciente" className="botao-adicionar">+ Novo Paciente</Link>
        </div>

        {carregando ? (
          <p>Carregando pacientes...</p>
        ) : pacientes.length === 0 ? (
          <p>Nenhum paciente encontrado.</p>
        ) : (
          <ul className="lista-pacientes">
            {pacientes.map((paciente) => (
              <li key={paciente.id} className="paciente-card">
                {paciente.modoEdicao ? (
                  <>
                    <input
                      className="input-editar"
                      value={paciente.nome}
                      onChange={(e) => handleChange(paciente.id, "nome", e.target.value)}
                      placeholder="Nome"
                    />
                    <input
                      className="input-editar"
                      value={paciente.cpf}
                      onChange={(e) => handleChange(paciente.id, "cpf", e.target.value)}
                      placeholder="CPF"
                    />
                    <button className="botao-salvar" onClick={() => salvarEdicao(paciente)}>
                      Salvar
                    </button>
                  </>
                ) : (
                  <>
                    <p><strong>Nome:</strong> {paciente.nome}</p>
                    <p><strong>CPF:</strong> {paciente.cpf}</p>
                    <p><strong>ID do Paciente:</strong> {paciente.pacienteId}</p>
                    <button className="botao-editar" onClick={() => ativarEdicao(paciente.id)}>✏️</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
