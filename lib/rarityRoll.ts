// lib/rarityRoll.ts
import { Rarity } from "./packConfig";

export function rollRarity(
  odds: Record<Rarity, number>
): Rarity {
  const rand = Math.random();
  let cumulative = 0;

  for (const rarity of Object.keys(odds) as Rarity[]) {
    cumulative += odds[rarity];
    if (rand <= cumulative) {
      return rarity;
    }
  }

  return "common";
}
