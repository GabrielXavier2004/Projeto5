import React, { useState } from 'react';
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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
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

interface ConsultaForm {
  paciente: string;
  data: Date | null;
  hora: Date | null;
  telefone: string;
  observacoes: string;
}

interface Consulta extends ConsultaForm {
  id: string;
}

const initialForm: ConsultaForm = {
  paciente: '',
  data: null,
  hora: null,
  telefone: '',
  observacoes: '',
};

// Dados mockados para exemplo
const consultasMock: Consulta[] = [
  {
    id: '1',
    paciente: 'João Silva',
    data: new Date(2024, 2, 20),
    hora: new Date(2024, 2, 20, 14, 30),
    telefone: '(11) 99999-9999',
    observacoes: 'Primeira consulta'
  },
  {
    id: '2',
    paciente: 'Maria Santos',
    data: new Date(2024, 2, 21),
    hora: new Date(2024, 2, 21, 10, 0),
    telefone: '(11) 88888-8888',
    observacoes: 'Retorno'
  },
];

export const AgendaPage: React.FC = () => {
  const [formData, setFormData] = useState<ConsultaForm>(initialForm);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [consultas] = useState<Consulta[]>(consultasMock);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica para salvar a consulta
    console.log('Dados da consulta:', formData);
    setFormData(initialForm);
    setIsFormOpen(false);
  };

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  return (
    <div className="agenda-container">
      {/* Container de Próximas Consultas */}
      <div className="proximas-consultas">
        <div className="section-header">
          <h2>Próximas Consultas</h2>
          <Button
            variant="contained"
            className="botao-adicionar"
            onClick={toggleForm}
            endIcon={isFormOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          >
            <AddIcon /> Nova Consulta
          </Button>
        </div>

        {/* Formulário Dropdown */}
        <Collapse in={isFormOpen}>
          <div className="form-container">
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <TextField
                  fullWidth
                  label="Nome do Paciente"
                  name="paciente"
                  value={formData.paciente}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="input-group">
                <TextField
                  fullWidth
                  label="Telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="input-group">
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                  <DatePicker
                    label="Data da Consulta"
                    value={formData.data}
                    onChange={(newValue: Date | null) => {
                      setFormData((prev) => ({ ...prev, data: newValue }));
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        className: "date-time-field"
                      },
                    }}
                  />
                </LocalizationProvider>
              </div>

              <div className="input-group">
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                  <TimePicker
                    label="Horário"
                    value={formData.hora}
                    onChange={(newValue: Date | null) => {
                      setFormData((prev) => ({ ...prev, hora: newValue }));
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        className: "date-time-field"
                      },
                    }}
                  />
                </LocalizationProvider>
              </div>

              <div className="input-group">
                <TextField
                  fullWidth
                  label="Observações"
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  className="observation-field"
                />
              </div>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                className="botao-agendar"
              >
                Confirmar Agendamento
              </Button>
            </form>
          </div>
        </Collapse>

        {/* Lista de Consultas */}
        <List className="consultas-list">
          {consultas
            .sort((a, b) => a.data!.getTime() - b.data!.getTime())
            .map((consulta) => (
              <ListItem key={consulta.id} className="consulta-item">
                <div className="consulta-info">
                  <div className="consulta-header">
                    <PersonIcon className="consulta-icon" />
                    <ListItemText 
                      primary={consulta.paciente}
                      secondary={consulta.telefone}
                    />
                  </div>
                  <div className="consulta-datetime">
                    <AccessTimeIcon className="consulta-icon" />
                    <ListItemText 
                      primary={format(consulta.data!, 'dd/MM/yyyy')}
                      secondary={format(consulta.hora!, 'HH:mm')}
                    />
                  </div>
                </div>
              </ListItem>
            ))}
        </List>
      </div>

      {/* Calendário Mensal */}
      <div className="calendario-container">
        <h2>Calendário de Consultas</h2>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
          <DateCalendar
            value={selectedDate}
            onChange={(newValue: Date | null) => setSelectedDate(newValue)}
            className="calendario"
          />
        </LocalizationProvider>
      </div>
    </div>
  );
};

export default AgendaPage;
