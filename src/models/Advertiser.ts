import { Schema, model } from 'mongoose';

export interface IAdvertiser {
  name: string;
  email?: string;
  phone?: string;
  advertiserCode?: string;
}

const advertiserSchema = new Schema<IAdvertiser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true },
  phone: { type: String, trim: true },
  advertiserCode: { type: String, unique: true, sparse: true, trim: true }
}, { timestamps: true });

export const Advertiser = model<IAdvertiser>('Advertiser', advertiserSchema);
