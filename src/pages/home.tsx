import React from "react";
import './home.css';
import logo from "../content/logo.png";
import banner from "../content/banner.png";
import FAQ from '../components/FAQ/FAQ';
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
                <p className="home-titulo">Software para Nutricionistas integrado com Inteligência Artificial</p>
                <p className="sobre-texto">Tudo que um nutricionista precisa está disponível em um único lugar. É um software completo, projetado para elevar o padrão dos atendimentos, conquistar a fidelidade e encantar os pacientes por meio da tecnologia.</p>
            </div>
            <div className="funcionalidades-home" id="funcionalidades">
                <p className="home-titulo">Funcionalidades</p>
                <div className="cards-func-home">
                    <div className="card-home">
                        <p className="titulo-card-home">Calculo de planos alimentares</p>
                        <p className="texto-card-home">Calcula planos alimentares de forma flexível e precisa. Com métodos livres, os usuários têm a liberdade de personalizar seus planos, enquanto os métodos calculados utilizam algoritmos inteligentes.</p>
                    </div>
                    <div className="card-home">
                        <p className="titulo-card-home">Calculo de planos alimentares</p>
                        <p className="texto-card-home">Calcula planos alimentares de forma flexível e precisa. Com métodos livres, os usuários têm a liberdade de personalizar seus planos, enquanto os métodos calculados utilizam algoritmos inteligentes.</p>
                    </div>
                    <div className="card-home">
                        <p className="titulo-card-home">Calculo de planos alimentares</p>
                        <p className="texto-card-home">Calcula planos alimentares de forma flexível e precisa. Com métodos livres, os usuários têm a liberdade de personalizar seus planos, enquanto os métodos calculados utilizam algoritmos inteligentes.</p>
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
                    <p>© 2025 Projeto5 - Software para nutricionistas</p>
                </div>
            </div>
        </div>
    );
}
