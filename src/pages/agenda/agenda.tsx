import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Grid as MuiGrid,
  Collapse,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import { collection, query, where, getDocs, addDoc, Timestamp, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../components/firebase/firebaseConfig';
import HeaderNutri from '../../components/headers/header_nutri';
import './agenda.css';

const Grid = MuiGrid as React.ComponentType<{
  container?: boolean;
  item?: boolean;
  xs?: number;
  sm?: number;
  md?: number;
  spacing?: number;
  children?: React.ReactNode;
  className?: string;
}>;

interface Consulta {
  id: string;
  nutricionistaId: string;
  pacienteNome: string;
  data: Date;
  hora: string;
  status: 'agendada' | 'realizada' | 'cancelada';
}

const Agenda: React.FC = () => {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    pacienteNome: '',
    data: '',
    hora: '',
  });

  useEffect(() => {
    carregarConsultas();
  }, []);

  const carregarConsultas = async () => {
    const nutricionistaId = localStorage.getItem("nutriId");
    if (!nutricionistaId) {
      console.log('Nutricionista não autenticado');
      return;
    }

    try {
      const consultasRef = collection(db, 'consultas');
      const q = query(consultasRef, where('nutricionistaId', '==', nutricionistaId));
      const querySnapshot = await getDocs(q);
      
      const consultasData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        data: doc.data().data.toDate(),
      })) as Consulta[];

      setConsultas(consultasData);
    } catch (error) {
      console.error('Erro ao carregar consultas:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nutricionistaId = localStorage.getItem("nutriId");
    if (!nutricionistaId) {
      console.log('Nutricionista não autenticado');
      return;
    }

    try {
      console.log('Iniciando agendamento...');
      console.log('Dados do formulário:', formData);
      
      const dataHora = new Date(`${formData.data}T${formData.hora}`);
      console.log('Data e hora combinadas:', dataHora);
      
      const consultaData = {
        nutricionistaId: nutricionistaId,
        pacienteNome: formData.pacienteNome,
        data: Timestamp.fromDate(dataHora),
        hora: formData.hora,
        status: 'agendada' as const,
      };

      console.log('Dados da consulta a serem salvos:', consultaData);

      const docRef = await addDoc(collection(db, 'consultas'), consultaData);
      console.log('Consulta salva com sucesso! ID:', docRef.id);

      await carregarConsultas();
      setShowForm(false);
      setFormData({
        pacienteNome: '',
        data: '',
        hora: '',
      });
    } catch (error) {
      console.error('Erro ao agendar consulta:', error);
      alert('Erro ao agendar consulta. Por favor, tente novamente.');
    }
  };

  const getConsultasDoDia = (date: Date) => {
    return consultas.filter(consulta => {
      const consultaDate = new Date(consulta.data);
      return (
        consultaDate.getDate() === date.getDate() &&
        consultaDate.getMonth() === date.getMonth() &&
        consultaDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const excluirConsulta = async (consultaId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta consulta?')) {
      try {
        await deleteDoc(doc(db, 'consultas', consultaId));
        await carregarConsultas();
      } catch (error) {
        console.error('Erro ao excluir consulta:', error);
        alert('Erro ao excluir consulta. Por favor, tente novamente.');
      }
    }
  };

  const renderCalendar = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    // Adiciona os dias da semana no cabeçalho
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={`header-${i}`} className="calendar-header-cell">
          {weekDays[i]}
        </div>
      );
    }

    // Adiciona células vazias para os dias antes do primeiro dia do mês
    for (let i = 0; i < startingDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="calendar-cell empty">
        </div>
      );
    }

    // Adiciona os dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const consultasDoDia = getConsultasDoDia(currentDate);
      const hasConsultation = consultasDoDia.length > 0;

      days.push(
        <div
          key={day}
          className={`calendar-cell ${hasConsultation ? 'has-consultation' : ''}`}
          onClick={() => setSelectedDate(currentDate)}
        >
          <span className="day-number">{day}</span>
          {hasConsultation && (
            <div className="consultation-indicator">
              {consultasDoDia.length} consulta{consultasDoDia.length > 1 ? 's' : ''}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="calendar">
        <div className="calendar-header">
          {days.slice(0, 7)}
        </div>
        <div className="calendar-grid">
          {days.slice(7)}
        </div>
      </div>
    );
  };

  return (
    <div>
      <HeaderNutri />
      <div className="agenda-container">
        <div className="agenda-content">
          <div className="calendario-container">
            <div className="section-header">
              <h2>Calendário de {format(selectedDate, 'MMMM', { locale: ptBR })}</h2>
            </div>
            {renderCalendar()}
          </div>

          <div className="proximas-consultas">
            <div className="section-header">
              <h2>Consultas do Dia {format(selectedDate, 'dd/MM/yyyy')}</h2>
              <button
                className="botao-adicionar"
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? 'Cancelar' : 'Nova Consulta'}
              </button>
            </div>

            {showForm && (
              <form onSubmit={handleSubmit} className="form-container">
                <div className="agenda-input-wrapper">
                  <input
                    type="text"
                    placeholder="Nome do Paciente"
                    name="pacienteNome"
                    value={formData.pacienteNome}
                    onChange={handleInputChange}
                    required
                    className="date-time-field"
                  />
                </div>
                <div className="agenda-input-wrapper">
                  <input
                    type="date"
                    name="data"
                    value={formData.data}
                    onChange={handleInputChange}
                    required
                    className="date-time-field"
                  />
                </div>
                <div className="agenda-input-wrapper">
                  <input
                    type="time"
                    name="hora"
                    value={formData.hora}
                    onChange={handleInputChange}
                    required
                    className="date-time-field"
                  />
                </div>
                <button 
                  type="submit" 
                  className="botao-agendar"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit(e);
                  }}
                >
                  Agendar Consulta
                </button>
              </form>
            )}

            <div className="consultas-list">
              {getConsultasDoDia(selectedDate).map((consulta) => (
                <div key={consulta.id} className="consulta-item">
                  <div className="consulta-info">
                    <div className="consulta-header">
                      <span className="consulta-icon">👤</span>
                      <strong>{consulta.pacienteNome}</strong>
                    </div>
                    <div className="consulta-datetime">
                      <span className="consulta-icon">🕒</span>
                      {consulta.hora}
                    </div>
                  </div>
                  <button 
                    className="botao-excluir"
                    onClick={(e) => {
                      e.stopPropagation();
                      excluirConsulta(consulta.id);
                    }}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="todas-consultas-container">
          <div className="section-header">
            <h2>Próximas Consultas</h2>
          </div>
          <div className="todas-consultas-grid">
            {consultas
              .sort((a, b) => a.data.getTime() - b.data.getTime())
              .map((consulta) => (
                <div key={consulta.id} className="consulta-card">
                  <div className="consulta-info">
                    <div className="consulta-header">
                      <span className="consulta-icon">👤</span>
                      <strong>{consulta.pacienteNome}</strong>
                    </div>
                    <div className="consulta-datetime">
                      <span className="consulta-icon">📅</span>
                      {format(consulta.data, 'dd/MM/yyyy')}
                    </div>
                    <div className="consulta-datetime">
                      <span className="consulta-icon">🕒</span>
                      {consulta.hora}
                    </div>
                  </div>
                  <button 
                    className="botao-excluir"
                    onClick={(e) => {
                      e.stopPropagation();
                      excluirConsulta(consulta.id);
                    }}
                  >
                    🗑️
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agenda;
