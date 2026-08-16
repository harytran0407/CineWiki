import { Request, Response } from 'express';
import { CronService } from '../services/cronService';

export const handleCronNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await CronService.checkUpcomingMovieUpdates();
    return res.json({ success: true, message: 'Cron job executed successfully', notificationsCount: notifications.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
};
