// /models/Counter.ts

import {
  Schema,
  model,
  models,
  Document,
  Model,
} from "mongoose";

export interface ICounter extends Document {
  key: string;
  sequence: number;
}

const CounterSchema = new Schema<ICounter>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    sequence: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    versionKey: false,
  }
);

export const Counter: Model<ICounter> =
  models.Counter ||
  model<ICounter>("Counter", CounterSchema);