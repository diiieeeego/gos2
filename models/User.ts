import { Schema, model, models, Types } from "mongoose";

export interface IUser {
  walletAddress: string;
  username: string;
  avatarUrl?: string;
  
  // DODANO: Razlikovanje između bodova i valute
  currency: number; 
  level: number;
  xp: number;

  ownedCards: Types.ObjectId[];

  pointsDaily: number;
  pointsWeekly: number;
  pointsTotal: number;

  packs: {
    packType: string;
    quantity: number;
  }[];

  loginStreak: number;
  lastLoginAt?: Date;
  lastRoll?: Date;

  
  role: "player" | "admin";
  
}

const UserSchema = new Schema<IUser>(
  {
    walletAddress: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true, // DODANO: miče prazna mjesta ako se slučajno pojave
      index: true,
    },

    username: { 
        type: String, 
        required: true,
        trim: true,
        minLength: [3, "Username must be at least 3 characters"] 
    },
    
    avatarUrl: { type: String, default: "" },

    // DODANO: Početne vrijednosti za progresiju
    currency: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },

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
    lastLoginAt: { type: Date },
    lastRoll: { 
      type: Date, 
      default: null 
    },
    
    // DODANO: Default role
    role: { type: String, enum: ["player", "admin"], default: "player" }
  },
  { timestamps: true }
);

// DODANO: Middleware za automatski reset streak-a ili level up logiku (opcionalno)
// Ovdje možeš dodati funkcije koje se izvršavaju prije spremanja (pre-save)

export default models.User || model<IUser>("User", UserSchema);