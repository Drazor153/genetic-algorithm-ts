import { createRoadsDumpFile } from './roads/utils';
import { roadAlgorithm } from './roads/algorithm';
import { createBackpackDumpFile } from './backpack/utils';
import { backpackAlgorithm } from './backpack/algorithm';
import {
  askForDumpFile,
  getAnswer,
  getFormatTimer,
  getUserAlgOpt,
} from './cli';
import { timeToMili } from './utils';

async function backpackAlg(cdf: boolean, time: number) {
  const backpackFile = 'src/backpack/mochila50.csv';

  if (cdf) {
    await createBackpackDumpFile('src/backpack/items.csv', 15, 80);
  }
  const bagCapacity = await getAnswer('Capacidad de la mochila:');
  await backpackAlgorithm({
    BAG_CAPACITY: +bagCapacity,
    filename: backpackFile,
    loggerFilename: `src/backpack/results/${new Date().toISOString()}-CAPACITY-${bagCapacity}.txt`,
    n_population: 500,
    n_generations: 1000,
  });
}

async function roadsAlg(cdf: boolean, time: number) {
  const dir = 'src/roads';
  // const roadsFile = 'Viajero15Ciudades_X_Y.csv';
  const roadsFile = 'att48_xy.txt';

  if (cdf) {
    await createRoadsDumpFile('src/roads/cities.csv');
  }
  await roadAlgorithm({
    filename: dir + '/' + roadsFile,
    loggerFilename: `src/roads/results/${new Date().toISOString()}-cities.txt`,
    n_population: 50,
    n_generations: 1000,
    timing: time,
  });
}

async function main() {
  while (1) {
    const opt = await getUserAlgOpt();
    if (opt === -1) break;

    const formatTime = await getFormatTimer();
    const timeVal = await getAnswer('Cantidad:');

    const totalMiliseconds = timeToMili(formatTime, +timeVal);

    const createDumpFile = await askForDumpFile();

    if (opt === 1) {
      await backpackAlg(createDumpFile, totalMiliseconds);
    } else if (opt === 2) {
      await roadsAlg(createDumpFile, totalMiliseconds);
    }
    console.log('---------------------------------');
  }
}
console.clear();
main();

// write('Proceso finalizado\n');
// closeInterface();
