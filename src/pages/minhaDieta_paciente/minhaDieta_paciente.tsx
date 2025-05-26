import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import './minhaDieta_paciente.css'; 
import Header from '../../components/headers/header_paciente'; 
import html2pdf from "html2pdf.js";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../components/firebase/firebaseConfig";
import EvolucaoGraficoPaciente from "../../components/evolucao/EvolucaoGraficoPaciente";


export default function MinhaDietaPaciente() {
  const { pacienteId } = useParams();
  const navigate = useNavigate();
  const [dietaGerada, setDietaGerada] = useState<Record<string, Record<string, string[]>> | null>(null);
  const [dietaSalva, setDietaSalva] = useState<Record<string, string[]> | null>(null);
  const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
  const ordemRefeicoes = ["Café da Manhã", "Lanche da Manhã", "Almoço", "Lanche da Tarde", "Jantar", "Ceia"];

const carregarDietaDoFirebase = async (pacienteId: string) => {
  if (!pacienteId) return;

  try {
    const dietaRef = doc(db, "dietas", pacienteId);
    const docSnap = await getDoc(dietaRef);

    if (docSnap.exists()) {
      const dadosDieta = docSnap.data()?.dieta;

      if (dadosDieta && typeof dadosDieta === "object") {
        setDietaGerada(dadosDieta);
      } else {
        setDietaGerada(null);
      }
    } else {
      setDietaGerada(null);
    }
  } catch (error) {
    console.error("Erro ao carregar dieta do Firebase:", error);
  }
};

useEffect(() => {
  if (pacienteId) {
    carregarDietaDoFirebase(pacienteId);
  } else {
  }
}, [pacienteId]);


  return (
    <div className="minha-dieta-container">
      <header className="perfil-header">
      <Header />
        <Link to="/"><button className="logout-button">Logout</button></Link>
      </header>

      <main className="minha-dieta-main">
        <h1>Informações Gerais</h1>
        <div className="card-info">
            <EvolucaoGraficoPaciente pacienteId={pacienteId || ""} />
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
                          {dietaGerada[refeicao]?.[dia] ? dietaGerada[refeicao][dia].join(", ") : "Sem registro"}
                        </td>
                      ))}
                    </tr>
                  ) : null
                ))}
              </tbody>
            </table>
          ) : <p>Nenhuma dieta gerada ainda.</p>}
        </div>
      </main>
    </div>
  );
}
