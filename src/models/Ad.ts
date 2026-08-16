import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';
import { Advertiser } from './Advertiser';

export interface IAd {
  id?: number;
  _id?: any;
  title: string;
  youtubeUrl: string;
  duration?: number;
  advertiserId: number | any;
  adCode?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Ad extends Model<IAd> implements IAd {
  public id!: number;
  public get _id(): number {
    return this.id;
  }
  public title!: string;
  public youtubeUrl!: string;
  public duration!: number;
  public advertiserId!: number;
  public adCode?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Ad.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  youtubeUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER,
    defaultValue: 30,
  },
  advertiserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Advertiser,
      key: 'id'
    }
  },
  adCode: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  }
}, {
  sequelize,
  modelName: 'Ad',
});

Ad.belongsTo(Advertiser, { foreignKey: 'advertiserId', as: 'advertiser' });
Advertiser.hasMany(Ad, { foreignKey: 'advertiserId', as: 'ads' });
