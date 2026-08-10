import { Schema, model, Types } from 'mongoose';

export interface ITV {
  _id?: any;
  tvCode: string;
  name: string;
  storeId: Types.ObjectId;
  status: 'online' | 'offline';
  lastSeen?: Date;
  serialNumber?: string;
  brand?: string;
  purchaseDate?: string;
  notes?: string;
}

const tvSchema = new Schema<ITV>({
  tvCode: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  status: { type: String, enum: ['online', 'offline'], default: 'offline' },
  lastSeen: { type: Date },
  serialNumber: { type: String, trim: true },
  brand: { type: String, trim: true },
  purchaseDate: { type: String, trim: true },
  notes: { type: String, trim: true }
}, { timestamps: true });

export const TV = model<ITV>('TV', tvSchema);
