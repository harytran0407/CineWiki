import { Request, Response } from 'express';
import { CronService } from '../services/cronService';
import { TMDBService } from '../services/tmdbService';
import { Follow } from '../types';

let userFollows: Follow[] = [
  { user_id: 'demo-user', actor_id: 2038, followed_at: new Date(Date.now() - 7 * 86400000).toISOString() },
  { user_id: 'demo-user', actor_id: 3223, followed_at: new Date(Date.now() - 14 * 86400000).toISOString() }
];

export const getFollows = async (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || 'demo-user';
    const lang = (req.query.lang as string) || 'vi-VN';
    const followedActorIds = userFollows.filter((f) => f.user_id === userId).map((f) => f.actor_id);
    const followedActors = await Promise.all(
      followedActorIds.map(async (id) => {
        try {
          return await TMDBService.getActorDetails(id, lang);
        } catch {
          return null;
        }
      })
    ).then((res) => res.filter((a) => a !== null));

    res.json({ success: true, data: followedActors, followIds: followedActorIds });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const toggleFollowActor = async (req: Request, res: Response) => {
  try {
    const { actorId, userId = 'demo-user' } = req.body;
    const numActorId = parseInt(actorId, 10);

    if (isNaN(numActorId)) {
      return res.status(400).json({ success: false, message: 'actorId không hợp lệ.' });
    }

    const existingIndex = userFollows.findIndex((f) => f.user_id === userId && f.actor_id === numActorId);

    let isFollowing = false;
    if (existingIndex > -1) {
      userFollows.splice(existingIndex, 1);
      isFollowing = false;
    } else {
      userFollows.push({
        user_id: userId,
        actor_id: numActorId,
        followed_at: new Date().toISOString()
      });
      isFollowing = true;
    }

    res.json({ success: true, isFollowing, message: isFollowing ? 'Followed actor successfully' : 'Unfollowed actor' });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || 'demo-user';
    const notifications = CronService.getNotifications(userId);
    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const markNotificationRead = async (req: Request, res: Response) => {
  try {
    const { notificationId, userId = 'demo-user' } = req.body;
    if (notificationId === 'all') {
      CronService.markAllAsRead(userId);
    } else {
      CronService.markAsRead(notificationId);
    }
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const loginOrRegister = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Địa chỉ email không hợp lệ.' });
    }

    if (password && password.length < 4) {
      return res.status(400).json({ success: false, message: 'Mật khẩu phải có ít nhất 4 ký tự.' });
    }

    const userId = `user_${Buffer.from(email).toString('hex').substring(0, 8)}`;

    res.json({
      success: true,
      user: {
        id: userId,
        email,
        name: name || email.split('@')[0] || 'Cinephile Star',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      },
      token: `cw_session_${Date.now()}_${userId}`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
