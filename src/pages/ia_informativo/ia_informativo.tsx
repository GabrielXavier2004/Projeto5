import React from 'react';
import { Link } from 'react-router-dom';
import HeaderNutri from '../../components/headers/header_nutri';
import './ia_informativo.css';
import iaIcon from '../../content/ia1.png';
import planoAlimentar from '../../content/ia2.png';
import receitas from '../../content/receitas.jpg';

export default function IAInformativo() {
  return (
    <body style={{backgroundColor: "#eee"}}>
        <div>
        <HeaderNutri />
        <div className="ia-informativo-container">
            <div className="ia-informativo-header">
            <h2>Inteligência Artificial no NutriHub</h2>
            <p>Conheça como nossa IA auxilia na criação de planos alimentares personalizados e eficientes</p>
            </div>

            <div className="ia-informativo-section">
            <h3>Como a IA Funciona</h3>
            <p>Nossa inteligência artificial foi desenvolvida especialmente para auxiliar nutricionistas na criação de planos alimentares personalizados. O sistema utiliza algoritmos avançados que consideram múltiplos fatores para gerar recomendações precisas e adaptadas a cada paciente.</p>
            <div className="list-content">
                <div className="list-container">
                <ul>
                    <li>Análise completa dos dados da anamnese</li>
                    <li>Consideração de restrições alimentares e alergias</li>
                    <li>Avaliação de preferências e aversões alimentares</li>
                    <li>Cálculo preciso de necessidades nutricionais</li>
                    <li>Adaptação às metas e objetivos individuais</li>
                </ul>
                </div>
                <div className="section-image">
                <img src={iaIcon} alt="Inteligência Artificial" />
                </div>
            </div>
            </div>

            <div className="ia-informativo-section">
            <h3>Benefícios para o Nutricionista</h3>
            <p>Ao utilizar nossa IA, você terá acesso a diversas vantagens que otimizarão seu trabalho:</p>
            <div className="list-content">
                <div className="list-container">
                <ul>
                    <li>Economia de tempo na elaboração de planos alimentares</li>
                    <li>Sugestões baseadas em evidências científicas</li>
                    <li>Personalização avançada para cada paciente</li>
                    <li>Maior precisão nos cálculos nutricionais</li>
                    <li>Facilidade na adaptação e ajuste dos planos</li>
                </ul>
                </div>
                <div className="section-image">
                <img src={planoAlimentar} alt="Plano Alimentar" />
                </div>
            </div>
            </div>

            <div className="ia-informativo-section">
            <h3>Como Utilizar</h3>
            <p>O processo de utilização da IA é simples e intuitivo:</p>
            <div className="list-content">
                <div className="list-container">
                <ul>
                    <li>Acesse o perfil do paciente na lista de pacientes</li>
                    <li>Verifique se a anamnese está completa e atualizada</li>
                    <li>Clique no botão "Gerar Plano Alimentar com IA"</li>
                    <li>Revise e ajuste as sugestões conforme necessário</li>
                    <li>Aprove e compartilhe o plano com seu paciente</li>
                </ul>
                <Link to="/lista_paciente" className="botao-pacientes">
                    Ir para Lista de Pacientes
                </Link>
                </div>
                <div className="section-image">
                <img src={receitas} alt="Receitas e Planos" />
                </div>
            </div>
            </div>

            <div className="ia-informativo-footer">
            <p>A IA é uma ferramenta de apoio ao nutricionista, que sempre deve usar seu conhecimento profissional para validar e ajustar as recomendações.</p>
            </div>
        </div>
        </div>
    </body>
  );
}