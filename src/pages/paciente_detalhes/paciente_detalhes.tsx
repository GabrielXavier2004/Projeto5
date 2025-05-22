import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, doc, updateDoc, addDoc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../components/firebase/firebaseConfig";
import EvolucaoPaciente from "../../components/evolucao/evolucao_paciente";
import "./paciente_detalhes.css";
import HeaderNutri from "../../components/headers/header_nutri";
import html2pdf from "html2pdf.js";


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

  const habilitarEdicaoAnamnese = () => {
    setEditandoAnamnese(true);
    setAnamneseEditada({ ...anamnese });
  };

  const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
  const ordemRefeicoes = ["Café da Manhã", "Lanche da Manhã", "Almoço", "Lanche da Tarde", "Jantar", "Ceia"];

  const alimentos = {
    cafeDaManha: {
      base: [
        "2 ovos mexidos com pão integral",
        "1 copo de vitamina de banana com aveia",
        "1 fatia de bolo integral com chá",
        "1 pão francês com margarina e café com leite",
        "1 iogurte natural com granola",
        "Tapioca com queijo branco",
        "Banana com pasta de amendoim",
        "Pão integral com ovo cozido",
        "Crepioca com frango desfiado",
        "Cuscuz com ovo"
      ],
      semLactose: [
        "Tapioca com ovo",
        "Frutas variadas",
        "Suco natural com pão sem lactose",
        "Crepioca de frango",
        "Ovos mexidos com azeite",
        "Pão sem glúten com patê de atum",
        "Batata doce cozida com ovo",
        "Panqueca sem leite",
        "Smoothie com leite vegetal",
        "Cuscuz com sardinha"
      ],
      atleta: [
        "Ovos mexidos com batata doce",
        "Vitamina com whey e aveia",
        "Banana com pasta de amendoim",
        "Panqueca de aveia e banana",
        "Pão integral com peito de peru",
        "Omelete com espinafre",
        "Café com leite + pão integral + ovo",
        "Tapioca com frango",
        "Cuscuz com ovos",
        "Crepioca proteica"
      ]
    },
    lancheDaManha: {
      base: [
        "Banana",
        "Iogurte",
        "Maçã",
        "Castanhas",
        "Suco natural",
        "Barra de cereal",
        "Biscoito integral",
        "Fruta da estação",
        "Mix de sementes",
        "Pêssego"
      ],
      semLactose: [
        "Frutas",
        "Castanhas",
        "Biscoito sem lactose",
        "Suco natural",
        "Banana",
        "Barra vegana",
        "Tapioca",
        "Frutas secas",
        "Água de coco",
        "Maçã com canela"
      ],
      atleta: [
        "Whey",
        "Pão com pasta de amendoim",
        "Banana com aveia",
        "Iogurte proteico",
        "Frutas com mel",
        "Smoothie",
        "Panqueca proteica",
        "Mix de oleaginosas",
        "Barrinha de proteína",
        "Vitamina"
      ]
    },
    almoco: {
      base: [
        "150g frango + 3 colheres de arroz + feijão + salada",
        "120g carne moída + purê de batata + legumes",
        "Peixe grelhado + arroz integral + cenoura",
        "Frango cozido + macarrão + brócolis",
        "Bife grelhado + arroz + feijão + alface",
        "Strogonoff + batata doce",
        "Omelete + salada verde",
        "Frango desfiado + purê de mandioquinha",
        "Lasanha de berinjela + arroz",
        "Arroz integral + lentilha + frango"
      ],
      semLactose: [
        "Peixe grelhado + arroz + salada",
        "Frango grelhado + purê sem leite + couve",
        "Carne assada + batata doce",
        "Frango + arroz integral + abobrinha",
        "Almôndega caseira + arroz",
        "Quinoa + frango + legumes",
        "Feijão tropeiro sem bacon",
        "Tapioca + carne seca",
        "Batata inglesa + ovo + salada",
        "Escondidinho sem queijo"
      ],
      atleta: [
        "200g frango + 4 colheres arroz integral + salada",
        "150g carne + batata doce + espinafre",
        "Atum + arroz + legumes",
        "Ovos + arroz integral + couve",
        "Macarrão integral + frango",
        "Lasanha proteica",
        "Frango ao curry + arroz",
        "Arroz + lentilha + carne",
        "Batata + frango + legumes",
        "Wrap integral com proteína"
      ]
    },
    lancheDaTarde: {
      base: [
        "Torrada integral com chá",
        "Fruta com iogurte",
        "Bolinho caseiro integral",
        "Banana com aveia",
        "Pão integral com queijo",
        "Vitamina",
        "Mix de frutas",
        "Panqueca integral",
        "Tapioca",
        "Sanduíche natural"
      ],
      semLactose: [
        "Tapioca",
        "Frutas secas",
        "Pão sem lactose",
        "Chá com bolacha sem leite",
        "Bolinho de banana",
        "Panqueca sem leite",
        "Smoothie vegetal",
        "Biscoito de arroz",
        "Banana com mel",
        "Sanduíche com tofu"
      ],
      atleta: [
        "Vitamina com whey",
        "Ovos cozidos",
        "Pão com pasta de amendoim",
        "Shake proteico",
        "Panqueca com banana",
        "Frutas com aveia",
        "Omelete",
        "Whey com frutas",
        "Smoothie com proteína",
        "Tapioca com frango"
      ]
    },
    jantar: {
      base: [
        "Sopa de legumes",
        "Omelete",
        "Arroz + legumes",
        "Panqueca salgada",
        "Salada com ovo",
        "Tapioca com frango",
        "Wrap com salada",
        "Sanduíche natural",
        "Cuscuz com ovo",
        "Macarrão leve"
      ],
      semLactose: [
        "Quinoa com legumes",
        "Tapioca recheada",
        "Frango + batata",
        "Omelete de legumes",
        "Sopa sem leite",
        "Salada com atum",
        "Crepioca",
        "Macarrão sem lactose",
        "Wrap de frango",
        "Cuscuz com salada"
      ],
      atleta: [
        "Frango grelhado + batata doce",
        "Omelete + legumes",
        "Tapioca + frango",
        "Macarrão integral",
        "Wrap + proteína",
        "Arroz + carne",
        "Salada com ovos",
        "Omelete duplo",
        "Atum + legumes",
        "Panqueca com whey"
      ]
    },
    ceia: {
      base: [
        "Chá com bolacha integral",
        "Iogurte",
        "Fruta leve",
        "Oleaginosas",
        "Shake leve",
        "Maçã",
        "Banana",
        "Biscoito integral",
        "Chá de camomila",
        "Suco natural"
      ],
      semLactose: [
        "Chá",
        "Frutas secas",
        "Maçã",
        "Banana",
        "Shake vegetal",
        "Suco de frutas",
        "Pão sem lactose",
        "Castanhas",
        "Bolacha sem leite",
        "Tapioca"
      ],
      atleta: [
        "Caseína",
        "Fruta leve",
        "Iogurte sem lactose",
        "Whey com água",
        "Shake proteico",
        "Panqueca leve",
        "Banana",
        "Mix de nuts",
        "Biscoito com whey",
        "Chá com proteína"
      ]
    }
  };

  const salvarDietaNoFirebase = async (dieta: Record<string, Record<string, string[]>>) => {
    if (!pacienteId || !dietaGerada) return;

    const dietaRef = doc(db, "dietas", pacienteId);
    
    try {
      await setDoc(dietaRef, {
        pacienteId,
        dieta: dietaGerada,
        dataGeracao: new Date(),
      });
      console.log("Dieta salva com sucesso no Firebase!");
    } catch (error) {
      console.error("Erro ao salvar dieta no Firebase:", error);
      alert("Erro ao salvar a dieta no Firebase.");
    }
  };

  const gerarDietaComBase = () => {
    if (!anamnese) return;
    const intoleranteLactose = anamnese.temIntolerancia === "sim" && anamnese.temIntoleranciaTexto?.toLowerCase().includes("lactose");
    const praticaExercicio = anamnese.atividadeFisica === "sim";

    const tipo = intoleranteLactose ? "semLactose" : praticaExercicio ? "atleta" : "base";

    const novaDieta: Record<string, Record<string, string[]>> = {};
    for (const refeicao of Object.keys(alimentos)) {
      const refeicaoFormatada = refeicao
        .replace("cafeDaManha", "Café da Manhã")
        .replace("lancheDaManha", "Lanche da Manhã")
        .replace("almoco", "Almoço")
        .replace("lancheDaTarde", "Lanche da Tarde")
        .replace("jantar", "Jantar")
        .replace("ceia", "Ceia");
      novaDieta[refeicaoFormatada] = {};
      diasSemana.forEach((dia) => {
        const opcoes = alimentos[refeicao as keyof typeof alimentos][tipo];
        const escolha = opcoes[Math.floor(Math.random() * opcoes.length)];
        novaDieta[refeicaoFormatada][dia] = [escolha];
      });
    }
    setDietaGerada(novaDieta);
    console.log("Chamando salvarDietaNoFirebase...", novaDieta);
    salvarDietaNoFirebase(novaDieta); 
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

      const dietaRef = doc(db, "dietas", pacienteId!);
      const dietaSnap = await getDoc(dietaRef);
      if (dietaSnap.exists()) {
        setDietaSalva(dietaSnap.data().dieta);
      }
    };

    fetchData();
  }, [pacienteId]);

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
            <p>Com base nos dados da anamnese, este plano alimentar foi estruturado para atender às necessidades individuais do paciente, considerando seus objetivos, nível de atividade física e indicadores nutricionais.</p>
            <div style={{textAlign:"center"}}>
              <button onClick={gerarDietaComBase} className="botao-gerar-dieta">Gerar Dieta Baseada na Anamnese</button>
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
