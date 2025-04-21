import React from "react";
import './home.css';
import logo from "../content/logo.png";
import banner from "../content/banner.png";
import FAQ from '../components/FAQ/FAQ';
import paciente_home from '../content/paciente_home.jpg'
import plano_alimentar from '../content/plano_alimetar.jpg'
import receitas from '../content/receitas.jpg'
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="container-home">
            <div className="header">
                <img src={logo} alt="logo" className="logo"/>
                <a className="header-topics" href="#">HOME</a>
                <a className="header-topics" href="">SOBRE</a>
                <a className="header-topics" href="#funcionalidades">FUNCIONALIDADES</a>
                <a className="header-topics" href="">DÚVIDAS</a>
                <Link className="login-button" to="/login_paciente">LOGIN PACIENTE</Link>
                <Link className="login-button" to="/login_nutricionista">LOGIN NUTRICIONISTA</Link>
            </div>
            <div className="banner-home">
                <img src={banner} alt="Banner" className="banner-home-img"/>
            </div>
            <div className="sobre-home">
                <p className="home-titulo">NutriHub – Atendimento Nutricional com Eficiência e Tecnologia</p>
                <p className="sobre-texto">Tudo o que você precisa para transformar sua rotina profissional está aqui. O NutriHub é um software completo e intuitivo, desenvolvido especialmente para nutricionistas que buscam mais do que organização: querem agilidade, precisão e excelência em cada atendimento. Com tecnologia de ponta e recursos baseados em inteligência artificial, ele automatiza processos, otimiza o tempo e coloca você no controle total da sua jornada profissional. NutriHub não apenas eleva o padrão do seu consultório — ele fideliza pacientes, gera valor ao seu trabalho e proporciona experiências que encantam. Mais do que um sistema: é a evolução da nutrição, pensada para o seu crescimento.</p>
            </div>
            <div className="funcionalidades-home" id="funcionalidades">
                <p className="home-titulo">Funcionalidades</p>
                {/* <div className="cards-func-home">
                    <div className="card-home">
                        <p className="titulo-card-home">Gestão Completa de Pacientes</p>
                        <p className="texto-card-home">Centralize todas as informações clínicas dos seus pacientes em um só lugar. Acompanhe anamneses, histórico alimentar, avaliações, objetivos e evolução de forma prática e organizada. Esqueça papéis e planilhas: tenha tudo acessível com poucos cliques, de maneira segura e intuitiva.</p>
                    </div>
                    <div className="card-home">
                        <p className="titulo-card-home">Geração de Planos Alimentares com IA</p>
                        <p className="texto-card-home">Gere planos personalizados em minutos com o apoio da IA. O sistema analisa os dados do paciente e sugere refeições equilibradas, considerando restrições, metas e preferências. Você ainda pode ajustar os planos com facilidade, tornando o atendimento mais ágil e profissional.</p>
                    </div>
                    <div className="card-home">
                        <p className="titulo-card-home">Automação de Agendamentos e Lembretes</p>
                        <p className="texto-card-home">Mantenha sua agenda organizada e reduza faltas com o envio automático de lembretes por e-mail ou WhatsApp. Com a agenda integrada do NutriHub, você acompanha seus atendimentos com mais clareza, praticidade e controle.</p>
                    </div>
                </div> */}
                <div className="bloco-funcionalidade">
                    <div className="func-img">
                    <img src={paciente_home} alt="Gestão de Pacientes" />
                    </div>
                    <div className="func-texto">
                    <h3>Gestão Completa de Pacientes</h3>
                    <p>Centralize tudo o que você precisa sobre seus pacientes em um só lugar. Com o NutriHub, você pode registrar anamneses detalhadas, acompanhar o histórico alimentar, criar avaliações periódicas e monitorar objetivos e progressos ao longo do tempo. Diga adeus às planilhas e papéis: tenha acesso fácil, seguro e organizado a todas as informações clínicas, sempre que precisar.</p>
                    </div>
                </div>

                {/* Bloco 2 invertido */}
                <div className="bloco-funcionalidade invertido">
                    <div className="func-img">
                    <img src={plano_alimentar} alt="Planos Alimentares com IA" />
                    </div>
                    <div className="func-texto">
                    <h3>Planos Alimentares com IA</h3>
                    <p>Crie planos alimentares personalizados de forma rápida e inteligente. Nossa IA analisa dados clínicos, preferências alimentares, restrições e metas individuais para sugerir refeições equilibradas e práticas. Economize tempo no dia a dia e eleve o padrão dos seus atendimentos, oferecendo aos pacientes uma experiência mais ágil, personalizada e profissional.</p>
                    </div>
                </div>

                {/* Bloco 3 */}
                <div className="bloco-funcionalidade">
                    <div className="func-img">
                    <img src={receitas} alt="Agendamento Inteligente" />
                    </div>
                    <div className="func-texto">
                    <h3>Biblioteca de Receitas Saudáveis</h3>
                    <p>Acesse uma seleção completa de receitas saudáveis para complementar os planos alimentares. O NutriHub oferece sugestões que podem ser incluídas diretamente nas recomendações para o paciente, com base em suas preferências, restrições e objetivos. Mais variedade e inspiração na palma da sua mão.</p>
                    </div>
                </div>
            </div>
            <div className="duvidas-home">
                <p className="home-titulo">Dúvidas Frequentes</p>
                <FAQ />
            </div>
            <div className="footer-home">
                <div className="footer-texto">
                    <div className="footer-item">
                        <img src={logo} alt="Logo" style={{marginTop:15}} />
                    </div>
                    <div className="footer-item">
                        <p className="footer-titulo">Política de Privacidade</p>
                        <p><a href="" className="footer-sub">Política de Privacidade e Dados</a></p>
                        <p><a href="" className="footer-sub">Portal de Privacidade</a></p>
                    </div>
                    <div className="footer-item">
                        <p className="footer-titulo">Contato</p>
                        <p><a href="" className="footer-sub">1191234-5678</a></p>
                        <p><a href="" className="footer-sub">contato@gmail.com</a></p>
                    </div>
                </div>
                <div className="copyrights">
                    <p>© 2025 NutriHub - Software para nutricionistas</p>
                </div>
            </div>
        </div>
    );
}
