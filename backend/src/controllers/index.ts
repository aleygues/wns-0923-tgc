import { Request, Response } from "express";

export class Controller {
  getAll = (req: Request, res: Response) => {
    console.log(this);
    this.notImplemented(req, res);
  };

  getOne = (req: Request, res: Response) => {
    this.notImplemented(req, res);
  };

  createOne = (req: Request, res: Response) => {
    this.notImplemented(req, res);
  };

  deleteOne = (req: Request, res: Response) => {
    this.notImplemented(req, res);
  };

  patchOne = (req: Request, res: Response) => {
    this.notImplemented(req, res);
  };

  updateOne = (req: Request, res: Response) => {
    this.notImplemented(req, res);
  };

  // we may add createMany, deleteMany, and so on

  notImplemented = (req: Request, res: Response): void => {
    res.status(404).json({
      message: "The controller seems to be missing",
    });
  };
}
