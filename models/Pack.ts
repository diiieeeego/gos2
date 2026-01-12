// models/Pack.ts
import { Schema, model, models, Types } from "mongoose";

export interface IPack {
  userId: Types.ObjectId;

  packType: "basic" | "event" | "premium";
  cardsCount: number; // npr. 3

  isOpened: boolean;
  openedAt?: Date;

  createdAt: Date;
}

const PackSchema = new Schema<IPack>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    packType: {
      type: String,
      enum: ["basic", "event", "premium"],
      required: true,
    },

    cardsCount: {
      type: Number,
      default: 3,
    },

    isOpened: { type: Boolean, default: false },
    openedAt: Date,
  },
  { timestamps: true }
);

export default models.Pack || model<IPack>("Pack", PackSchema);
