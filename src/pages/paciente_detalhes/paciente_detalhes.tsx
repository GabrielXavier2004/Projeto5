import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, doc, updateDoc, addDoc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../components/firebase/firebaseConfig";
import EvolucaoPaciente from "../../components/evolucao/evolucao_paciente";
import "./paciente_detalhes.css";
import HeaderNutri from "../../components/headers/header_nutri";
import html2pdf from "html2pdf.js";
import { generateDiet } from "../../components/gemini/geminiConfig";


export default function PacienteDetalhes() {
  const { pacienteId } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState<any>(null);
  const [anamnese, setAnamnese] = useState<any>(null);
  const [mostrarAnamneseCompleta, setMostrarAnamneseCompleta] = useState(false);
  const [editandoAnamnese, setEditandoAnamnese] = useState(false);
  const [anamneseEditada, setAnamneseEditada] = useState<any>({});
  const [dietaGerada, setDietaGerada] = useState<Record<string, Record<string, string[]>> | null>(null);
  const [dietaSalva, setDietaSalva] = useState<Record<string, string[]> | null>(null);
  const [editandoDieta, setEditandoDieta] = useState(false);
  const [notasNutricionista, setNotasNutricionista] = useState<string>("");
  const [isGeneratingDiet, setIsGeneratingDiet] = useState(false);
  const [caloriasDieta, setCaloriasDieta] = useState<string>("");

  const habilitarEdicaoAnamnese = () => {
    setEditandoAnamnese(true);
    setAnamneseEditada({ ...anamnese });
  };

  const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
  const ordemRefeicoes = ["Café da Manhã", "Lanche da Manhã", "Almoço", "Lanche da Tarde", "Jantar", "Ceia"];


  const salvarDietaNoFirebase = async (dieta: Record<string, Record<string, string[]>>) => {
    if (!pacienteId) {
      console.error("ID do paciente não encontrado");
      return;
    }

    const dietaRef = doc(db, "dietas", pacienteId);
    
    try {
      const dadosDieta = {
        pacienteId,
        dieta: dieta,
        dataGeracao: new Date(),
        caloriasDieta: caloriasDieta || "2000"
      };

      console.log("Tentando salvar dieta:", dadosDieta);
      
      await setDoc(dietaRef, dadosDieta);
      
      // Atualizar o estado local
      setDietaGerada(dieta);
      
      console.log("Dieta salva com sucesso no Firebase!");
      alert("Dieta salva com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar dieta no Firebase:", error);
      alert("Erro ao salvar a dieta. Por favor, tente novamente.");
    }
  };

  const gerarDietaComBase = async () => {
    if (!anamnese) {
      alert('É necessário ter uma anamnese cadastrada para gerar a dieta.');
      return;
    }
    
    setIsGeneratingDiet(true);
    try {
      console.log('Iniciando geração de dieta...');
      const dietaGeradaTexto = await generateDiet(anamnese, caloriasDieta);
      
      if (!dietaGeradaTexto) {
        throw new Error('Não foi possível gerar o texto da dieta');
      }
      
      console.log('Texto da dieta gerado:', dietaGeradaTexto);
      
      const linhas = dietaGeradaTexto.split('\n');
      const novaDieta: Record<string, Record<string, string[]>> = {};
      
      // Inicializar a estrutura da dieta
      ordemRefeicoes.forEach(refeicao => {
        novaDieta[refeicao] = {};
        diasSemana.forEach(dia => {
          novaDieta[refeicao][dia] = [];
        });
      });

      let refeicaoAtual = '';
      let diaAtual = '';
      
      for (const linha of linhas) {
        const linhaLimpa = linha.trim();
        if (linhaLimpa === '') continue;
        
        // Verificar se é uma refeição
        const refeicaoEncontrada = ordemRefeicoes.find(ref => linhaLimpa.includes(ref));
        if (refeicaoEncontrada) {
          refeicaoAtual = refeicaoEncontrada;
          continue;
        }
        
        // Verificar se é um dia da semana
        const diaEncontrado = diasSemana.find(dia => linhaLimpa.includes(dia));
        if (diaEncontrado) {
          diaAtual = diaEncontrado;
          const conteudo = linhaLimpa.replace(diaEncontrado, '').trim();
          if (refeicaoAtual && conteudo) {
            novaDieta[refeicaoAtual][diaAtual] = [conteudo];
          }
          continue;
        }
        
        // Se não é nem refeição nem dia, e temos refeição e dia atuais, adicionar como item
        if (refeicaoAtual && diaAtual && linhaLimpa) {
          novaDieta[refeicaoAtual][diaAtual].push(linhaLimpa);
        }
      }
      
      console.log('Dieta estruturada:', novaDieta);
      
      // Salvar a dieta no Firebase
      await salvarDietaNoFirebase(novaDieta);
      
      // Atualizar as calorias no documento do paciente
      if (caloriasDieta) {
        const pacienteRef = doc(db, "pacientes", pacienteId!);
        await updateDoc(pacienteRef, { caloriasDieta });
      }
      
    } catch (error) {
      console.error('Erro ao gerar dieta:', error);
      alert('Erro ao gerar dieta. Por favor, tente novamente.');
    } finally {
      setIsGeneratingDiet(false);
    }
  };

  const atualizarDieta = (refeicao: string, dia: string, novoValor: string) => {
    setDietaGerada((dietaAtual) => {
      if (!dietaAtual) return null;

      return {
        ...dietaAtual,
        [refeicao]: {
          ...dietaAtual[refeicao],
          [dia]: [novoValor], // Aqui está a correção! Garantindo que seja um array
        },
      };
    });
  };

  const salvarDietaEditada = async () => {
    if (!pacienteId || !dietaGerada) return;

    const dietaRef = doc(db, "dietas", pacienteId);

    try {
      await setDoc(dietaRef, {
        pacienteId,
        dieta: dietaGerada, // Salvar a versão editada
        dataGeracao: new Date(),
      });

      setEditandoDieta(false); // Sai do modo de edição
      console.log("Dieta editada salva com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar dieta editada:", error);
      alert("Erro ao salvar a dieta editada.");
    }
  };

  const carregarDietaDoFirebase = async (pacienteId: string) => {
    if (!pacienteId) return;

    try {
      const dietaRef = doc(db, "dietas", pacienteId);
      const docSnap = await getDoc(dietaRef);

      if (docSnap.exists()) {
        const dadosDieta = docSnap.data()?.dieta;
        setDietaGerada(dadosDieta);
        console.log("Dieta carregada:", dadosDieta);
      } else {
        console.log("Nenhuma dieta encontrada para este paciente.");
      }
    } catch (error) {
      console.error("Erro ao carregar dieta do Firebase:", error);
    }
  };

  useEffect(() => {
    if (pacienteId) {
      carregarDietaDoFirebase(pacienteId);
      carregarNotasNutricionista(pacienteId)
    }
  }, [pacienteId]);


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

  const salvarNotasNutricionista = async () => {
    if (!pacienteId) return;

    const pacienteRef = doc(db, "pacientes", pacienteId);

    try {
      await updateDoc(pacienteRef, { notasNutricionista });
      console.log("Notas do nutricionista salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar notas do nutricionista:", error);
      alert("Erro ao salvar as observações.");
    }
  };

  const carregarNotasNutricionista = async (pacienteId: string) => {
  if (!pacienteId) return;

  try {
    const pacienteRef = doc(db, "pacientes", pacienteId);
    const docSnap = await getDoc(pacienteRef);

    if (docSnap.exists()) {
      const notas = docSnap.data()?.notasNutricionista || "";
      setNotasNutricionista(notas);
      console.log("Observações carregadas:", notas);
    } else {
      console.log("Nenhuma observação encontrada para este paciente.");
    }
  } catch (error) {
    console.error("Erro ao carregar observações:", error);
  }
};

  const salvarCaloriasDieta = async () => {
    if (!pacienteId) return;

    const pacienteRef = doc(db, "pacientes", pacienteId);

    try {
      await updateDoc(pacienteRef, { caloriasDieta });
      console.log("Calorias da dieta salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar calorias da dieta:", error);
      alert("Erro ao salvar as calorias da dieta.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      console.log('Iniciando carregamento de dados...');
      console.log('ID do paciente:', pacienteId);

      const pacienteQuery = query(collection(db, "pacientes"), where("pacienteId", "==", pacienteId));
      const pacienteSnapshot = await getDocs(pacienteQuery);
      if (!pacienteSnapshot.empty) {
        const pacienteData = pacienteSnapshot.docs[0].data();
        setPaciente(pacienteData);
        // Carregar as calorias da dieta se existirem
        if (pacienteData.caloriasDieta) {
          setCaloriasDieta(pacienteData.caloriasDieta);
          console.log('Calorias da dieta carregadas:', pacienteData.caloriasDieta);
        }
        console.log('Dados do paciente carregados:', pacienteData);
      } else {
        console.log('Nenhum paciente encontrado com o ID:', pacienteId);
      }

      const anamneseQuery = query(collection(db, "anamneses"), where("pacienteId", "==", pacienteId));
      const anamneseSnapshot = await getDocs(anamneseQuery);
      if (!anamneseSnapshot.empty) {
        const anamneseData = anamneseSnapshot.docs[0].data().respostas;
        setAnamnese(anamneseData);
        console.log('Anamnese carregada:', anamneseData);
      } else {
        console.log('Nenhuma anamnese encontrada para o paciente:', pacienteId);
      }

      const dietaRef = doc(db, "dietas", pacienteId!);
      const dietaSnap = await getDoc(dietaRef);
      if (dietaSnap.exists()) {
        const dietaData = dietaSnap.data().dieta;
        setDietaSalva(dietaData);
        console.log('Dieta salva carregada:', dietaData);
      } else {
        console.log('Nenhuma dieta salva encontrada para o paciente:', pacienteId);
      }
    };

    fetchData();
  }, [pacienteId]);

  return (
    <div className="container-paciente-detalhes" style={{backgroundColor: "#eee"}}>
    <HeaderNutri/>
    <div className="detalhes-container">
        <div className="topo-paciente">
          <h2>{paciente?.nome}</h2>
          <p><strong>CPF:</strong> {paciente?.cpf}</p>
          <p><strong>ID:</strong> {paciente?.pacienteId}</p>
          <button onClick={() => navigate(-1)} className="btn-voltar">Voltar</button>
        </div>

        <div className="cards-topo">
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
            <h3>Gerar Dieta</h3>
            <p style={{textAlign:"center"}}>Com base nos dados da anamnese, este plano alimentar foi estruturado para atender às necessidades individuais do paciente, considerando seus objetivos, nível de atividade física e indicadores nutricionais.</p>
            <div style={{textAlign:"center"}}>
              <button 
                onClick={gerarDietaComBase} 
                className="botao-gerar-dieta"
                disabled={isGeneratingDiet}
              >
                {isGeneratingDiet ? 'Gerando Dieta...' : anamnese ? 'Gerar Dieta Baseada na Anamnese' : 'Aguardando Anamnese...'}
              </button>
              {!anamnese && (
                <p style={{ color: '#666', marginTop: '10px', fontSize: '14px' }}>
                  É necessário ter uma anamnese cadastrada para gerar a dieta.
                </p>
              )}
            </div>
          </div>
          
          <div className="card-info">
            <h3>Calorias da Dieta</h3>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '15px', 
              height: '100%',
              justifyContent: 'space-between'
            }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ 
                  marginBottom: '25px'
                }}>
                  {caloriasDieta ? 'Calorias atuais: ' + caloriasDieta + ' kcal' : 'Insira aqui a quantidade de kcal por dia da dieta do seu paciente'}
                </p>
                <input
                  type="number"
                  value={caloriasDieta}
                  onChange={(e) => setCaloriasDieta(e.target.value)}
                  placeholder="Digite as calorias da dieta"
                  style={{ 
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    width: '80%',
                    maxWidth: '300px',
                    fontSize: '16px',
                    textAlign: 'center'
                  }}
                />
              </div>
              <div style={{ width: '100%', textAlign: 'center' }}>
                <button 
                  onClick={salvarCaloriasDieta} 
                  className="botao-gerar-dieta"
                  style={{ width: '80%', maxWidth: '300px' }}
                >
                  {caloriasDieta ? 'Atualizar Calorias' : 'Salvar Calorias'}
                </button>
              </div>
            </div>
          </div>

          <div className="card-info">
            <h3>Observações</h3>
            <textarea 
              className="bloco-notas"
              value={notasNutricionista}
              onChange={(e) => setNotasNutricionista(e.target.value)}
              placeholder="Escreva suas observações sobre o paciente aqui..."
            />
            <div className="observacao">
              <button onClick={salvarNotasNutricionista} className="botao-gerar-dieta">
                Salvar Observações
              </button>
            </div>
          </div>
        </div>

        <div className="card-info">
            <EvolucaoPaciente pacienteId={pacienteId || ""} />
        </div>

        <div className="card-dieta">
          <h3>Dieta Semanal Gerada</h3>
          <button
            className="botao-exportar"
            onClick={() => {
              const element = document.getElementById("tabela-dieta-pdf");
              if (element) {
                html2pdf().set({
                  margin: 10,
                  filename: "dieta_paciente.pdf",
                  image: { type: "jpeg", quality: 0.98 },
                  html2canvas: { scale: 2 },
                  jsPDF: { unit: "mm", format: "a4", orientation: "landscape" }
                }).from(element).save();
              }
            }}
          >
            📄 Exportar em PDF
          </button>
          {editandoDieta ? (
            <button onClick={salvarDietaEditada} className="botao-exportar">Salvar Dieta</button>
          ) : (
            <button onClick={() => setEditandoDieta(true)} className="botao-exportar">✏️ Editar Dieta</button>
          )}
          {(dietaGerada || dietaSalva) ? (
            <table className="tabela-dieta" id="tabela-dieta-pdf">
              <thead>
                <tr>
                  <th>Refeição</th>
                  {diasSemana.map((dia) => (
                    <th key={dia}>{dia}</th>
                  ))}
                </tr>
              </thead>
                <tbody>
                  {ordemRefeicoes.map((refeicao) => (
                    dietaGerada?.[refeicao] ? (
                      <tr key={refeicao}>
                        <td><strong>{refeicao}</strong></td>
                        {diasSemana.map((dia) => (
                          <td key={dia}>
                            {editandoDieta ? (
                              <input 
                                type="text" 
                                value={dietaGerada[refeicao]?.[dia]?.[0] || ""} // Garantindo compatibilidade com string[]
                                onChange={(e) => atualizarDieta(refeicao, dia, e.target.value)} 
                                className="input-dieta"
                              />
                            ) : (
                              dietaGerada[refeicao]?.[dia]?.[0] || "" // Exibe corretamente sem erro de tipo
                            )}
                          </td>
                        ))}
                      </tr>
                    ) : null
                  ))}
                </tbody>
            </table>
          ) : <p>Nenhuma dieta gerada ainda.</p>}
        </div>
      </div>
    </div>
  );
}
