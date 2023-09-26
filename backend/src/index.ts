import "reflect-metadata";
import express from "express";
import cors from "cors";
import { dataSource } from "./datasource";
import { AdsController } from "./controllers/Ads";
import { CategoriesController } from "./controllers/Categories";
import { TagsController } from "./controllers/Tags";

/*
  CLIENT → (API - Express) SERVEUR (ORM - Typeorm) → BDD (SQLite)
  CLIENT ← (API - Express) SERVEUR (ORM - Typeorm) ← BDD (SQLite)
*/

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

function asyncController(controller: Function) {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      await controller(req, res, next);
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  };
}

const adsController = new AdsController();
app.get("/ads", asyncController(adsController.getAll));
app.get("/ads/:id", asyncController(adsController.getOne));
app.post("/ads", asyncController(adsController.createOne));
app.delete("/ads/:id", asyncController(adsController.deleteOne));
app.patch("/ads/:id", asyncController(adsController.patchOne));
app.put("/ads/:id", asyncController(adsController.updateOne));

const categoriesController = new CategoriesController();
app.get("/categories", asyncController(categoriesController.getAll));
app.get("/categories/:id", asyncController(categoriesController.getOne));
app.post("/categories", asyncController(categoriesController.createOne));
app.delete("/categories/:id", asyncController(categoriesController.deleteOne));
app.patch("/categories/:id", asyncController(categoriesController.patchOne));
app.put("/categories/:id", asyncController(categoriesController.updateOne));

const tagsController = new TagsController();
app.get("/tags", asyncController(tagsController.getAll));
app.get("/tags/:id", asyncController(tagsController.getOne));
app.post("/tags", asyncController(tagsController.createOne));
app.delete("/tags/:id", asyncController(tagsController.deleteOne));
app.patch("/tags/:id", asyncController(tagsController.patchOne));
app.put("/tags/:id", asyncController(tagsController.updateOne));

app.all("*", (req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.listen(port, async () => {
  await dataSource.initialize();
  console.log("Server ready 🚀!");
});
