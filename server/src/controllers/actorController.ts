import { Request, Response } from 'express';
import { TMDBService } from '../services/tmdbService';
import { AIService } from '../services/aiService';

export const getPopularActors = async (req: Request, res: Response) => {
  try {
    const lang = (req.query.lang as string) || 'vi-VN';
    const page = parseInt(req.query.page as string, 10) || 1;
    const country = req.query.country as string;
    const gender = req.query.gender as string;
    const department = req.query.department as string;

    const result = await TMDBService.getPopularActors(lang, page, {
      countryFilter: country,
      genderFilter: gender,
      departmentFilter: department
    });
    return res.json({ success: true, data: result.actors, page, total_pages: result.total_pages });
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
    const { message, history, contextData } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const result = await AIService.chatWithAI(message, history || [], contextData);
    return res.json({ success: true, reply: result.reply, followUpQuestions: result.followUpQuestions });
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const chatWithAIStreamController = async (req: Request, res: Response) => {
  try {
    const { message, history, contextData } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const result = await AIService.chatWithAI(message, history || [], contextData);

    // Stream out chunks to simulated SSE / Chunked stream
    const replyText = result.reply;
    const words = replyText.split(' ');

    for (let i = 0; i < words.length; i += 3) {
      const chunk = words.slice(i, i + 3).join(' ') + ' ';
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
      await new Promise((r) => setTimeout(r, 40));
    }

    res.write(`data: ${JSON.stringify({ done: true, followUpQuestions: result.followUpQuestions })}\n\n`);
    res.end();
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: (error as Error).message });
    } else {
      res.write(`data: ${JSON.stringify({ error: (error as Error).message })}\n\n`);
      res.end();
    }
  }
};
