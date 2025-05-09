import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../components/firebase/firebaseConfig";
import EvolucaoPaciente from "../../components/evolucao/evolucao_paciente";
import "./paciente_detalhes.css";
import HeaderNutri from "../../components/headers/header_nutri";

export default function PacienteDetalhes() {
  const { pacienteId } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState<any>(null);
  const [anamnese, setAnamnese] = useState<any>(null);
  const [mostrarAnamneseCompleta, setMostrarAnamneseCompleta] = useState(false);
  const [editandoAnamnese, setEditandoAnamnese] = useState(false);
  const [anamneseEditada, setAnamneseEditada] = useState<any>({});

  const habilitarEdicaoAnamnese = () => {
    setEditandoAnamnese(true);
    setAnamneseEditada({ ...anamnese });
  };

  const salvarAnamneseEditada = async () => {
    try {
      const docRef = query(collection(db, "anamneses"), where("pacienteId", "==", pacienteId));
      const snapshot = await getDocs(docRef);
      if (!snapshot.empty) {
        const id = snapshot.docs[0].id;
        const ref = doc(db, "anamneses", id);
        await updateDoc(ref, {
          respostas: anamneseEditada,
        });
        setAnamnese(anamneseEditada);
        setEditandoAnamnese(false);
        alert("Anamnese atualizada com sucesso.");
      }
    } catch (error) {
      console.error("Erro ao atualizar anamnese:", error);
      alert("Erro ao atualizar anamnese.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const pacienteQuery = query(collection(db, "pacientes"), where("pacienteId", "==", pacienteId));
      const pacienteSnapshot = await getDocs(pacienteQuery);
      if (!pacienteSnapshot.empty) {
        setPaciente(pacienteSnapshot.docs[0].data());
      }

      const anamneseQuery = query(collection(db, "anamneses"), where("pacienteId", "==", pacienteId));
      const anamneseSnapshot = await getDocs(anamneseQuery);
      if (!anamneseSnapshot.empty) {
        setAnamnese(anamneseSnapshot.docs[0].data().respostas);
      }
    };

    fetchData();
  }, [pacienteId]);

  const dietaExemplo: Record<string, string[]> = {
    "Café da Manhã": ["Ovos e pão integral", "Iogurte com granola", "Panqueca fit", "Smoothie de banana", "Pão com cottage", "Tapioca com ovo", "Frutas com aveia"],
    "Lanche da Manhã": ["Banana", "Maçã", "Iogurte", "Pêssego", "Castanhas", "Barra de cereal", "Uvas"],
    "Almoço": ["Frango + arroz + salada", "Carne moída + purê + brócolis", "Peixe + arroz integral + legumes", "Frango + macarrão + cenoura", "Bife + arroz + feijão + salada", "Strogonoff + batata doce", "Omelete + salada"],
    "Lanche da Tarde": ["Torradas com pasta de amendoim", "Frutas com iogurte", "Bolinho integral", "Banana com aveia", "Pão integral com queijo", "Vitamina", "Tapioca"],
    "Jantar": ["Sopa de legumes", "Frango grelhado + legumes", "Omelete + salada", "Atum + arroz + salada", "Wrap saudável", "Macarrão integral", "Tapioca com frango"],
    "Ceia": ["Chá com bolacha integral", "Iogurte", "Fruta leve", "Oleaginosas", "Shake leve", "Maçã", "Banana"]
  };

  return (
    <div className="container-paciente-detalhes">
    <HeaderNutri/>
    <div className="detalhes-container">
        <div className="topo-paciente">
          <h2>{paciente?.nome}</h2>
          <p><strong>CPF:</strong> {paciente?.cpf}</p>
          <p><strong>ID:</strong> {paciente?.pacienteId}</p>
          <button onClick={() => navigate(-1)} className="btn-voltar">Voltar</button>
        </div>

        <div className="cards-topo">
          {/* Card Anamnese */}
          <div className="card-info">
            <h3>Anamnese Resumida</h3>
            {anamnese ? (
              <>
                <ul className="resumo-anamnese">
                  <li><strong>Idade:</strong> {anamnese.idade}</li>
                  <li><strong>Alergias:</strong> {anamnese.temAlergia === "sim" ? anamnese.temAlergiaTexto : "Não"}</li>
                  <li><strong>Doenças:</strong> {anamnese.doencas}</li>
                  <li><strong>Medicamentos:</strong> {anamnese.usaMedicamentos === "sim" ? anamnese.usaMedicamentosTexto : "Não"}</li>
                  <li><strong>Atividade Física:</strong> {anamnese.atividadeFisica === "sim" ? anamnese.atividadeFisicaTexto : "Não pratica"}</li>
                </ul>

                <div style={{textAlign:"center"}}>
                  <button
                    className="botao-ver-mais"
                    onClick={() => setMostrarAnamneseCompleta(!mostrarAnamneseCompleta)}
                  >
                    {mostrarAnamneseCompleta ? "Ver menos" : "Ver mais"}
                  </button>
                </div>

                {mostrarAnamneseCompleta && (
                  <div className="anamnese-completa">
                    <ul>
                      {Object.entries(editandoAnamnese ? anamneseEditada : anamnese).map(([chave, valor]) => (
                        <li key={chave}>
                          <strong>{chave}:</strong>{" "}
                          {editandoAnamnese ? (
                            <input
                              value={anamneseEditada[chave]}
                              onChange={(e) =>
                                setAnamneseEditada((prev: any) => ({
                                  ...prev,
                                  [chave]: e.target.value,
                                }))
                              }
                            />
                          ) : (
                            String(valor)
                          )}
                        </li>
                      ))}
                    </ul>

                    {editandoAnamnese ? (
                      <button className="botao-ver-mais" onClick={salvarAnamneseEditada}>
                        Salvar Alterações
                      </button>
                    ) : (
                      <button className="botao-ver-mais" onClick={habilitarEdicaoAnamnese}>
                        ✏️ Editar
                      </button>
                    )}
                  </div>
                )}
              </>
            ) : (
              <p>Nenhuma anamnese cadastrada.</p>
            )}
          </div>

          <div className="card-info">
            <h3>Observações</h3>
            <p>Pacientes que praticam atividades físicas regularmente possuem maior adesão aos planos alimentares.</p>
          </div>
          

          <div className="card-info">
            <h3>Observações</h3>
            <p>Pacientes que praticam atividades físicas regularmente possuem maior adesão aos planos alimentares.</p>
          </div>
        </div>

        <div className="card-info">
            <EvolucaoPaciente pacienteId={pacienteId || ""} />
        </div>

        <div className="card-dieta">
          <h3>Dieta Atual</h3>
          <div className="tabela-dieta">
            <table>
              <thead>
                <tr>
                  <th>Refeição</th>
                  <th>Seg</th>
                  <th>Ter</th>
                  <th>Qua</th>
                  <th>Qui</th>
                  <th>Sex</th>
                  <th>Sáb</th>
                  <th>Dom</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(dietaExemplo).map(([refeicao, itens]) => (
                  <tr key={refeicao}>
                    <td><strong>{refeicao}</strong></td>
                    {itens.map((item, index) => (
                      <td key={index}>{item}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
