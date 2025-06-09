import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../components/firebase/firebaseConfig";
import "./biblioteca_nutri.css";
import Header from "../../components/headers/header_nutri";
import { Link } from "react-router-dom";

interface Receita {
  id?: string;
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

export default function ReceitasListNutri() {
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [abertaId, setAbertaId] = useState<string | null>(null);
  const [busca, setBusca] = useState("");
  const [formAberto, setFormAberto] = useState(false);
  const [receitaEditando, setReceitaEditando] = useState<Receita>({
    titulo: "",
    ingredientes: "",
    modoPreparo: "",
    refeicao: "",
    calorias: "",
    });
  const [novaReceita, setNovaReceita] = useState<Receita>({
    titulo: "",
    ingredientes: "",
    modoPreparo: "",
    calorias: "",
    refeicao: "",
  });

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

  const adicionarReceita = async () => {
    if (!novaReceita.titulo || !novaReceita.refeicao) return;
    const docRef = await addDoc(collection(db, "receitas"), novaReceita);
    setReceitas([...receitas, { ...novaReceita, id: docRef.id }]);
    setNovaReceita({ titulo: "", ingredientes: "", modoPreparo: "", refeicao: "", calorias: ""  });
  };
  
  const editarReceita = async (id: string) => {
  if (!id) return;

  const receitaRef = doc(db, "receitas", id);

  // Filtrando campos válidos
  const receitaAtualizada = {
    titulo: novaReceita.titulo || "",
    ingredientes: novaReceita.ingredientes || "",
    modoPreparo: novaReceita.modoPreparo || "",
    refeicao: novaReceita.refeicao || "",
  };

  await updateDoc(receitaRef, receitaAtualizada);
  setReceitas(receitas.map(r => (r.id === id ? { ...receitaAtualizada, id } : r)));
};


  const excluirReceita = async (id: string) => {
    const receitaRef = doc(db, "receitas", id);
    await deleteDoc(receitaRef);
    setReceitas(receitas.filter(r => r.id !== id));
  };

  return (
    <body style={{backgroundColor: "#eee"}}> 
      <div>
      <Header />
        <div className="receitas-container" >
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

          <div className="formulario-receita">
          <div
              className="formulario-titulo"
              onClick={() => setFormAberto(!formAberto)}
          >
              <span>Adicionar Nova Receita</span>
              <span>{formAberto ? "▲" : "▼"}</span>
          </div>

          {formAberto && (
              <div className="formulario-campos">
              <input
                  type="text"
                  placeholder="Título"
                  value={novaReceita.titulo}
                  onChange={(e) => setNovaReceita({ ...novaReceita, titulo: e.target.value })}
              />
              <input
                  type="text"
                  placeholder="Ingredientes (separados por vírgula)"
                  value={novaReceita.ingredientes}
                  onChange={(e) => setNovaReceita({ ...novaReceita, ingredientes: e.target.value })}
              />
              <input
                  type="text"
                  placeholder="Modo de preparo"
                  value={novaReceita.modoPreparo}
                  onChange={(e) => setNovaReceita({ ...novaReceita, modoPreparo: e.target.value })}
              />
              <input
                  type="text"
                  placeholder="Calorias (Ex: 120 kcal)"
                  value={novaReceita.calorias}
                  onChange={(e) => setNovaReceita({ ...novaReceita, calorias: e.target.value })}
              />
              <select
                  value={novaReceita.refeicao}
                  onChange={(e) => setNovaReceita({ ...novaReceita, refeicao: e.target.value })}
              >
                  <option value="">Selecione a refeição</option>
                  {opcoesRefeicao.map(opcao => (
                  <option key={opcao} value={opcao}>{opcao}</option>
                  ))}
              </select>
              <button onClick={adicionarReceita} className="botao-add">
                  Adicionar
              </button>
              </div>
          )}
          </div>

          {opcoesRefeicao.map((refeicao) => {
              const receitasFiltradas = receitas
                  .filter(
                  (r) =>
                      r.refeicao === refeicao &&
                      (r.titulo.toLowerCase().includes(busca.toLowerCase()) ||
                      r.refeicao.toLowerCase().includes(busca.toLowerCase()))
                  );

              if (receitasFiltradas.length === 0) return null;

              return (
                  <div key={refeicao} className="grupo-refeicao">
                  <h3>{refeicao}</h3>
                  <ul className="lista-receitas">
                      {receitasFiltradas.map((receita) => (
                      <li key={receita.id} className="receita-card">
                          <div
                          className="receita-titulo"
                          onClick={() => toggleReceita(receita.id ?? "")}
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
                              <p><strong>Modo de preparo:</strong> {receita.modoPreparo}</p>
                              <p><strong>Calorias:</strong> {receita.calorias}</p>
                              <div style={{ display: "flex", gap: "5px" }}>
                              <button
                                  className="botao-delete"
                                  onClick={() => excluirReceita(receita.id!)}
                              >
                                  🗑️
                              </button>
                              </div>
                          </div>
                          )}
                      </li>
                      ))}
                  </ul>
                  </div>
              );
              })}
        </div>
      </div>
    </body>
  );
}