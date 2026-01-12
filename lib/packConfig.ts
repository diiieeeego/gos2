// lib/packConfig.ts
export type Rarity = "common" | "rare" | "epic" | "legendary";
export type PackType = "basic" | "event" | "premium";

export const PACK_CONFIG: Record<
  PackType,
  {
    cardsCount: number;
    rarityOdds: Record<Rarity, number>;
  }
> = {
  basic: {
    cardsCount: 3,
    rarityOdds: {
      common: 0.7,
      rare: 0.25,
      epic: 0.05,
      legendary: 0,
    },
  },

  event: {
    cardsCount: 3,
    rarityOdds: {
      common: 0.5,
      rare: 0.35,
      epic: 0.15,
      legendary: 0,
    },
  },

  premium: {
    cardsCount: 3,
    rarityOdds: {
      common: 0,
      rare: 0.6,
      epic: 0.3,
      legendary: 0.1,
    },
  },
};
