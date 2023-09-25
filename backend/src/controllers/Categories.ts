import { Controller } from ".";
import { Request, Response } from "express";
import { Category } from "../entities/Category";
import { validate } from "class-validator";

export class CategoriesController extends Controller {
  getAll = async (req: Request, res: Response) => {
    Category.find()
      .then((categories) => {
        res.send(categories);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send();
      });
  };

  getOne = async (req: Request, res: Response) => {
    const ad = await Category.findOne({
      where: { id: Number(req.params.id) },
    });
    res.send(ad);
  };

  createOne = async (req: Request, res: Response) => {
    const newCategory = new Category();
    newCategory.name = req.body.name;

    const errors = await validate(newCategory);
    if (errors.length === 0) {
      await newCategory.save();
      res.send(newCategory);
    } else {
      res.status(400).json({ errors: errors });
    }
  };

  deleteOne = async (req: Request, res: Response) => {
    const ad = await Category.findOne({
      where: { id: Number(req.params.id) },
    });
    if (ad) {
      await ad.remove();
      res.status(204).send();
    } else {
      res.status(404).send();
    }
  };

  patchOne = async (req: Request, res: Response) => {
    const ad = await Category.findOne({
      where: { id: Number(req.params.id) },
    });

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
