// models/User.ts
import { Schema, model, models, Types } from "mongoose";

export interface IUser {
  walletAddress: string;
  username: string;
  avatarUrl?: string;

  ownedCards: Types.ObjectId[]; // reference na Card._id

  pointsDaily: number;
  pointsWeekly: number;
  pointsTotal: number;

  packs: {
    packType: string;
    quantity: number;
  }[];

  loginStreak: number;
  lastLoginAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    walletAddress: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    username: { type: String, required: true },
    avatarUrl: String,

    ownedCards: [
      {
        type: Schema.Types.ObjectId,
        ref: "Card",
      },
    ],

    pointsDaily: { type: Number, default: 0 },
    pointsWeekly: { type: Number, default: 0 },
    pointsTotal: { type: Number, default: 0 },

    packs: [
      {
        packType: { type: String, required: true },
        quantity: { type: Number, default: 0 },
      },
    ],

    loginStreak: { type: Number, default: 0 },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

export default models.User || model<IUser>("User", UserSchema);
