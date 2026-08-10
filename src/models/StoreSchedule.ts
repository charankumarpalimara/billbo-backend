import { Schema, model, Document } from 'mongoose';

export interface IStoreSchedule extends Document {
  storeId: Schema.Types.ObjectId;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  scheduleCode?: string;
}

const storeScheduleSchema = new Schema<IStoreSchedule>({
  storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  date: { type: String, required: true, trim: true },
  startTime: { type: String, required: true, trim: true },
  endTime: { type: String, required: true, trim: true },
  scheduleCode: { type: String, unique: true, sparse: true, trim: true }
}, { timestamps: true });

export const StoreSchedule = model<IStoreSchedule>('StoreSchedule', storeScheduleSchema);
