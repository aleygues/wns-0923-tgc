import { Request, Response } from "express";

export interface Controller {
  getAll(req: Request, res: Response): Promise<void>;
  getOne(req: Request, res: Response): Promise<void>;
  createOne(req: Request, res: Response): Promise<void>;
  deleteOne(req: Request, res: Response): Promise<void>;
  patchOne(req: Request, res: Response): Promise<void>;
  updateOne(req: Request, res: Response): Promise<void>;

  // we may add createMany, deleteMany, and so on
}
