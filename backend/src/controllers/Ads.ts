import { Controller } from ".";
import { Request, Response } from "express";
import { Ad } from "../entities/Ad";
import { validate } from "class-validator";

export class AdsController implements Controller {
  async getAll(req: Request, res: Response) {
    Ad.find()
      .then((ads) => {
        res.send(ads);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send();
      });
  }

  async getOne(req: Request, res: Response) {
    try {
      const ad = await Ad.findOne({ where: { id: Number(req.params.id) } });
      res.send(ad);
    } catch (err: any) {
      console.error(err);
      res.status(500).send();
    }
  }

  async createOne(req: Request, res: Response) {
    try {
      const newAd = new Ad();
      newAd.description = req.body.description;
      newAd.title = req.body.title;

      const errors = await validate(newAd);
      if (errors.length === 0) {
        await newAd.save();
        res.send(newAd);
      } else {
        res.status(400).json({ errors: errors });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  }

  async deleteOne(req: Request, res: Response) {
    try {
      const ad = await Ad.findOne({ where: { id: Number(req.params.id) } });
      if (ad) {
        await ad.remove();
        res.status(204).send();
      } else {
        res.status(404).send();
      }
    } catch (err: any) {
      // typeguards
      console.error(err);
      res.status(500).send();
    }
  }

  async patchOne(req: Request, res: Response) {
    try {
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
    } catch (err: any) {
      console.error(err);
      res.status(500).send();
    }
  }

  async updateOne(req: Request, res: Response) {
    try {
      const ad = await Ad.findOne({ where: { id: Number(req.params.id) } });

      if (ad) {
        // should be tested again
        const newAd = Object.assign(req.body, { id: ad.id });
        const errors = await validate(newAd);
        if (errors.length === 0) {
          await Ad.save(newAd);
          res.status(204).send();
        } else {
          res.status(400).json({ errors: errors });
        }
      }

      res.status(204).send();
    } catch (err: any) {
      console.error(err);
      res.status(500).send();
    }
  }
}
