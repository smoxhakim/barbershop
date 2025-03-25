// lib/models/BlockedDay.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IBlockedDay extends Document {
  date: Date;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlockedDaySchema: Schema = new Schema(
  {
    date: {
      type: Date,
      required: [true, 'Date is required'],
      index: true
    },
    reason: {
      type: String,
      default: 'Not available'
    }
  },
  { timestamps: true }
);

// Create a unique index on the date field
BlockedDaySchema.index({ date: 1 }, { unique: true });

// Export the model
export const BlockedDay = mongoose.models.BlockedDay || 
  mongoose.model<IBlockedDay>('BlockedDay', BlockedDaySchema);
