// lib/drawCard.ts
import Card from "@/models/Card";
import { Rarity } from "./packConfig";

export async function drawCard(rarity: Rarity) {
  const cards = await Card.find({
    rarity,
    isActive: true,
  }).lean();

  if (!cards.length) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * cards.length);
  return cards[randomIndex];
}
