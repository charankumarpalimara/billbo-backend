import { Schema, model } from 'mongoose';

export interface IStore {
  name: string;
  location: string;
  storeCode?: string;
  screenPowerStatus?: 'on' | 'off';
}

const storeSchema = new Schema<IStore>({
  name: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  storeCode: { type: String, unique: true, sparse: true, trim: true },
  screenPowerStatus: { type: String, enum: ['on', 'off'], default: 'on' }
}, { timestamps: true });

export const Store = model<IStore>('Store', storeSchema);
