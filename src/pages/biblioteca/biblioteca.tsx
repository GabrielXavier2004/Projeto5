import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../components/firebase/firebaseConfig";
import "./biblioteca.css";
import Header from "../../components/headers/header_paciente";

interface Receita {
  id: string;
  titulo: string;
  ingredientes: string[] | string;
  modoPreparo: string;
  calorias?: string;
  refeicao: string;
}

const opcoesRefeicao = [
  "Café da Manhã",
  "Lanche da Manhã",
  "Almoço",
  "Lanche da Tarde",
  "Jantar",
  "Ceia",
];

export default function ReceitasList() {
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [abertaId, setAbertaId] = useState<string | null>(null);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    const fetchReceitas = async () => {
      const querySnapshot = await getDocs(collection(db, "receitas"));
      const lista: Receita[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Receita[];
      setReceitas(lista);
    };

    fetchReceitas();
  }, []);

  const toggleReceita = (id: string) => {
    setAbertaId(abertaId === id ? null : id);
  };

  const receitasFiltradas = receitas.filter((r) => {
  const titulo = r.titulo?.toLowerCase() ?? "";
  const refeicao = r.refeicao?.toLowerCase() ?? "";
  const buscaLower = busca.toLowerCase();

  return titulo.includes(buscaLower) || refeicao.includes(buscaLower);
});

  return (
    <div className="receitas-container">
    <Header />
      <div className="receitas-header">
        <h2>Receitas Fit</h2>
        <input
          type="text"
          placeholder="Buscar por título ou refeição..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="barra-pesquisa"
        />
      </div>

      {opcoesRefeicao.map((refeicao) => {
        const receitasPorRefeicao = receitasFiltradas.filter(
          (r) => r.refeicao === refeicao
        );

        if (receitasPorRefeicao.length === 0) return null;

        return (
          <div key={refeicao} className="grupo-refeicao">
            <h3>{refeicao}</h3>
            <ul className="lista-receitas">
              {receitasPorRefeicao.map((receita) => (
                <li key={receita.id} className="receita-card">
                  <div
                    className="receita-titulo"
                    onClick={() => toggleReceita(receita.id)}
                  >
                    <span>{receita.titulo}</span>
                    <span
                      className={`seta ${abertaId === receita.id ? "aberta" : ""}`}
                    >
                      ▼
                    </span>
                  </div>

                  {abertaId === receita.id && (
                    <div className="receita-detalhes">
                      <p>
                        <strong>Ingredientes:</strong>
                      </p>
                      <ul>
                        {(typeof receita.ingredientes === "string"
                          ? receita.ingredientes.split(",")
                          : receita.ingredientes
                        ).map((item, index) => (
                          <li key={index}>{item.trim()}</li>
                        ))}
                      </ul>
                      <p>
                        <strong>Modo de preparo:</strong> {receita.modoPreparo}
                      </p>
                      {receita.calorias && (
                        <p>
                          <strong>Calorias:</strong> {receita.calorias}
                        </p>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
