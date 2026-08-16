import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';
import { Store } from './Store';

export interface IStoreSchedule {
  id?: number;
  _id?: any;
  storeId: number | any;
  date: string;
  startTime: string;
  endTime: string;
  scheduleCode?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class StoreSchedule extends Model<IStoreSchedule> implements IStoreSchedule {
  declare public id: number;
  public get _id(): number {
    return this.id;
  }
  declare public storeId: number;
  declare public date: string;
  declare public startTime: string;
  declare public endTime: string;
  declare public scheduleCode?: string;
  declare public readonly createdAt: Date;
  declare public readonly updatedAt: Date;
}

StoreSchedule.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  storeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Store,
      key: 'id'
    }
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startTime: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  scheduleCode: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  }
}, {
  sequelize,
  modelName: 'StoreSchedule',
});

StoreSchedule.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });
Store.hasMany(StoreSchedule, { foreignKey: 'storeId', as: 'schedules' });
