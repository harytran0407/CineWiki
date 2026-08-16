import { TMDBService } from './tmdbService';
import { Notification } from '../types';

let userNotifications: Notification[] = [];

export class CronService {
  static async checkUpcomingMovieUpdates(): Promise<Notification[]> {
    console.log('🔍 [Cron Service] Fetching real upcoming movie releases from TMDB...');
    try {
      const upcomingRes = await TMDBService.getUpcomingMovies('vi-VN', 1);
      const moviesList = upcomingRes?.movies || [];
      if (moviesList.length > 0) {
        const newNotifs: Notification[] = moviesList.slice(0, 5).map((movie: any) => ({
          id: `cron-notif-${movie.id}`,
          user_id: 'all',
          actor_id: movie.id,
          actor_name: movie.title,
          actor_profile: movie.poster_path,
          type: 'new_movie',
          title: `Phim sắp ra mắt: ${movie.title}`,
          content: `${movie.title} dự kiến khởi chiếu vào ngày ${movie.release_date || 'sắp tới'}.`,
          content_vi: `${movie.title} dự kiến khởi chiếu vào ngày ${movie.release_date || 'sắp tới'}.`,
          target_id: movie.id,
          is_read: false,
          created_at: new Date().toISOString()
        }));

        for (const notif of newNotifs) {
          if (!userNotifications.some((n) => n.id === notif.id)) {
            userNotifications.unshift(notif);
          }
        }
      }
    } catch (err) {
      console.warn('[Cron Service Error]', err);
    }
    return userNotifications;
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
