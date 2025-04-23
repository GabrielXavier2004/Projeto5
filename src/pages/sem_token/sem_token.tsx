import React from "react";
import './sem_token.css';
import { Link } from "react-router-dom";
import logo from "../../content/logo.png"
import paciente_home from '../../content/paciente_home.jpg'
import cadastro from '../../content/cadastro.jpg'
import token from '../../content/token.jpg'
import acesso from '../../content/acesso.jpg'

export default function Sem_Token() {
    return (
        <div className="container-token">
            <div className="header">
                <img src={logo} alt="logo" className="logo"/>
                <Link className="header-topics" to="/">HOME</Link>
                <Link className="header-topics" to="/">SOBRE</Link>
                <Link className="header-topics" to="/">FUNCIONALIDADES</Link>
                <Link className="header-topics" to="/">DÚVIDAS</Link>
                <Link className="login-button" to="/login_paciente">LOGIN PACIENTE</Link>
                <Link className="login-button" to="/login_nutricionista">LOGIN NUTRICIONISTA</Link>
            </div>
            <div className="header-token">
                <h2>Não possui um Token ?</h2>
                <p>Você precisa de um token de acesso. Veja como é simples consegui-lo com seu nutricionista.</p>
            </div>
            <div className="conteudo-token">
                <div className="bloco-funcionalidade">
                    <div className="func-img">
                    <img src={paciente_home} alt="Gestão de Pacientes" />
                    </div>
                    <div className="func-texto">
                    <h3>1. Fale com seu nutricionista sobre o NutriHub</h3>
                    </div>
                </div>
                <div className="bloco-funcionalidade invertido">
                    <div className="func-img">
                    <img src={cadastro} alt="Planos Alimentares com IA" />
                    </div>
                    <div className="func-texto">
                    <h3>2. Solicite que ele faça seu cadastro no sistema</h3>
                    </div>
                </div>
                <div className="bloco-funcionalidade">
                    <div className="func-img">
                    <img src={token} alt="Agendamento Inteligente" />
                    </div>
                    <div className="func-texto">
                    <h3>3. Ele enviará um token exclusivo para você</h3>
                    </div>
                </div>
                <div className="bloco-funcionalidade invertido">
                    <div className="func-img">
                    <img src={acesso} alt="Planos Alimentares com IA" />
                    </div>
                    <div className="func-texto">
                    <h3>4. Use o token e o seu CPF para acessar sua conta</h3>
                    </div>
                </div>
            </div>
            <div className="duvida-token">
                <h2>Ficou com alguma dúvida?</h2>
                <p>Se você ainda não recebeu seu token ou está com dificuldades para acessar o sistema, estamos aqui para te ajudar!</p>
                <p>Entre em contato com a nossa equipe de suporte e responderemos o mais rápido possível.</p>
                <div className="canais-suporte">
                    <h3>📞 Canais de Suporte</h3>
                    <ul>
                        <li><strong>WhatsApp:</strong> <a href="https://wa.me/SEUNUMERO" target="_blank" rel="noopener noreferrer">(11) 99999-9999</a></li>
                        <li><strong>Email:</strong> <a href="mailto:suporte@nutrihub.com">suporte@nutrihub.com</a></li>
                        <li><strong>Instagram:</strong> <a href="https://instagram.com/nutrihub" target="_blank" rel="noopener noreferrer">@nutrihub</a></li>
                        <li><strong>Horário de atendimento:</strong> Segunda a sexta, das 9h às 18h</li>
                    </ul>
                </div>
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
    )
}