import express from "express";
import sqlite from "sqlite3";

// connect to the db file (from root folder)
const database = new sqlite.Database("./tgc.sqlite", (err) => {
  if (err) {
    console.log("Error opening db");
  } else {
    console.log("Db connected");
  }
});
// activate foreign key constraints
database.get("PRAGMA foreign_keys = ON;");

const app = express();
const port = 3000;

app.use(express.json());

/**
 * Ads routes
 */
app.get("/ads", (req, res) => {
  let query =
    "SELECT Ad.*, Category.name AS categoryName FROM Ad LEFT JOIN Category ON Category.id = Ad.categoryId";

  // check search params, for ad title and category name
  const variables: string[] = [];
  const whereClauses: string[] = [];
  if (
    typeof req.query.adTitle === "string" &&
    req.query.adTitle.trim() !== ""
  ) {
    whereClauses.push("Ad.title LIKE ?");
    variables.push("%" + req.query.adTitle.trim() + "%");
  }
  if (
    typeof req.query.categoryName === "string" &&
    req.query.categoryName.trim() !== ""
  ) {
    whereClauses.push("Category.name LIKE ?");
    variables.push("%" + req.query.categoryName.trim() + "%");
  }

  // if whereClauses not empty, should add then to the SQL query
  if (whereClauses.length !== 0) {
    // note that [].join(str) converts an array to a string, each item being
    // separated by str
    query += " WHERE " + whereClauses.join(" AND ");
  }
  database.all(query, variables, (err, rows) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error occured");
    } else {
      res.json(rows);
    }
  });
});

// Here we use database.get instead of database.all to get only one line
app.get("/ads/:adId", (req, res) => {
  database.get(
    "SELECT Ad.*, Category.name AS categoryName FROM Ad LEFT JOIN Category ON Category.id = Ad.categoryId WHERE id=$adId",
    { adId: req.params.adId },
    (err, row) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error occured");
      } else {
        res.json(row);
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
  const allowedFields = ["title", "description", "owner", "categoryId"];
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
    "UPDATE Ad SET title=$title, description=$description, owner=$owner, categoryId=$categoryId WHERE id=$adId",
    {
      $adId: req.params.adId,
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

/**
 * Categories routes
 */
// Feature: included with ads count!
app.get("/categories", (req, res) => {
  database.all(
    "SELECT Category.*, COUNT(*) AS adsCount FROM Category LEFT JOIN Ad ON Category.id = Ad.categoryId GROUP BY Category.id",
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

// including ads count
app.get("/categories/:categoryId", (req, res) => {
  database.get(
    "SELECT Category.*, COUNT(*) AS adsCount FROM Category LEFT JOIN Ad ON Category.id = Ad.categoryId WHERE Category.id=$categoryId",
    { $categoryId: req.params.categoryId },
    (err, row) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error occured");
      } else {
        res.json(row);
      }
    }
  );
});

app.post("/categories", (req, res) => {
  database.run(
    "INSERT INTO Category (name) VALUES ($name)",
    {
      $name: req.body.name,
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

app.delete("/categories/:categoryId", (req, res) => {
  database.run(
    "DELETE FROM Category WHERE id=$categoryId",
    {
      $categoryId: req.params.categoryId,
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

app.patch("/categories/:categoryId", (req, res) => {
  let query = "UPDATE Category SET ";
  const allowedFields = ["name"];
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
    Object.values(req.body).concat([req.params.categoryId]),
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

/**
 * Nested ads of category
 */
app.get("/categories/:categoryId/ads", (req, res) => {
  database.all(
    "SELECT Ad.*, Category.name AS categoryName FROM Ad LEFT JOIN Category ON Category.id = Ad.categoryId WHERE Ad.categoryId=$categoryId",
    { $categoryId: req.params.categoryId },
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

// start the server
app.listen(port, () => {
  console.log("Server started!");
});
