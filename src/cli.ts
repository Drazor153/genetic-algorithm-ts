import { input, select, confirm } from '@inquirer/prompts';

export const getUserAlgOpt = async (): Promise<number> => {
  return await select({
    message: 'Algoritmo a poner a prueba:',
    choices: [
      {
        name: 'Algoritmo genético de la mochila',
        value: 1,
      },
      {
        name: 'Algoritmo genético de los viajes',
        value: 2,
      },
      {
        name: 'Salir de menú',
        value: -1,
      },
    ],
  });
};

export const getFormatTimer = async (): Promise<string> => {
  return await select({
    message: 'Elija medida de tiempo a usar:',
    choices: [
      {
        name: 'Segundos',
        value: 's',
      },
      {
        name: 'Minutos',
        value: 'm',
      },
      {
        name: 'Horas',
        value: 'h',
      },
    ],
  });
};

export const askForDumpFile = async (): Promise<boolean> => {
  return await confirm({
    message: '¿Crear archivo de prueba?:',
    default: false,
  });
};

export const getAnswer = async (question: string): Promise<string> => {
  return await input({ message: question });
};
