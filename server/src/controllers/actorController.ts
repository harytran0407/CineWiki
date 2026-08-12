import { Request, Response } from 'express';
import { TMDBService } from '../services/tmdbService';
import { AIService } from '../services/aiService';

export const getPopularActors = async (req: Request, res: Response) => {
  try {
    const lang = (req.query.lang as string) || 'vi-VN';
    const actors = await TMDBService.getPopularActors(lang);
    return res.json({ success: true, data: actors });
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getActorDetails = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const lang = (req.query.lang as string) || 'vi-VN';
    const actor = await TMDBService.getActorDetails(id, lang);

    if (!actor) {
      return res.status(404).json({ success: false, message: 'Actor not found' });
    }

    return res.json({ success: true, data: actor });
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const compareActors = async (req: Request, res: Response) => {
  try {
    const actorAId = parseInt(req.query.a as string, 10) || 2038;
    const actorBId = parseInt(req.query.b as string, 10) || 3223;
    const lang = (req.query.lang as string) || 'vi-VN';

    const comparison = await TMDBService.compareActors(actorAId, actorBId, lang);
    if (!comparison) {
      return res.status(404).json({ success: false, message: 'Comparison data unavailable' });
    }

    return res.json({ success: true, data: comparison });
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getActorNetworkGraph = async (req: Request, res: Response) => {
  try {
    const actorId = parseInt(req.query.actorId as string, 10) || 2038;
    const graph = await TMDBService.getActorNetworkGraph(actorId);
    return res.json({ success: true, data: graph });
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const translateText = async (req: Request, res: Response) => {
  try {
    const { text, targetLang } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, message: 'Text is required' });
    }

    const translatedText = await AIService.translateOrSummarize(text, targetLang || 'vi');
    return res.json({ success: true, translatedText });
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const enrichActorInsight = async (req: Request, res: Response) => {
  try {
    const { actorId, actorData } = req.body;
    let actorObj = actorData;

    if (!actorObj && actorId) {
      actorObj = await TMDBService.getActorDetails(parseInt(actorId, 10), 'vi-VN');
    }

    if (!actorObj) {
      return res.status(400).json({ success: false, message: 'Actor data or ID required' });
    }

    const insight = await AIService.generateActorInsight(actorObj);
    return res.json({ success: true, data: insight });
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const chatWithAIController = async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const result = await AIService.chatWithAI(message, history || []);
    return res.json({ success: true, reply: result.reply, followUpQuestions: result.followUpQuestions });
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
};
