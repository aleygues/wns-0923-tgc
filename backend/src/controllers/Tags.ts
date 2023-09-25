import { Controller } from ".";
import { Request, Response } from "express";
import { Tag } from "../entities/Tag";
import { validate } from "class-validator";

export class TagsController extends Controller {
  getAll = async (req: Request, res: Response) => {
    Tag.find()
      .then((tags) => {
        res.send(tags);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send();
      });
  };

  getOne = async (req: Request, res: Response) => {
    const tag = await Tag.findOne({
      where: { id: Number(req.params.id) },
    });
    res.send(tag);
  };

  createOne = async (req: Request, res: Response) => {
    const newTag = new Tag();
    newTag.name = req.body.name;

    const errors = await validate(newTag);
    if (errors.length === 0) {
      await newTag.save();
      res.send(newTag);
    } else {
      res.status(400).json({ errors: errors });
    }
  };

  deleteOne = async (req: Request, res: Response) => {
    const tag = await Tag.findOne({
      where: { id: Number(req.params.id) },
    });
    if (tag) {
      await tag.remove();
      res.status(204).send();
    } else {
      res.status(404).send();
    }
  };

  patchOne = async (req: Request, res: Response) => {
    const tag = await Tag.findOne({
      where: { id: Number(req.params.id) },
    });

    if (tag) {
      Object.assign(tag, req.body, { id: tag.id });
      const errors = await validate(tag);
      if (errors.length === 0) {
        await tag.save();
        res.status(204).send();
      } else {
        res.status(400).json({ errors: errors });
      }
    } else {
      res.status(404).send();
    }
  };
}
