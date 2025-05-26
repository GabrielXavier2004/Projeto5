import { useState, useEffect, ChangeEvent } from "react";
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../components/firebase/firebaseConfig";
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
  const etapaFinal = 6;

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

  useEffect(() => {
    localStorage.setItem("anamneseForm", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked ? "sim" : "nao" }));
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
  
      const q = query(collection(db, "anamneses"), where("pacienteId", "==", pacienteId));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id;
        await deleteDoc(doc(db, "anamneses", docId));
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

  const renderSimNao = (pergunta: string, name: string, textoLabel: string) => (
    <div className="form-grupo">
      <label className="form-label">{pergunta}</label>
      <div className="botoes-sim-nao">
        <button
          type="button"
          className={`botao-sim ${formData[name] === "sim" ? "ativo" : ""}`}
          onClick={() => setFormData(prev => ({ ...prev, [name]: "sim" }))}
        >
          Sim
        </button>
        <button
          type="button"
          className={`botao-nao ${formData[name] === "nao" ? "ativo" : ""}`}
          onClick={() => setFormData(prev => ({ ...prev, [name]: "nao" }))}
        >
          Não
        </button>
      </div>
      {formData[name] === "sim" && (
        <>
          <label className="form-label">{textoLabel}</label>
          <textarea
            className="form-textarea"
            name={`${name}Texto`}
            onChange={handleChange}
            value={formData[`${name}Texto`] || ""}
            rows={3}
          />
        </>
      )}
    </div>
  );

  const renderResumo = () => (
    <div className="form-etapa">
      <div className="resumo-cards">
        {Object.entries(formData).map(([chave, valor]) => (
          <div key={chave} className="resumo-card">
            <h4>{chave}</h4>
            <p>{valor === "sim" ? "✅ Sim" : valor === "nao" ? "❌ Não" : valor || "Não informado"}</p>
          </div>
        ))}
      </div>
    </div>
  );

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
            {renderSimNao("Você possui alguma alergia?", "temAlergia", "Se sim, quais?")}
            {renderSimNao("Você faz uso de medicamentos ou suplementos?", "usaMedicamentos", "Se sim, quais?")}
            {renderSimNao("Você faz uso recorrente de antibióticos?", "usaAntibioticos", "Se sim, com que frequência?")}
            {renderSimNao("Você realizou exames recentemente?", "fezExames", "Se sim, quais?")}
          </div>
        );

      case 2:
        return (
          <div className="form-etapa">
            {renderSimNao("Você pratica atividade física?", "atividadeFisica", "Se sim, descreva:")}
            {renderSimNao("Você fuma?", "fuma", "Se sim, com que frequência?")}
            {renderSimNao("Você consome bebida alcoólica?", "bebe", "Se sim, com que frequência?")}
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
            {renderSimNao("Você consome bastante água?", "agua", "")}
            {renderSimNao("Você ingere líquidos durante as refeições?", "liquidoRefeicao", "Se sim, quais?")}
            {renderSimNao("Você tem dificuldades com a digestão?", "digestao", "Se sim, descreva:")}
            {renderSimNao("Você tem problemas intestinais?", "intestino", "Se sim, descreva:")}
            <label className="form-label">Como estão suas fezes?</label>
            <textarea className="form-textarea" name="fezes" onChange={handleChange} value={formData["fezes"] || ""} rows={3} />
          </div>
        );

      case 4:
        return (
          <div className="form-etapa">
            <label className="form-label">Descreva a frequência de consumo de alimentos:</label>
            <textarea className="form-textarea" name="frequenciaAlimentar" onChange={handleChange} value={formData["frequenciaAlimentar"] || ""} rows={3} />
          </div>
        );

      case 5:
        return (
          <div className="form-etapa">
            <label className="form-label">Rastreamento metabólico:</label>
            <textarea name="rastreamentoMetabolico" onChange={handleChange} value={formData["rastreamentoMetabolico"] || ""} rows={10} />
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
        <button 
          onClick={() => setEtapaAtual(etapaAtual === etapaFinal ? 1 : etapaAtual - 1)} 
          disabled={etapaAtual === 1}
          className="btn-voltar"
        >
          {etapaAtual === etapaFinal ? "Refazer Anamnese" : "Voltar"}
        </button>
        <div style={{display:"flex"}}>
          <div style={{marginRight:"5px"}}>
            {etapaAtual === etapaFinal && (
              <button 
                onClick={() => navigate("/perfil_paciente")} 
                className="btn-voltar"
              >
                Voltar para Informações
              </button>
            )}
          </div>
          <button 
            onClick={() => {
              if (etapaAtual === etapaFinal) {
                enviarAnamnese(); 
              } else {
                setEtapaAtual(etapaAtual + 1); 
              }
            }}
            className="btn-enviar"
          >
            {etapaAtual === etapaFinal ? "Enviar" : "Avançar"}
          </button>
        </div>
      </div>
    </div>
  );
}
