import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

const ads = [
  {
    id: 1,
    title: "Bike to sell",
    description:
      "My bike is blue, working fine. I'm selling it because I've got a new one",
    owner: "bike.seller@gmail.com",
    price: 100,
    picture:
      "https://images.lecho.be/view?iid=dc:113129565&context=ONLINE&ratio=16/9&width=640&u=1508242455000",
    location: "Paris",
    createdAt: "2023-09-05T10:13:14.755Z",
  },
  {
    id: 2,
    title: "Car to sell",
    description:
      "My car is blue, working fine. I'm selling it because I've got a new one",
    owner: "car.seller@gmail.com",
    price: 10000,
    picture:
      "https://www.automobile-magazine.fr/asset/cms/34973/config/28294/apres-plusieurs-prototypes-la-bollore-bluecar-a-fini-par-devoiler-sa-version-definitive.jpg",
    location: "Paris",
    createdAt: "2023-10-05T10:14:15.922Z",
  },
];

/**
 * Une solution pour :
 * - filtrer
 * - trier
 * - paginer (limit + offset)
 */
app.get("/ads", (req, res) => {
  res.json(ads);
});

app.post("/ads", (req, res) => {
  const newAd = req.body;
  newAd.id = ads.length + 1;
  newAd.createdAt = new Date().toJSON();
  ads.push(newAd);
  res.json(newAd);
});

app.delete("/ads/:adId", (req, res) => {
  // Express / REST: get params
  // Body (PUT, PATCH, POST): req.body => informations JSON
  // Params: req.params => paramètres d'URL, par d'exemple "/ads/:id"
  // Query Params: req.query => paramètres d'URL, par exemple "ads?id=12"

  // find ad
  const adId = Number(req.params.adId);
  for (let i = 0; i < ads.length; i++) {
    if (ads[i].id === adId) {
      // === (comparaison type puis valeur) ou == (compare les valeurs en changeant les types)
      // delete ad
      ads.splice(i, 1);
      break;
    }
  }

  res.json({ success: true });
});

app.patch("/ads/:adId", (req, res) => {
  const updatedAd = req.body;
  const adId = Number(req.params.adId);
  const ad = ads.find((ad) => ad.id === adId);

  if (ad) {
    Object.assign(ad, updatedAd);
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false });
  }
});

app.put("/ads/:adId", (req, res) => {
  const updatedAd = req.body;
  const adId = Number(req.params.adId);
  const adIndex = ads.findIndex((ad) => ad.id === adId);

  if (adIndex !== -1) {
    updatedAd.id = ads[adIndex].id;
    updatedAd.createdAt = ads[adIndex].createdAt;
    ads[adIndex] = updatedAd;
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false });
  }
});

app.listen(port, () => {
  console.log("Server started!");
});
