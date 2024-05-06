import { createRoadsDumpFile } from './roads/utils';
import { roadAlgorithm } from './roads/algorithm';
import { createBackpackDumpFile } from './backpack/utils';
import { backpackAlgorithm } from './backpack/algorithm';

import readline from 'node:readline/promises';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const answer1 = await rl.question(`Algoritmo a utilizar:
    1. Algoritmo de la mochila
    2. Algoritmo de caminos
    3. Salir
    -> `);
if (answer1 === '3') {
  rl.close();
  process.exit(0);
}

const backpackFile = 'src/backpack/mochila50.csv';
const roadsFile = 'src/roads/Viajero15Ciudades_X_Y.csv';

const answer2 = await rl.question('¿Crear archivo de prueba? (s/N)');

if (answer1 === '1') {
  if (answer2 === 's' || answer2 === 'S') {
    await createBackpackDumpFile('src/backpack/items.csv', 15, 80);
  }
  const bagCapacity = await rl.question('Capacidad de la mochila: ');
  await backpackAlgorithm({
    BAG_CAPACITY: +bagCapacity,
    filename: backpackFile,
    loggerFilename: `src/backpack/results/${new Date().toISOString()}-CAPACITY-${bagCapacity}.txt`,
    n_population: 10,
    n_generations: 100,
  });
} else if (answer1 === '2') {
  if (answer2 === 's' || answer2 === 'S') {
    await createRoadsDumpFile('src/roads/cities.csv');
  }
  await roadAlgorithm({
    filename: roadsFile,
    loggerFilename: `src/roads/results/${new Date().toISOString()}-cities.txt`,
    n_population: 50,
    n_generations: 1000,
  });
}
rl.write('Proceso finalizado\n');
rl.close();
