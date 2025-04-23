import { ChangeEvent, useState } from "react";
import "./anamnese_form.css";

const etapas = [
    "Dados Pessoais",
    "Histórico de Saúde",
    "Hábitos de Vida",
    "Alimentação e Digestão",
    "Frequência Alimentar",
    "Rastreamento Metabólico"
  ];
  
  export default function AnamneseForm() {
    const [etapaAtual, setEtapaAtual] = useState(0);
    const [formData, setFormData] = useState<Record<string, string>>({});
  
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleProximaEtapa = () => {
      if (etapaAtual < etapas.length - 1) setEtapaAtual(etapaAtual + 1);
    };
  
    const handleEtapaAnterior = () => {
      if (etapaAtual > 0) setEtapaAtual(etapaAtual - 1);
    };
  
    const renderEtapa = () => {
      switch (etapaAtual) {
        case 0:
          return (
            <div className="form-etapa">
              <label>Nome completo:</label>
              <input name="nome" onChange={handleChange} />
  
              <label>Data de nascimento:</label>
              <input name="dataNascimento" type="date" onChange={handleChange} />
  
              <label>Email:</label>
              <input name="email" type="email" onChange={handleChange} />
  
              <label>Telefone:</label>
              <input name="telefone" onChange={handleChange} />
            </div>
          );
  
        case 1:
          return (
            <div className="form-etapa">
              <label>Motivo da consulta:</label>
              <textarea name="motivo" onChange={handleChange} />
  
              <label>Doenças diagnosticadas:</label>
              <textarea name="doencas" onChange={handleChange} />
  
              <label>Cirurgias realizadas:</label>
              <textarea name="cirurgias" onChange={handleChange} />
  
              <label>Alergias:</label>
              <textarea name="alergias" onChange={handleChange} />
            </div>
          );
  
        default:
          return <div className="form-etapa">Etapa não implementada ainda.</div>;
      }
    };
  
    return (
      <div className="form-container">
        <h1 className="form-titulo">Anamnese - Etapa {etapaAtual + 1} de {etapas.length}</h1>
        <p className="form-subtitulo">{etapas[etapaAtual]}</p>
        <form>{renderEtapa()}</form>
  
        <div className="form-navegacao">
          {etapaAtual > 0 && (
            <button type="button" onClick={handleEtapaAnterior} className="btn-voltar">
              Etapa anterior
            </button>
          )}
  
          {etapaAtual < etapas.length - 1 ? (
            <button type="button" onClick={handleProximaEtapa} className="btn-avancar">
              Próxima etapa
            </button>
          ) : (
            <button type="submit" className="btn-enviar">
              Enviar
            </button>
          )}
        </div>
      </div>
    );
  }