import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';
import { Store } from './Store';

export interface ITV {
  id?: number;
  _id?: any;
  tvCode: string;
  name: string;
  storeId: number | any;
  status: 'online' | 'offline';
  lastSeen?: Date;
  serialNumber?: string;
  brand?: string;
  purchaseDate?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class TV extends Model<ITV> implements ITV {
  declare public id: number;
  public get _id(): number {
    return this.id;
  }
  declare public tvCode: string;
  declare public name: string;
  declare public storeId: number;
  declare public status: 'online' | 'offline';
  declare public lastSeen?: Date;
  declare public serialNumber?: string;
  declare public brand?: string;
  declare public purchaseDate?: string;
  declare public notes?: string;
  declare public readonly createdAt: Date;
  declare public readonly updatedAt: Date;
}

TV.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  tvCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  storeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Store,
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('online', 'offline'),
    defaultValue: 'offline',
  },
  lastSeen: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  serialNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  purchaseDate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  sequelize,
  modelName: 'TV',
});

TV.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });
Store.hasMany(TV, { foreignKey: 'storeId', as: 'tvs' });
