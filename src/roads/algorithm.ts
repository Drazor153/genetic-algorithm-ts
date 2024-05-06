import type { Score } from '../types/Score';
import { randomInt } from '../utils';
import { obtainCities } from './utils';

export async function roadAlgorithm(args: {
  filename: string;
  loggerFilename: string;
  n_population: number;
  n_generations: number;
}) {
  const { filename, loggerFilename, n_population, n_generations } = args;
  const cities = await obtainCities(filename);
  const MATRIX_DISTANCES: number[][] = new Array(cities.length).fill([]).map(() => new Array(cities.length).fill(0));
  generateDistancesMatrix();

  const loggerWriter = Bun.file(loggerFilename).writer();
  loggerWriter.write(
    `Date: ${new Date().toLocaleDateString()}, Num generations: ${n_generations}, Chroms per population: ${n_population}\n`,
  );

  let population = createPopulation(n_population, cities.length);
  generationLog(0, population);
  // console.log(
  //   'Generacion 0 -> ',
  //   population.map((chrom) => chrom.join(',')),
  // );
  for (let i = 0; i < n_generations; i++) {
    population = generation(population);
    generationLog(i + 1, population);
    // console.log(`Generacion ${i + 1} -> `, population.map(chrom => chrom.join(',')));
  }

  loggerWriter.end();

  function generationLog(i: number, population: number[][]): void {
    loggerWriter.write(`Generation ${i}:\n`);
    population.forEach((chrom, index) => {
      const citiesList = chrom.map((val) => cities[val].name)
      // const obj = { chromosome: chrom.join('-'), score: getScore(chrom) };
      // loggerWriter.write(`   ${JSON.stringify(obj)}\n`);
      loggerWriter.write(`  Chromosome ${index+1}\n`)
      loggerWriter.write(`     Cities: ${JSON.stringify(citiesList)}\n`)
      loggerWriter.write(`     Score: ${getScore(chrom)}\n`);
    });
  }

  function createPopulation(popSize: number, chromSize: number): number[][] {
    const population: number[][] = [];
    for (let i = 0; i < popSize; i++) {
      population.push(createChromosome(chromSize));
    }
    return population;
  }

  function createChromosome(size: number): number[] {
    const chromosome: number[] = [];
    const temp = Array.from({ length: size }, (_, k) => k);

    for (let i = 0; i < size; i++) {
      const index = randomInt(temp.length);
      chromosome.push(temp[index]);
      temp.splice(index, 1);
    }
    return chromosome;
  }

  function generation(popOuter: number[][]): number[][] {
    const bestChroms: number[][] = selection(popOuter);
    const nLeft = popOuter.length - bestChroms.length;
    const childrens: number[][] = [];

    while (childrens.length < nLeft) {
      const parent1 = popOuter[randomInt(popOuter.length)];
      const parent2 = popOuter[randomInt(popOuter.length)];

      const child = crossover(parent1, parent2, Math.round(parent1.length / 2));

      // console.log('Child: ', child);
      // if (Math.random() < 0.1) {
      //   mutate(child);
      //   console.log('Child mutated: ', child);
      // }

      Math.random() < 0.1 && mutate(child);

      childrens.push(child);
    }

    const newGeneration: number[][] = [...bestChroms, ...childrens];
    return newGeneration;
  }

  function selection(popOuter: number[][]): number[][] {
    const GRADED_RETAIN_PERCENT = 0.2;
    const NONGRADED_RETAIN_PERCENT = 0.3;
    const nBest = Math.round(popOuter.length * GRADED_RETAIN_PERCENT);
    const nRandom = Math.round(popOuter.length * NONGRADED_RETAIN_PERCENT);

    const scores: Score[] = popOuter.map((chromosome) => ({
      chromosome,
      score: getScore(chromosome),
    }));
    scores.sort((a, b) => a.score - b.score);
    // console.log(scores[0]);

    const selectedList: number[][] = scores
      .slice(0, nBest)
      .map((score) => score.chromosome);
    const leftChroms = scores.slice(nBest).map((score) => score.chromosome);
    for (let i = 0; i < nRandom; i++) {
      const index = randomInt(leftChroms.length);
      selectedList.push(leftChroms[index]);
      leftChroms.splice(index, 1);
    }

    return selectedList;
  }
  function crossover(
    parent1: number[],
    parent2: number[],
    limit: number,
  ): number[] {
    const child: number[] = parent1.slice(0, limit);
    const temp = parent2.filter((city) => !child.includes(city));
    child.push(...temp);
    return child;
  }

  function mutate(chrom: number[]): void {
    const index1 = randomInt(chrom.length);
    const index2 = randomInt(chrom.length);
    const n1 = chrom[index1];
    const n2 = chrom[index2];
    chrom[index1] = n2;
    chrom[index2] = n1;
  }

  function getScore(chromosome: number[]): number {
    let score = 0;
    for (let i = 0; i < chromosome.length - 1; i++) {
      const startCity = chromosome[i];
      const endCity = chromosome[i + 1];
      const distance = getDistance(startCity, endCity);
      score += distance;
    }
    // chromosome.reduce((prev, curr) => {
    //   const distance = Math.sqrt(Math.pow(cities[prev].x - cities[curr].x, 2) + Math.pow(cities[prev].y - cities[curr].y, 2));
    //   score += distance;
    //   return curr;
    // });
    return score;
  }
  function getDistance(city1: number, city2: number): number {
    // return Math.sqrt(
    //   Math.pow(cities[city1].x - cities[city2].x, 2) +
    //     Math.pow(cities[city1].y - cities[city2].y, 2),
    // );
    return MATRIX_DISTANCES[city1][city2];
  }

  function generateDistancesMatrix(): void {
    for (let i = 0; i < cities.length; i++) {
      for (let j = 0; j < cities.length; j++) {
        const distance = Math.sqrt(
          Math.pow(cities[i].x - cities[j].x, 2) +
            Math.pow(cities[i].y - cities[j].y, 2),
        );
        MATRIX_DISTANCES[i][j] = distance;
      }
    }
  }
}
