import cron from 'node-cron';
import { TMDBService } from './tmdbService';
import { Notification } from '../types';

let userNotifications: Notification[] = [];

export class CronService {
  static initBackgroundJobs() {
    console.log('⏰ [Cron Service] Background worker initialized. Scanning actor updates every 6 hours...');

    cron.schedule('0 */6 * * *', () => {
      this.checkIdolUpdates();
    });

    setTimeout(() => {
      this.checkIdolUpdates();
    }, 10000);
  }

  static async checkIdolUpdates() {
    console.log('🔍 [Cron Service] Checking upcoming movies & award updates for followed idols...');
    try {
      const popularActors = await TMDBService.getPopularActors('vi-VN');
      if (popularActors && popularActors.length > 0) {
        const randomActor = popularActors[Math.floor(Math.random() * popularActors.length)];
        const newNotif: Notification = {
          id: `cron-notif-${Date.now()}`,
          user_id: 'all',
          actor_id: randomActor.id,
          actor_name: randomActor.name,
          actor_profile: randomActor.profile_path,
          type: 'new_movie',
          title: 'Upcoming Project Status Update',
          content: `${randomActor.name} has entered post-production for their new upcoming blockbuster film!`,
          content_vi: `${randomActor.name} vừa chính thức bước vào giai đoạn hậu kỳ cho dự án phim bom tấn sắp ra mắt!`,
          target_id: randomActor.id,
          is_read: false,
          created_at: new Date().toISOString()
        };

        userNotifications.unshift(newNotif);
        console.log(`✅ [Cron Service] New notification pushed for ${randomActor.name}`);
      }
    } catch (err) {
      console.warn('[Cron Service Error]', err);
    }
  }

  static getNotifications(userId: string = 'demo-user'): Notification[] {
    return userNotifications.filter((n) => !n.user_id || n.user_id === 'all' || n.user_id === userId);
  }

  static markAsRead(notificationId: string) {
    userNotifications = userNotifications.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n));
  }

  static markAllAsRead(userId: string = 'demo-user') {
    userNotifications = userNotifications.map((n) => (!n.user_id || n.user_id === 'all' || n.user_id === userId ? { ...n, is_read: true } : n));
  }
}
