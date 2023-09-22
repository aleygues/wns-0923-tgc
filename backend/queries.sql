CREATE TABLE Category (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE Ad (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  owner VARCHAR(255) NOT NULL,
  categoryId INTEGER,
  FOREIGN KEY (categoryId) REFERENCES Category(id)
);

INSERT INTO Category (name) VALUES ("Cars"), ("Bikes");
INSERT INTO Ad (title, owner, categoryId) VALUES 
("Super bike", "toto@aleygues.fr", 2), 
("Super car", "toto@aleygues.fr", 1);

PRAGMA foreign_keys = ON;
INSERT INTO Ad (title, owner, categoryId) VALUES 
("Shoud work", "toto@aleygues.fr", 2);

SELECT 
  a.*, 
  c.name AS categoryName 
FROM 
  Ad AS a 
  LEFT JOIN Category AS c ON c.id = a.categoryId
WHERE
  a.owner = 'toto@aleygues.fr'
  AND c.name = 'Cars';

SELECT 
  Ad.*, 
  Category.name AS categoryName 
FROM 
  Ad LEFT JOIN Category ON Category.id = Ad.categoryId 
WHERE 
  Ad.title LIKE '%Super%';

PRAGMA foreign_keys = ON;
DELETE FROM Ad WHERE id=2;

PRAGMA foreign_keys = ON;
DELETE FROM Category WHERE id=1;

SELECT Ad.*, Category.name AS categoryName FROM Ad LEFT JOIN Category ON Category.id = Ad.categoryId WHERE Ad.title LIKE '%Super%';