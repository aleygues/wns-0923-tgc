import express from "express";
import sqlite from "sqlite3";

const database = new sqlite.Database("./tgc.sqlite", (err) => {
  if (err) {
    console.log("Error opening db");
  } else {
    console.log("Db connected");
  }
});
database.get("PRAGMA foreign_keys = ON;");

const app = express();
const port = 3000;

app.use(express.json());

app.get("/ads", (req, res) => {
  database.all(
    "SELECT Ad.*, Category.name AS categoryName FROM Ad LEFT JOIN Category ON Category.id = Ad.categoryId",
    (err, rows) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error occured");
      } else {
        res.json(rows);
      }
    }
  );
});

app.post("/ads", (req, res) => {
  database.run(
    "INSERT INTO Ad (title, description, owner, categoryId) VALUES ($title, $description, $owner, $categoryId)",
    {
      $title: req.body.title,
      $description: req.body.description,
      $owner: req.body.owner,
      $categoryId: req.body.categoryId,
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
});

app.listen(port, () => {
  console.log("Server started!");
});
