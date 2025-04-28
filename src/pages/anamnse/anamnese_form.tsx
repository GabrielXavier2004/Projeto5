import { useState, useEffect, ChangeEvent } from "react";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../components/firebase/firebaseConfig"; // ajuste o caminho se necessário
import { useNavigate } from "react-router-dom";
import "./anamnese_form.css";

const etapas = [
  "Dados Pessoais",
  "Histórico de Saúde",
  "Hábitos de Vida",
  "Alimentação e Digestão",
  "Frequência Alimentar",
  "Rastreamento Metabólico",
  "Resumo"
];

export default function AnamneseForm() {
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [anamneseExistente, setAnamneseExistente] = useState(false);
  const [anamneseCarregada, setAnamneseCarregada] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const buscarAnamnese = async () => {
      const pacienteId = localStorage.getItem("pacienteId");
      if (!pacienteId) return;

      const q = query(collection(db, "anamneses"), where("pacienteId", "==", pacienteId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const dados = querySnapshot.docs[0].data();
        setFormData(dados.respostas || {});
        setEtapaAtual(etapas.length - 1); 
        setAnamneseExistente(true);
      }

      setAnamneseCarregada(true);
    };

    buscarAnamnese();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      if (
        name.startsWith("temAlergia") ||
        name.startsWith("usaMedicamentos") ||
        name.startsWith("usaAntibioticos") ||
        name.startsWith("fezExames") ||
        name.startsWith("atividadeFisica") ||
        name.startsWith("fuma") ||
        name.startsWith("bebe") ||
        name.startsWith("temIntolerancia") ||
        name.startsWith("liquidoRefeicao")
      ) {
        if (value !== "sim") {
          delete newData[`${name}Texto`];
        }
      }

      return newData;
    });
  };

  const validarEtapaAtual = () => {
    const camposObrigatorios: Record<number, string[]> = {
      0: ["nome", "dataNascimento", "idade", "cidade", "email", "telefone"],
      1: ["motivoConsulta", "queixas", "doencas", "profissao", "cirurgias"],
      2: ["atividadeFisica", "fuma", "bebe", "sono", "horasSono", "horarioSono"],
      3: ["agua", "liquidoRefeicao", "digestao", "intestino", "fezes"],
      4: ["frequenciaAlimentar"],
      5: []
    };

    const obrigatorios = camposObrigatorios[etapaAtual] || [];
    for (const campo of obrigatorios) {
      if (!formData[campo]) {
        alert("Preencha todos os campos obrigatórios antes de avançar.");
        return false;
      }
    }
    return true;
  };

  const handleProximaEtapa = () => {
    if (etapaAtual < etapas.length - 1 && validarEtapaAtual()) {
      setEtapaAtual(etapaAtual + 1);
    }
  };

  const handleEtapaAnterior = () => {
    if (etapaAtual > 0) setEtapaAtual(etapaAtual - 1);
  };

  const enviarAnamnese = async () => {
    try {
      const pacienteId = localStorage.getItem("pacienteId");
      if (!pacienteId) {
        alert("Paciente não autenticado.");
        return;
      }

      await addDoc(collection(db, "anamneses"), {
        pacienteId,
        respostas: formData,
        dataEnvio: new Date()
      });

      alert("Anamnese enviada com sucesso!");
      localStorage.removeItem("anamneseForm");
      navigate("/perfil_paciente");
    } catch (error) {
      console.error("Erro ao enviar anamnese:", error);
      alert("Erro ao enviar anamnese.");
    }
  };

  const renderCondicional = (pergunta: string, name: string, textoLabel: string) => (
    <div className="form-grupo">
      <label className="form-label">{pergunta}</label>
      <select className="form-select" name={name} onChange={handleChange} value={formData[name] || ""}>
        <option value="">Selecione</option>
        <option value="sim">Sim</option>
        <option value="nao">Não</option>
      </select>
      {formData[name] === "sim" && (
        <>
          <label className="form-label">{textoLabel}</label>
          <textarea className="form-textarea" name={`${name}Texto`} onChange={handleChange} rows={3} />
        </>
      )}
    </div>
  );

  const renderResumo = () => {
    const camposAmigaveis: Record<string, string> = {
      nome: "Nome completo",
      telefone: "Telefone",
      email: "Email",
      cidade: "Cidade",
      idade: "Idade",
      dataNascimento: "Data de nascimento",
      motivoConsulta: "Motivo da consulta",
      queixas: "Principais queixas",
      temAlergia: "Possui alergia?",
      usaMedicamentos: "Faz uso de medicamentos?",
      doencas: "Doenças diagnosticadas",
      profissao: "Profissão",
      cirurgias: "Cirurgias realizadas",
      usaAntibioticos: "Uso de antibióticos",
      fezExames: "Realizou exames recentemente?",
      historicoFamiliar: "Histórico familiar de doenças",
      atividadeFisica: "Pratica atividade física?",
      fuma: "Fuma?",
      bebe: "Consome bebidas alcoólicas?",
      sono: "Qualidade do sono",
      horasSono: "Horas de sono por noite",
      horarioSono: "Horários de sono",
      agua: "Consome bastante água?",
      liquidoRefeicao: "Ingestão de líquidos nas refeições",
      digestao: "Tem dificuldades na digestão?",
      intestino: "Problemas intestinais",
      fezes: "Condição das fezes",
      frequenciaAlimentar: "Frequência alimentar",
      rastreamentoMetabolico: "Rastreamento metabólico"
    };

    return (
      <div className="form-etapa">
        <div className="resumo-cards">
          {Object.entries(formData).map(([chave, valor]) => {
            const nomeAmigavel = camposAmigaveis[chave] || chave;
            return (
              <div key={chave} className="resumo-card">
                <h4>{nomeAmigavel}</h4>
                <p>{valor || "Não informado"}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderEtapa = () => {
    if (!anamneseCarregada) {
      return <p>Carregando anamnese...</p>;
    }
    
    switch (etapaAtual) {
      case 0:
        return (
          <div className="form-etapa">
            <label className="form-label">Nome completo:</label>
            <input className="form-input" name="nome" onChange={handleChange} value={formData["nome"] || ""} />

            <label className="form-label">Data de nascimento:</label>
            <input className="form-input" name="dataNascimento" type="date" onChange={handleChange} value={formData["dataNascimento"] || ""} />

            <label className="form-label">Idade:</label>
            <input className="form-input" name="idade" onChange={handleChange} value={formData["idade"] || ""} />

            <label className="form-label">Cidade:</label>
            <input className="form-input" name="cidade" onChange={handleChange} value={formData["cidade"] || ""} />

            <label className="form-label">Email:</label>
            <input className="form-input" name="email" type="email" onChange={handleChange} value={formData["email"] || ""} />

            <label className="form-label">Telefone:</label>
            <input className="form-input" name="telefone" onChange={handleChange} value={formData["telefone"] || ""} />
          </div>
        );

      case 1:
        return (
          <div className="form-etapa">
            <label className="form-label">Motivo da consulta:</label>
            <textarea className="form-textarea" name="motivoConsulta" onChange={handleChange} value={formData["motivoConsulta"] || ""} rows={3} />

            <label className="form-label">Principais queixas ou sintomas:</label>
            <textarea className="form-textarea" name="queixas" onChange={handleChange} value={formData["queixas"] || ""} rows={3} />

            <label className="form-label">Doenças diagnosticadas:</label>
            <textarea className="form-textarea" name="doencas" onChange={handleChange} value={formData["doencas"] || ""} rows={3} />

            <label className="form-label">Profissão:</label>
            <input className="form-input" name="profissao" onChange={handleChange} value={formData["profissao"] || ""} />

            <label className="form-label">Cirurgias realizadas:</label>
            <textarea className="form-textarea" name="cirurgias" onChange={handleChange} value={formData["cirurgias"] || ""} rows={3} />

            {renderCondicional("Você possui alguma alergia?", "temAlergia", "Se sim, quais?")}
            {renderCondicional("Você faz uso de medicamentos ou suplementos?", "usaMedicamentos", "Se sim, quais?")}
            {renderCondicional("Você faz uso recorrente de antibióticos?", "usaAntibioticos", "Se sim, com que frequência?")}
            {renderCondicional("Você realizou exames recentemente?", "fezExames", "Se sim, quais?")}

            <label className="form-label">Histórico familiar de doenças:</label>
            <textarea className="form-textarea" name="historicoFamiliar" onChange={handleChange} value={formData["historicoFamiliar"] || ""} rows={3} />
          </div>
        );

      case 2:
        return (
          <div className="form-etapa">
            {renderCondicional("Você pratica atividade física?", "atividadeFisica", "Se sim, descreva:")}
            {renderCondicional("Você fuma?", "fuma", "Se sim, com que frequência?")}
            {renderCondicional("Você consome bebida alcoólica?", "bebe", "Se sim, com que frequência?")}

            <label className="form-label">Qualidade do sono:</label>
            <textarea className="form-textarea" name="sono" onChange={handleChange} value={formData["sono"] || ""} rows={4} />

            <label className="form-label">Horas de sono por noite:</label>
            <input className="form-input" name="horasSono" onChange={handleChange} value={formData["horasSono"] || ""} />

            <label className="form-label">Horários em que costuma dormir e acordar:</label>
            <textarea className="form-textarea" name="horarioSono" onChange={handleChange} value={formData["horarioSono"] || ""} rows={3} />
          </div>
        );

      case 3:
        return (
          <div className="form-etapa">
            <label className="form-label">Você consome bastante água?</label>
            <select className="form-select" name="agua" onChange={handleChange} value={formData["agua"] || ""}>
              <option value="">Selecione</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>

            {renderCondicional("Você ingere líquidos durante as refeições?", "liquidoRefeicao", "Se sim, quais?")}
            {renderCondicional("Você tem dificuldades com a digestão?", "digestao", "Se sim, descreva:")}
            {renderCondicional("Você tem problemas intestinais?", "intestino", "Se sim, descreva:")}
            <label className="form-label">Como estão suas fezes?</label>
              <textarea className="form-textarea" name="fezes" onChange={handleChange} value={formData["fezes"] || ""} rows={3} />
                
          </div>
        );

      case 4:
        return (
          <div className="form-etapa">
            <label className="form-label">Descreva a frequência de consumo de alimentos (ex: frutas, hortaliças, doces, refrigerantes, etc.):</label>
            <textarea className="form-textarea" name="frequenciaAlimentar" onChange={handleChange} value={formData["frequenciaAlimentar"] || ""} rows={3} />
          </div>
        );

      case 5:
        return (
          <div className="form-etapa">
            <label>Rastreamento metabólico (descreva sintomas e intensidade nos últimos 30 dias):</label>
            <textarea name="rastreamentoMetabolico" onChange={handleChange} rows={10} />
          </div>
        );

      case 6:
        return renderResumo();
        
      default:
        return null;
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-titulo">Anamnese</h1>
      <h2 className="form-subtitulo">{etapas[etapaAtual]}</h2>

      {renderEtapa()}

      <div className="form-navegacao">
        {etapaAtual > 0 && <button className="btn-voltar" onClick={handleEtapaAnterior}>Voltar</button>}
        {etapaAtual < etapas.length - 1 && (
          <button className="btn-avancar" onClick={handleProximaEtapa}>Avançar</button>
        )}
        {etapaAtual === etapas.length - 1 && (
          <button className="btn-enviar" onClick={enviarAnamnese}>
            Enviar
          </button>
        )}
      </div>
    </div>
  );
}
