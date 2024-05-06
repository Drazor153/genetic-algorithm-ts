import type { City } from '../types/City';
import { randomInt } from '../utils';
import { unlink } from 'node:fs/promises';

export async function createRoadsDumpFile(filename: string): Promise<void> {
  const cities: string[] = [
    'Seattle',
    'San Francisco',
    'Los Angeles',
    'Denver',
    'Kansas City',
    'Chicago',
    'Boston',
    'New York',
    'Atlanta',
    'Miami',
    'Dallas',
    'Houston',
  ];
  const file = Bun.file(filename);
  await file.exists() && await unlink(filename);
  const writer = file.writer();

  for (const city of cities) {
    writer.write(`${city},${randomInt(1000)},${randomInt(1000)}\n`);
  }

  writer.end();
}

export async function obtainCities(filename: string): Promise<City[]> {
  const cities: City[] = [];
  const file = Bun.file(filename);
  const lines = (await file.text()).split('\n');
  lines.pop();
  for (const line of lines) {
    const [name, x, y] = line.split(',');
    cities.push({ name, x: +x, y: +y });
  }

  return cities;
}
