import { StoreScheduleRepository } from '../repositories/StoreScheduleRepository';
import { IStoreSchedule } from '../models/StoreSchedule';
import { Store } from '../models/Store';

export class StoreScheduleService {
  private scheduleRepository = new StoreScheduleRepository();

  async getSchedules(): Promise<IStoreSchedule[]> {
    return await this.scheduleRepository.findAllPopulated();
  }

  async getSchedulesPaginated(page: number, limit: number, storeId = '', search = ''): Promise<{ data: IStoreSchedule[]; total: number }> {
    const filter = storeId ? { storeId } : {};
    return await this.scheduleRepository.findPaginatedPopulated(page, limit, filter, search);
  }

  async createSchedulesBatch(payload: {
    storeId: string;
    startDate: string;
    endDate?: string;
    useRange: boolean;
    sessions: { startTime: string; endTime: string }[];
  }): Promise<IStoreSchedule[]> {
    const { storeId, startDate, endDate, useRange, sessions } = payload;
    if (!storeId || !startDate || !sessions || sessions.length === 0) {
      throw new Error('Missing required fields');
    }

    const dates: string[] = [];
    if (useRange && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dates.push(d.toISOString().split('T')[0]);
      }
    } else {
      dates.push(startDate);
    }

    const allExisting = await this.scheduleRepository.find({ storeId, date: { $in: dates } });

    for (let i = 0; i < sessions.length; i++) {
      const s1 = sessions[i];
      if (s1.startTime >= s1.endTime) {
        throw new Error(`Invalid session time: ${s1.startTime} - ${s1.endTime}`);
      }
      for (let j = i + 1; j < sessions.length; j++) {
        const s2 = sessions[j];
        if (s1.startTime < s2.endTime && s2.startTime < s1.endTime) {
          throw new Error(`Overlap between sessions inside the form: ${s1.startTime} and ${s2.startTime}`);
        }
      }
    }

    for (const date of dates) {
      const existingOnDate = allExisting.filter(sch => sch.date === date);
      for (const sess of sessions) {
        const isOverlap = existingOnDate.some(sch => {
          return sess.startTime < sch.endTime && sch.startTime < sess.endTime;
        });
        if (isOverlap) {
          throw new Error(`Schedule timing conflict on ${date} for ${sess.startTime} - ${sess.endTime}.`);
        }
      }
    }

    const allSchedules = await this.scheduleRepository.find({});
    let nextNum = 101;
    allSchedules.forEach(s => {
      if (s.scheduleCode && s.scheduleCode.startsWith('SCH_')) {
        const num = parseInt(s.scheduleCode.substring(4));
        if (!isNaN(num) && num >= nextNum) {
          nextNum = num + 1;
        }
      }
    });

    const created: IStoreSchedule[] = [];
    for (const date of dates) {
      for (const sess of sessions) {
        const code = `SCH_${nextNum++}`;
        const newSch = await this.scheduleRepository.create({
          storeId: storeId as any,
          date,
          startTime: sess.startTime,
          endTime: sess.endTime,
          scheduleCode: code
        });
        created.push(newSch);
      }
    }

    return created;
  }

  async createSchedule(data: Partial<IStoreSchedule>): Promise<IStoreSchedule> {
    if (!data.storeId || !data.date || !data.startTime || !data.endTime) {
      throw new Error('Missing required fields');
    }

    // Check for overlap on the same date for the same store
    const existing = await this.scheduleRepository.find({ storeId: data.storeId, date: data.date });
    const isOverlap = existing.some(sch => {
      return data.startTime! < sch.endTime && sch.startTime < data.endTime!;
    });
    if (isOverlap) {
      throw new Error('Schedule timing overlaps with an existing session on this date.');
    }

    const allSchedules = await this.scheduleRepository.find({});
    let nextNum = 101;
    allSchedules.forEach(s => {
      if (s.scheduleCode && s.scheduleCode.startsWith('SCH_')) {
        const num = parseInt(s.scheduleCode.substring(4));
        if (!isNaN(num) && num >= nextNum) {
          nextNum = num + 1;
        }
      }
    });

    const code = `SCH_${nextNum}`;
    return await this.scheduleRepository.create({ ...data, scheduleCode: code });
  }

  async updateSchedule(id: string, data: Partial<IStoreSchedule>): Promise<IStoreSchedule | null> {
    const current = await this.scheduleRepository.findById(id);
    if (!current) throw new Error('Schedule not found');

    const storeId = data.storeId || current.storeId;
    const date = data.date || current.date;
    const startTime = data.startTime || current.startTime;
    const endTime = data.endTime || current.endTime;

    // Check overlap excluding this schedule
    const existing = await this.scheduleRepository.find({ storeId, date });
    const isOverlap = existing.some(sch => {
      if (sch._id.toString() === id) return false;
      return startTime < sch.endTime && sch.startTime < endTime;
    });
    if (isOverlap) {
      throw new Error('Schedule timing overlaps with an existing session on this date.');
    }

    return await this.scheduleRepository.update(id, data);
  }

  async deleteSchedule(id: string): Promise<IStoreSchedule | null> {
    return await this.scheduleRepository.delete(id);
  }

  // Active status check: checks if current local time is within any session today, and returns the details
  async getStoreActiveStatus(storeIdOrCode: string): Promise<{
    isActive: boolean;
    currentSession: IStoreSchedule | null;
    todaySchedules: IStoreSchedule[];
  }> {
    let store = await Store.findOne({ storeCode: storeIdOrCode }).exec();
    if (!store) {
      try {
        store = await Store.findById(storeIdOrCode).exec();
      } catch (_) {
        // Invalid ObjectId, safe to ignore
      }
    }

    if (!store) {
      return { isActive: false, currentSession: null, todaySchedules: [] };
    }

    const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const now = new Date();
    const currentHHMM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const todaysSchedules = await this.scheduleRepository.find({ storeId: store._id.toString(), date: todayStr });
    
    const currentSession = todaysSchedules.find(sch => {
      return currentHHMM >= sch.startTime && currentHHMM <= sch.endTime;
    }) || null;

    return {
      isActive: currentSession !== null,
      currentSession,
      todaySchedules: todaysSchedules
    };
  }
}
