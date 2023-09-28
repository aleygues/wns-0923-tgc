import { Controller } from ".";
import { Request, Response } from "express";
import { Ad } from "../entities/Ad";
import { validate } from "class-validator";
import { In, LessThanOrEqual, Like, MoreThanOrEqual } from "typeorm";

export class AdsController extends Controller {
  getAll = async (req: Request, res: Response) => {
    // Comment passer des params à nos controller ? 3 possibilités :
    // req.params : /ads/:id. Non (car sert à identifier une ressource)
    // req.body : POST/PUT/PATCH. Non (car ne fonctionne pas sur GET)
    // req.query : /ads?categoryId=12. Oui
    const where: any = {};

    if (typeof req.query.categoryIn === "string") {
      where.category = { id: In(req.query.categoryIn.split(",")) };
    }

    if (req.query.searchTitle) {
      where.title = Like(`%${req.query.searchTitle}%`);
    }

    if (req.query.priceGte) {
      where.price = MoreThanOrEqual(Number(req.query.priceGte));
    }

    if (req.query.priceLte) {
      where.price = LessThanOrEqual(Number(req.query.priceLte));
    }

    const order: any = {};
    if (
      typeof req.query.orderByTitle === "string" &&
      ["ASC", "DESC"].includes(req.query.orderByTitle)
    ) {
      order.title = req.query.orderByTitle; // req.query.orderByTitle = ASC | DESC
    }

    if (
      typeof req.query.orderByPrice === "string" &&
      ["ASC", "DESC"].includes(req.query.orderByPrice)
    ) {
      order.price = req.query.orderByPrice; // req.query.orderByTitle = ASC | DESC
    }

    const ads = await Ad.find({
      where,
      order,
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
    newAd.price = req.body.price;
    newAd.imgUrl = req.body.imgUrl;
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
