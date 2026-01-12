// lib/openPack.ts
import Pack from "@/models/Pack";
import User from "@/models/User";
import { PACK_CONFIG } from "./packConfig";
import { rollRarity } from "./rarityRoll";
import { drawCard } from "./drawCard";
import { PackType } from "./packConfig";



export async function openPack({
  packId,
  userId,
}: {
  packId: string;
  userId: string;
}) {
  const pack = await Pack.findOne({
    _id: packId,
    userId,
    isOpened: false,
  });

  if (!pack) {
    throw new Error("Invalid or already opened pack");
  }

  const config = PACK_CONFIG[pack.packType as PackType];
  const drawnCards = [];

  for (let i = 0; i < config.cardsCount; i++) {
    const rarity = rollRarity(config.rarityOdds);
    const card = await drawCard(rarity);

    if (card) {
      drawnCards.push(card);
    }
  }

  await User.findByIdAndUpdate(userId, {
    $addToSet: {
      ownedCards: { $each: drawnCards.map(c => c._id) },
    },
  });

  pack.isOpened = true;
  pack.openedAt = new Date();
  await pack.save();

  return drawnCards;
}
