import cron from 'node-cron';
import { INITIAL_NOTIFICATIONS, MOCK_ACTORS } from '../mockData';
import { Notification } from '../types';

let userNotifications: Notification[] = [...INITIAL_NOTIFICATIONS];

export class CronService {
  static initBackgroundJobs() {
    console.log('⏰ [Cron Service] Background worker initialized. Scanning actor updates every 6 hours...');

    // Run cron job every 6 hours (0 */6 * * *)
    cron.schedule('0 */6 * * *', () => {
      this.checkIdolUpdates();
    });

    // Run once on server startup for instant verification
    setTimeout(() => {
      this.checkIdolUpdates();
    }, 10000);
  }

  static checkIdolUpdates() {
    console.log('🔍 [Cron Service] Checking upcoming movies & award updates for followed idols...');

    // Add mock periodic notification demo item if list is small
    const randomActor = MOCK_ACTORS[Math.floor(Math.random() * MOCK_ACTORS.length)];
    const newNotif: Notification = {
      id: `cron-notif-${Date.now()}`,
      user_id: 'demo-user',
      actor_id: randomActor.id,
      actor_name: randomActor.name,
      actor_profile: randomActor.profile_path,
      type: 'new_movie',
      title: '🌟 Upcoming Project Status Update',
      content: `${randomActor.name} has entered post-production for their new upcoming blockbuster film!`,
      content_vi: `${randomActor.name} vừa chính thức bước vào giai đoạn hậu kỳ cho dự án phim bom tấn sắp ra mắt!`,
      target_id: randomActor.upcoming_movies?.[0]?.id || randomActor.id,
      is_read: false,
      created_at: new Date().toISOString()
    };

    userNotifications.unshift(newNotif);
    console.log(`✅ [Cron Service] New notification pushed for ${randomActor.name}`);
  }

  static getNotifications(userId: string = 'demo-user'): Notification[] {
    return userNotifications.filter((n) => n.user_id === userId);
  }

  static markAsRead(notificationId: string) {
    userNotifications = userNotifications.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n));
  }

  static markAllAsRead(userId: string = 'demo-user') {
    userNotifications = userNotifications.map((n) => (n.user_id === userId ? { ...n, is_read: true } : n));
  }
}
