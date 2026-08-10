import { BaseRepository } from './BaseRepository';
import { StoreSchedule, IStoreSchedule } from '../models/StoreSchedule';

export class StoreScheduleRepository extends BaseRepository<IStoreSchedule> {
  constructor() {
    super(StoreSchedule);
  }

  async findAllPopulated(): Promise<IStoreSchedule[]> {
    return await this.model.find().populate('storeId').sort({ date: -1, startTime: 1 }).exec();
  }

  async findPaginatedPopulated(
    page: number,
    limit: number,
    filter: any = {},
    search = ''
  ): Promise<{ data: IStoreSchedule[]; total: number }> {
    const skip = (page - 1) * limit;
    const query: any = { ...filter };

    if (search) {
      query.$or = [
        { scheduleCode: { $regex: search, $options: 'i' } },
        { date: { $regex: search, $options: 'i' } },
        { startTime: { $regex: search, $options: 'i' } },
        { endTime: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await this.model.countDocuments(query).exec();
    const data = await this.model.find(query)
      .populate('storeId')
      .sort({ date: -1, startTime: 1 })
      .skip(skip)
      .limit(limit)
      .exec();
    return { data, total };
  }
}
