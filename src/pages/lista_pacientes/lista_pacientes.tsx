import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../components/firebase/firebaseConfig";
import { Link } from "react-router-dom";
import "./lista_pacientes.css";

interface Paciente {
  id: string;
  nome: string;
  cpf: string;
  pacienteId: string;
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

  return (
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
              <p><strong>Nome:</strong> {paciente.nome}</p>
              <p><strong>CPF:</strong> {paciente.cpf}</p>
              <p><strong>ID do Paciente:</strong> {paciente.pacienteId}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
