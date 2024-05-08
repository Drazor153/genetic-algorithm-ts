import type { Score } from '../types/Score';
import { randomInt } from '../utils';
import { obtainItems } from './utils';

export async function backpackAlgorithm(args: {
  BAG_CAPACITY: number;
  filename: string;
  loggerFilename: string;
  n_population: number;
  n_generations: number;
}) {
  const {
    BAG_CAPACITY,
    filename,
    loggerFilename,
    n_population,
    n_generations,
  } = args;
  const items = await obtainItems(filename);
  const loggerWriter = Bun.file(loggerFilename).writer();
  loggerWriter.write(
    `Date: ${new Date().toUTCString()}, Num generations: ${n_generations}, Chroms per population: ${n_population}, Maximum backpack capacity: ${BAG_CAPACITY}\n`,
  );

  let population = createPopulation(n_population, items.length);
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
      const itemsCarried: string[] = chrom.reduce((prev, curr, currIndex) => {
        if(!curr) return prev;
        prev.push(items[currIndex].name);
        return prev;
      }, [] as string[]);
      // const obj = { chromosome: chrom.join('-'), score: getScore(chrom) };
      loggerWriter.write(`  Chromosome ${index+1}\n`)
      loggerWriter.write(`     Items: ${JSON.stringify(itemsCarried)}\n`)
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
    const chromosome: number[] = new Array(size).fill(0);
    const leftIndex = Array.from({ length: size }, (_, i) => i);

    let totalWeight = 0;
    while (true) {
      const index = randomInt(leftIndex.length);
      const weightItem = items[leftIndex[index]].weight;
      if (totalWeight + weightItem > BAG_CAPACITY) break;

      chromosome[leftIndex[index]] = 1;
      leftIndex.splice(index, 1);
      totalWeight += weightItem;
    }
    // for (let i = 0; i < size; i++) {
    //   chromosome.push(randomInt(2));
    // }

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
    scores.sort((a, b) => b.score - a.score);
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
    child.push(...parent2.slice(limit));
    return child;
  }

  function mutate(chrom: number[]): void {
    const index = randomInt(chrom.length);
    chrom[index] = chrom[index] === 0 ? 1 : 0;
  }

  function getScore(chromosome: number[]): number {
    const final: { totalWeight: number; totalValue: number } =
      chromosome.reduce(
        (prev, curr, currIndex) => {
          if (!curr) return prev;
          const item = items[currIndex];
          prev.totalWeight += item.weight;
          prev.totalValue += item.value;
          return prev;
        },
        { totalWeight: 0, totalValue: 0 },
      );

    if (final.totalWeight > BAG_CAPACITY) {
      return 0;
    }
    return final.totalValue;
  }
}
