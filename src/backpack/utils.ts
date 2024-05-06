import type { Item } from '../types/Item';
import { randomInt } from '../utils';
import { unlink } from 'node:fs/promises';

export async function createBackpackDumpFile(filename: string, nExamples: number, maxWeight: number): Promise<void> {
  const file = Bun.file(filename);
  await file.exists() && await unlink(filename);
  const writer = file.writer();
  for (let i = 0; i < nExamples; i++) {
    writer.write(`Object ${i},${randomInt(maxWeight, 1)},${randomInt(1000)}\n`);
    
  }
  writer.end();
}

export async function obtainItems(filename: string): Promise<Item[]> {
  const items: Item[] = [];
  const file = Bun.file(filename);
  const lines = (await file.text()).split('\n');
  lines.pop();
  for (const line of lines) {
    const [name, value, weight] = line.split(',');
    items.push({ name, weight: +weight, value: +value });
  }

  return items;
}
