import "reflect-metadata";
import express from "express";
import { dataSource } from "./datasource";
import { Ad } from "./entities/Ad";

const app = express();
const port = 3000;

app.use(express.json());

// GET /ads?categoryId=2
app.get("/ads", (req, res) => {
  Ad.find()
    .then((ads) => {
      res.send(ads);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send();
    });
});

app.get("/ads/:id", async (req, res) => {
  try {
    const ad = Ad.findOne({ where: { id: Number(req.params.id) } });
    res.send(ad);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

app.post("/ads", async (req, res) => {
  try {
    const newAd = new Ad({
      description: req.body.description,
      title: req.body.title,
    });

    await newAd.save();
    res.send(newAd);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

/* 
app.delete("/ads/:adId", (req, res) => {
  database.run(
    "DELETE FROM Ad WHERE id=$adId",
    {
      $adId: req.params.adId,
    },
    (err) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error occured");
      } else {
        res.status(204).send();
      }
    }
  );
});

app.patch("/ads/:adId", (req, res) => {
  let query = "UPDATE Ad SET ";
  const allowedFields = ["title", "description", "owner"];
  const fields = Object.keys(req.body);
  for (const field of fields) {
    if (allowedFields.includes(field) === true) {
      query += field + "=?, ";
    } else {
      res.status(400).json({ message: `Field ${field} not allowed` });
      // this return prevents to go futher
      return;
    }
  }
  const queryWithoutLastComa = query.slice(0, query.length - 2);
  query = queryWithoutLastComa + " WHERE id=?";

  database.run(
    query,
    Object.values(req.body).concat([req.params.adId]),
    (err) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error occured");
      } else {
        res.status(204).send();
      }
    }
  );
});

app.put("/ads/:adId", (req, res) => {
  database.run(
    "UPDATE Ad SET title=$title, description=$description, owner=$owner WHERE id=$adId",
    {
      $adId: req.params.adId,
      $title: req.body.title,
      $description: req.body.description,
      $owner: req.body.owner,
    },
    (err) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error occured");
      } else {
        res.status(204).send();
      }
    }
  );
}); */

// GET /ads
// GET /categories/:categoryId => should return category info (name)
// GET /categories/:categoryId/ads => should return category ads

app.listen(port, async () => {
  await dataSource.initialize();
  console.log("Server ready 🚀!");
});
