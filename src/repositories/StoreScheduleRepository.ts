import { BaseRepository } from './BaseRepository';
import { StoreSchedule } from '../models/StoreSchedule';
import { Store } from '../models/Store';
import { Op } from 'sequelize';

export class StoreScheduleRepository extends BaseRepository<StoreSchedule> {
  constructor() {
    super(StoreSchedule);
  }

  async findAllPopulated(): Promise<StoreSchedule[]> {
    return await this.model.findAll({
      include: [{ model: Store, as: 'store' }],
      order: [['date', 'DESC'], ['startTime', 'ASC']]
    });
  }

  async findPaginatedPopulated(
    page: number,
    limit: number,
    filter: any = {},
    search = ''
  ): Promise<{ data: StoreSchedule[]; total: number }> {
    const skip = (page - 1) * limit;
    const whereClause = this.mapFilter(filter);

    if (search) {
      whereClause[Op.or] = [
        { scheduleCode: { [Op.like]: `%${search}%` } },
        { date: { [Op.like]: `%${search}%` } },
        { startTime: { [Op.like]: `%${search}%` } },
        { endTime: { [Op.like]: `%${search}%` } }
      ];
    }

    const { rows, count } = await this.model.findAndCountAll({
      where: whereClause,
      include: [{ model: Store, as: 'store' }],
      offset: skip,
      limit,
      order: [['date', 'DESC'], ['startTime', 'ASC']]
    });
    return { data: rows, total: count };
  }
}
