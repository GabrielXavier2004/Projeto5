import React, { useEffect, useState } from "react";
import { db } from "../../components/firebase/firebaseConfig";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./evolucao_paciente.css";

interface Evolucao {
  id: string;
  data: string;
  peso: number;
  gordura: number;
}

interface Props {
  pacienteId: string;
}

export default function EvolucaoPaciente({ pacienteId }: Props) {
  const [evolucoes, setEvolucoes] = useState<Evolucao[]>([]);
  const [novaData, setNovaData] = useState("");
  const [peso, setPeso] = useState("");
  const [gordura, setGordura] = useState("");
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [pesoIdeal, setPesoIdeal] = useState(Number );
  const [gorduraIdeal, setGorduraIdeal] = useState(Number);


  const carregarDados = async () => {
    const q = query(collection(db, "evolucoes"), where("pacienteId", "==", pacienteId));
    const querySnapshot = await getDocs(q);
    const lista: Evolucao[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Evolucao[];
    setEvolucoes(lista.sort((a, b) => a.data.localeCompare(b.data)));
  };

  useEffect(() => {
    carregarDados();
  }, [pacienteId]);

  const adicionarEvolucao = async () => {
    if (!novaData || !peso || !gordura) return;
    await addDoc(collection(db, "evolucoes"), {
      pacienteId,
      data: novaData,
      peso: parseFloat(peso),
      gordura: parseFloat(gordura),
    });
    setNovaData("");
    setPeso("");
    setGordura("");
    carregarDados();
  };

  const excluir = async (id: string) => {
    await deleteDoc(doc(db, "evolucoes", id));
    carregarDados();
  };

  const salvarEdicao = async (id: string) => {
    const evolucao = evolucoes.find((e) => e.id === id);
    if (!evolucao) return;
    await updateDoc(doc(db, "evolucoes", id), {
      data: evolucao.data,
      peso: evolucao.peso,
      gordura: evolucao.gordura,
    });
    setEditandoId(null);
    carregarDados();
  };

  const salvarMetas = async () => {
    if (!pacienteId) return;
    
    const docRef = doc(db, "metas", pacienteId);
    await setDoc(docRef, { pesoIdeal, gorduraIdeal }, { merge: true });
  };

  useEffect(() => {
    const carregarMetas = async () => {
      const docRef = doc(db, "metas", pacienteId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { pesoIdeal, gorduraIdeal } = docSnap.data();
        setPesoIdeal(pesoIdeal);
        setGorduraIdeal(gorduraIdeal);
      }
    };

    if (pacienteId) carregarMetas();
  }, [pacienteId]);


  const atualizarCampo = (id: string, campo: keyof Evolucao, valor: string) => {
    setEvolucoes((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [campo]: campo === "data" ? valor : parseFloat(valor) } : e))
    );
  };

  return (
    <div className="evolucao-wrapper">
      <div className="evolucao-grafico">
        <h3>Evolução do Paciente</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={evolucoes} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="peso" stroke="#8884d8" name="Peso (kg)" />
            <Line type="monotone" dataKey="gordura" stroke="#82ca9d" name="% Gordura" />
              <Line type="monotone" dataKey={() => pesoIdeal} stroke="red" name="Peso Ideal (kg)" dot={false} strokeDasharray="5 5" />
              <Line type="monotone" dataKey={() => gorduraIdeal} stroke="blue" name="Gordura Ideal (%)" dot={false} strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="cards-grid">
        <div className="card-info">
          <h3>Meta</h3>
          <div className="metas">
            <div>
              <strong>Peso Ideal (Kg):</strong>
                <input 
                  type="number" 
                  value={pesoIdeal} 
                  onChange={(e) => setPesoIdeal(Number(e.target.value))} 
                  className="input-meta"
                />
            </div>
            <div>
              <strong>Gordura Ideal (%):</strong>
              <input 
                type="number" 
                value={gorduraIdeal} 
                onChange={(e) => setGorduraIdeal(Number(e.target.value))}
                className="input-meta"
              />
            </div>
          </div>
          <button className="botao-verde" onClick={salvarMetas}>Salvar Metas</button>
        </div>

        <div className="card-info">
          <h3>Última Entrada</h3>
          {evolucoes.length > 0 ? (
            <>
              <p><strong>Data:</strong> {evolucoes.at(-1)?.data}</p>
              <p><strong>Peso:</strong> {evolucoes.at(-1)?.peso} kg</p>
              <p><strong>Gordura:</strong> {evolucoes.at(-1)?.gordura}%</p>
            </>
          ) : <p>Sem dados ainda.</p>}
        </div>

        <div className="card-info">
          <h3>Dica</h3>
          <p>Consistência na alimentação e nos treinos gera os melhores resultados.</p>
        </div>
      </div>

      <div className="form-evolucao">
        <input
          type="date"
          value={novaData}
          onChange={(e) => setNovaData(e.target.value)}
          placeholder="Data"
        />
        <input
          type="number"
          value={peso}
          onChange={(e) => setPeso(e.target.value)}
          placeholder="Peso (kg)"
        />
        <input
          type="number"
          value={gordura}
          onChange={(e) => setGordura(e.target.value)}
          placeholder="% Gordura"
        />
        <button className="botao-verde" onClick={adicionarEvolucao}>Adicionar</button>
      </div>

      <ul className="lista-evolucao">
        {evolucoes.map((e) => (
          <li key={e.id} className="item-evolucao">
            {editandoId === e.id ? (
              <>
                <input value={e.data} type="date" onChange={(ev) => atualizarCampo(e.id, "data", ev.target.value)} />
                <input value={e.peso} type="number" onChange={(ev) => atualizarCampo(e.id, "peso", ev.target.value)} />
                <input value={e.gordura} type="number" onChange={(ev) => atualizarCampo(e.id, "gordura", ev.target.value)} />
                <button className="botao-verde" onClick={() => salvarEdicao(e.id)}>Salvar</button>
              </>
            ) : (
              <>
                <span>{e.data} - {e.peso}kg - {e.gordura}% de gordura</span>
                <div className="evolucao-acoes">
                  <button className="botao-editar-evo" onClick={() => setEditandoId(e.id)}>✏️</button>
                  <button className="botao-excluir-evo" onClick={() => excluir(e.id)}>🗑️</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
