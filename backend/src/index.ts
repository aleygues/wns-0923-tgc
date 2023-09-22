import "reflect-metadata";
import express from "express";
import { dataSource } from "./datasource";
import { AdsController } from "./controllers/Ads";
import { CategoriesController } from "./controllers/Categories";

const app = express();
const port = 3000;

app.use(express.json());

const adsController = new AdsController();
app.get("/ads", adsController.getAll);
app.get("/ads/:id", adsController.getOne);
app.post("/ads", adsController.createOne);
app.delete("/ads/:id", adsController.deleteOne);
app.patch("/ads/:id", adsController.patchOne);
app.put("/ads/:id", adsController.updateOne);

const categoriesController = new CategoriesController();
app.get("/categories", categoriesController.getAll);
app.get("/categories/:id", categoriesController.getOne);
app.post("/categories", categoriesController.createOne);
app.delete("/categories/:id", categoriesController.deleteOne);
app.patch("/categories/:id", categoriesController.patchOne);
app.put("/categories/:id", categoriesController.updateOne);

app.listen(port, async () => {
  await dataSource.initialize();
  console.log("Server ready 🚀!");
});
