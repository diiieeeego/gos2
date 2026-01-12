// models/Card.ts
import { Schema, model, models } from "mongoose";

export interface ICard {
  cardId: number; // 1–100 (TVOJ PRIMARNI LOGIČKI ID)
  title: string;
  subtitle?: string;

  imageUrl: string;

  category: "event" | "creator" | "influencer" | "special";
  rarity: "common" | "rare" | "epic" | "legendary";

  description?: string;
  season: string;

  isActive: boolean;
}

const CardSchema = new Schema<ICard>(
  {
    cardId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },

    title: { type: String, required: true },
    subtitle: String,

    imageUrl: { type: String, required: true },

    category: {
      type: String,
      enum: ["event", "creator", "influencer", "special"],
      required: true,
    },

    rarity: {
      type: String,
      enum: ["common", "rare", "epic", "legendary"],
      required: true,
    },

    description: String,
    season: { type: String, required: true },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Card || model<ICard>("Card", CardSchema);
