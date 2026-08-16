import { Model, ModelStatic, Op } from 'sequelize';

export class BaseRepository<T extends Model> {
  protected model: ModelStatic<T>;

  constructor(model: ModelStatic<T>) {
    this.model = model;
  }

  async create(item: any): Promise<any> {
    return await this.model.create(item);
  }

  async find(filter: any = {}): Promise<any[]> {
    const where = this.mapFilter(filter);
    return await this.model.findAll({ where });
  }

  async findOne(filter: any): Promise<any | null> {
    const where = this.mapFilter(filter);
    return await this.model.findOne({ where });
  }

  async findById(id: any): Promise<any | null> {
    return await this.model.findByPk(id);
  }

  async update(id: any, item: any): Promise<any | null> {
    const instance = await this.model.findByPk(id);
    if (!instance) return null;
    await instance.update(item);
    return instance;
  }

  async delete(id: any): Promise<any | null> {
    const instance = await this.model.findByPk(id);
    if (!instance) return null;
    await instance.destroy();
    return instance;
  }

  async count(filter: any = {}): Promise<number> {
    const where = this.mapFilter(filter);
    return await this.model.count({ where });
  }

  async findPaginated(filter: any = {}, page: number, limit: number): Promise<{ data: any[]; total: number }> {
    const skip = (page - 1) * limit;
    const where = this.mapFilter(filter);
    const { rows, count } = await this.model.findAndCountAll({
      where,
      offset: skip,
      limit,
      order: [['createdAt', 'DESC']],
    });
    return { data: rows, total: count };
  }

  protected mapFilter(filter: any): any {
    if (!filter) return {};
    const mapped: any = {};
    for (const key of Object.keys(filter)) {
      const val = filter[key];
      if (val && typeof val === 'object' && !Array.isArray(val) && !(val instanceof Date)) {
        if ('$in' in val) {
          mapped[key] = val.$in;
        } else if ('$regex' in val) {
          mapped[key] = { [Op.like]: `%${val.$regex}%` };
        } else {
          mapped[key] = val;
        }
      } else {
        mapped[key] = val;
      }
    }
    return mapped;
  }
}
