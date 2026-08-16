import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

export interface IStore {
  id?: number;
  _id?: any; // Compatibility with MongoDB _id check (represented as string or number)
  name: string;
  location: string;
  storeCode?: string;
  screenPowerStatus?: 'on' | 'off';
  createdAt?: Date;
  updatedAt?: Date;
}

export class Store extends Model<IStore> implements IStore {
  declare public id: number;
  public get _id(): number {
    return this.id;
  }
  declare public name: string;
  declare public location: string;
  declare public storeCode?: string;
  declare public screenPowerStatus?: 'on' | 'off';
  declare public readonly createdAt: Date;
  declare public readonly updatedAt: Date;
}

Store.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  storeCode: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },
  screenPowerStatus: {
    type: DataTypes.ENUM('on', 'off'),
    defaultValue: 'on',
  }
}, {
  sequelize,
  modelName: 'Store',
});
