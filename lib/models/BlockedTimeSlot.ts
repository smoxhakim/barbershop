// lib/models/BlockedTimeSlot.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IBlockedTimeSlot extends Document {
  date: Date;
  time: string;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlockedTimeSlotSchema: Schema = new Schema(
  {
    date: {
      type: Date,
      required: [true, 'Date is required'],
      index: true
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
      validate: {
        validator: function(v: string) {
          // Validate time format (HH:MM)
          return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
        },
        message: (props: { value: string }) => `${props.value} is not a valid time format. Use HH:MM format.`
      }
    },
    reason: {
      type: String,
      default: 'Not available'
    }
  },
  { timestamps: true }
);

// Create a compound unique index on date and time
BlockedTimeSlotSchema.index({ date: 1, time: 1 }, { unique: true });

// Export the model
export const BlockedTimeSlot = mongoose.models.BlockedTimeSlot || 
  mongoose.model<IBlockedTimeSlot>('BlockedTimeSlot', BlockedTimeSlotSchema);
