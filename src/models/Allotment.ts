import { Schema, model, Types } from 'mongoose';

export interface IAllotment {
  storeId: Types.ObjectId;
  adIds: Types.ObjectId[];
  allotmentCode?: string;
}

const allotmentSchema = new Schema<IAllotment>({
  storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true, unique: true },
  adIds: [{ type: Schema.Types.ObjectId, ref: 'Ad' }],
  allotmentCode: { type: String, unique: true, sparse: true, trim: true }
}, { timestamps: true });

export const Allotment = model<IAllotment>('Allotment', allotmentSchema);
