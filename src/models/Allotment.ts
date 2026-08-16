import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';
import { Store } from './Store';
import { Ad } from './Ad';

export interface IAllotment {
  id?: number;
  _id?: any;
  storeId: number | any;
  allotmentCode?: string;
  adIds?: any[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class Allotment extends Model<IAllotment> implements IAllotment {
  public id!: number;
  public get _id(): number {
    return this.id;
  }
  public storeId!: number;
  public allotmentCode?: string;
  public adIds?: any[];
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Allotment.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  storeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: Store,
      key: 'id'
    }
  },
  allotmentCode: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  }
}, {
  sequelize,
  modelName: 'Allotment',
});

// Join table for many-to-many Allotment <-> Ad
export class AllotmentAd extends Model {}
AllotmentAd.init({
  allotmentId: {
    type: DataTypes.INTEGER,
    references: {
      model: Allotment,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  adId: {
    type: DataTypes.INTEGER,
    references: {
      model: Ad,
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
}, {
  sequelize,
  modelName: 'AllotmentAd',
  timestamps: false
});

Allotment.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });
Store.hasOne(Allotment, { foreignKey: 'storeId', as: 'allotment' });

Allotment.belongsToMany(Ad, { through: AllotmentAd, foreignKey: 'allotmentId', otherKey: 'adId', as: 'adIds' });
Ad.belongsToMany(Allotment, { through: AllotmentAd, foreignKey: 'adId', otherKey: 'allotmentId', as: 'allotments' });
