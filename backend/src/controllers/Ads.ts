import { Controller } from ".";
import { Request, Response } from "express";
import { Ad } from "../entities/Ad";
import { validate } from "class-validator";

export class AdsController extends Controller {
  getAll = async (req: Request, res: Response) => {
    const ads = Ad.find({
      relations: {
        category: true,
        tags: true,
      },
    });
    res.send(ads);
  };

  getOne = async (req: Request, res: Response) => {
    const ad = await Ad.findOne({
      where: { id: Number(req.params.id) },
      relations: {
        category: true,
        tags: true,
      },
    });
    res.send(ad);
  };

  createOne = async (req: Request, res: Response) => {
    const newAd = new Ad();
    newAd.description = req.body.description;
    newAd.title = req.body.title;
    newAd.category = req.body.category;
    newAd.tags = req.body.tags;

    const errors = await validate(newAd);
    if (errors.length === 0) {
      await newAd.save();
      res.send(newAd);
    } else {
      res.status(400).json({ errors: errors });
    }
  };

  deleteOne = async (req: Request, res: Response) => {
    const ad = await Ad.findOne({ where: { id: Number(req.params.id) } });
    if (ad) {
      await ad.remove();
      res.status(204).send();
    } else {
      res.status(404).send();
    }
  };

  patchOne = async (req: Request, res: Response) => {
    const ad = await Ad.findOne({ where: { id: Number(req.params.id) } });

    if (ad) {
      Object.assign(ad, req.body, { id: ad.id });
      const errors = await validate(ad);
      if (errors.length === 0) {
        await ad.save();
        res.status(204).send();
      } else {
        res.status(400).json({ errors: errors });
      }
    } else {
      res.status(404).send();
    }
  };
}
