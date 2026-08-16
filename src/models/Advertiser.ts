import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

export interface IAdvertiser {
  id?: number;
  _id?: any;
  name: string;
  email?: string;
  phone?: string;
  advertiserCode?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Advertiser extends Model<IAdvertiser> implements IAdvertiser {
  public id!: number;
  public get _id(): number {
    return this.id;
  }
  public name!: string;
  public email?: string;
  public phone?: string;
  public advertiserCode?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Advertiser.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  advertiserCode: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  }
}, {
  sequelize,
  modelName: 'Advertiser',
});
