import { Schema, model, Types } from 'mongoose';

export interface IAd {
  title: string;
  youtubeUrl: string;
  duration?: number; // in seconds
  advertiserId: Types.ObjectId;
  adCode?: string;
}

const adSchema = new Schema<IAd>({
  title: { type: String, required: true, trim: true },
  youtubeUrl: { type: String, required: true, trim: true },
  duration: { type: Number, default: 30 },
  advertiserId: { type: Schema.Types.ObjectId, ref: 'Advertiser', required: true },
  adCode: { type: String, unique: true, sparse: true, trim: true }
}, { timestamps: true });

export const Ad = model<IAd>('Ad', adSchema);
