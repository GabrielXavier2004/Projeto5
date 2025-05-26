import React, { useEffect, useState } from "react";
import { db } from "../../components/firebase/firebaseConfig";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
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

export default function EvolucaoGraficoPaciente({ pacienteId }: Props) {
  const [evolucoes, setEvolucoes] = useState<Evolucao[]>([]);
  const [pesoIdeal, setPesoIdeal] = useState<number | null>(null);
  const [gorduraIdeal, setGorduraIdeal] = useState<number | null>(null);

  const carregarDados = async () => {
    const q = query(collection(db, "evolucoes"), where("pacienteId", "==", pacienteId));
    const querySnapshot = await getDocs(q);
    const lista: Evolucao[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Evolucao[];
    setEvolucoes(lista.sort((a, b) => a.data.localeCompare(b.data)));
  };

    const formatarData = (data: string): string => {
    if (!data) return "Data inválida";

    const partes = data.split("-");
    return `${partes[2]}/${partes[1]}/${partes[0]}`; // Converte "YYYY-MM-DD" para "DD/MM/YYYY"
  };

  const carregarMetas = async () => {
    const docRef = doc(db, "metas", pacienteId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { pesoIdeal, gorduraIdeal } = docSnap.data();
      setPesoIdeal(pesoIdeal);
      setGorduraIdeal(gorduraIdeal);
    }
  };

  useEffect(() => {
    carregarDados();
    carregarMetas();
  }, [pacienteId]);

  return (
    <div className="evolucao-grafico">
      <h3>Evolução do Paciente</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={evolucoes} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="data" tickFormatter={(data) => formatarData(data)} />
          <YAxis />
          <Tooltip/>
          <Legend />
          <Line type="monotone" dataKey="peso" stroke="#8884d8" name="Peso (kg)" />
          <Line type="monotone" dataKey="gordura" stroke="#82ca9d" name="% Gordura" />

          {pesoIdeal !== null && (
            <Line type="monotone" dataKey={() => pesoIdeal} stroke="red" name="Peso Ideal (kg)" dot={false} strokeDasharray="5 5" />
          )}
          {gorduraIdeal !== null && (
            <Line type="monotone" dataKey={() => gorduraIdeal} stroke="blue" name="Gordura Ideal (%)" dot={false} strokeDasharray="5 5" />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}