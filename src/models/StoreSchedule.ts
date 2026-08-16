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
  public id!: number;
  public get _id(): number {
    return this.id;
  }
  public storeId!: number;
  public date!: string;
  public startTime!: string;
  public endTime!: string;
  public scheduleCode?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
