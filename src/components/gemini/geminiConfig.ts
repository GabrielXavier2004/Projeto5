import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = "AIzaSyAWi5NaYRjcVGDGfbkrOc553cokr1GrbrA";
const genAI = new GoogleGenerativeAI(apiKey);

export async function generateDiet(anamnese: any, caloriasDieta?: string) {
  const prompt = `Como nutricionista, crie um plano alimentar semanal baseado nas seguintes informações do paciente:
  
Dados Pessoais:
- Idade: ${anamnese.idade}
- Peso: ${anamnese.peso} kg
- Altura: ${anamnese.altura} cm

Histórico de Saúde:
- Alergias: ${anamnese.temAlergia === "sim" ? anamnese.temAlergiaTexto : "Não"}
- Doenças: ${anamnese.doencas}
- Medicamentos: ${anamnese.usaMedicamentos === "sim" ? anamnese.usaMedicamentosTexto : "Não"}
- Cirurgias: ${anamnese.cirurgias}
- Histórico Familiar: ${anamnese.historicoFamiliar}

Hábitos e Estilo de Vida:
- Atividade Física: ${anamnese.atividadeFisica === "sim" ? anamnese.atividadeFisicaTexto : "Não pratica"}
- Frequência de Atividade: ${anamnese.frequenciaAtividade}
- Sono: ${anamnese.sono}
- Estresse: ${anamnese.estresse}
- Tabagismo: ${anamnese.tabagismo}
- Álcool: ${anamnese.alcool}

Hábitos Alimentares:
- Refeições por Dia: ${anamnese.refeicoesPorDia}
- Local das Refeições: ${anamnese.localRefeicoes}
- Quem Prepara: ${anamnese.quemPrepara}
- Alimentos Preferidos: ${anamnese.alimentosPreferidos}
- Alimentos que Não Gosta: ${anamnese.alimentosNaoGosta}
- Intolerâncias: ${anamnese.intolerancias}
- Suplementos: ${anamnese.suplementos}

Objetivos e Restrições:
- Objetivo: ${anamnese.objetivo}
- Restrições Alimentares: ${anamnese.restricoesAlimentares}
${caloriasDieta ? `- Calorias Diárias: ${caloriasDieta} kcal` : ''}

IMPORTANTE: 
1. Forneça APENAS as refeições, sem observações, recomendações ou explicações adicionais.
2. Para CADA alimento, especifique a quantidade em gramas (g), mililitros (ml) ou unidades.
3. Use medidas precisas como: 150g de frango, 100g de arroz, 200ml de leite, 1 unidade de ovo, etc.
4. NÃO use dois pontos (:) após os dias da semana, apenas liste os alimentos diretamente.
${caloriasDieta ? '5. Ajuste as quantidades para atingir o total de ' + caloriasDieta + ' kcal por dia.' : ''}
6. Opte por refeições diferentes para cada dia da semana, evitando repetições.
7. Considere todas as informações fornecidas acima para criar um plano alimentar personalizado.

Formate a resposta EXATAMENTE assim:

Café da Manhã
Segunda [opção com quantidades]
Terça [opção com quantidades]
Quarta [opção com quantidades]
Quinta [opção com quantidades]
Sexta [opção com quantidades]
Sábado [opção com quantidades]
Domingo [opção com quantidades]

Lanche da Manhã
Segunda [opção com quantidades]
Terça [opção com quantidades]
Quarta [opção com quantidades]
Quinta [opção com quantidades]
Sexta [opção com quantidades]
Sábado [opção com quantidades]
Domingo [opção com quantidades]

Almoço
Segunda [opção com quantidades]
Terça [opção com quantidades]
Quarta [opção com quantidades]
Quinta [opção com quantidades]
Sexta [opção com quantidades]
Sábado [opção com quantidades]
Domingo [opção com quantidades]

Lanche da Tarde
Segunda [opção com quantidades]
Terça [opção com quantidades]
Quarta [opção com quantidades]
Quinta [opção com quantidades]
Sexta [opção com quantidades]
Sábado [opção com quantidades]
Domingo [opção com quantidades]

Jantar
Segunda [opção com quantidades]
Terça [opção com quantidades]
Quarta [opção com quantidades]
Quinta [opção com quantidades]
Sexta [opção com quantidades]
Sábado [opção com quantidades]
Domingo [opção com quantidades]

Ceia
Segunda [opção com quantidades]
Terça [opção com quantidades]
Quarta [opção com quantidades]
Quinta [opção com quantidades]
Sexta [opção com quantidades]
Sábado [opção com quantidades]
Domingo [opção com quantidades]`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Erro ao gerar dieta:', error);
    throw error;
  }
}
