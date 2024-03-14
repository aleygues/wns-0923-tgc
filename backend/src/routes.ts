import multer from "multer";
import { Express } from "express";
import { Image } from "./entities/Image";
import sharp from "sharp";

/**
 * 1 - X support upload
 * 2 - X new entity image + relation
 * 3 - X read images
 * 4 - resize image on upload
 * 5 - frontend part
 */

export function initializeRoutes(app: Express) {
  const storage = multer.memoryStorage();
  const upload = multer({ storage: storage });

  /*   let mime: any;
  import("mime").then((m) => (mime = m.default)); */

  app.post("/api/images", upload.single("file"), async (req, res) => {
    if (req.file && req.file.mimetype.startsWith("image/")) {
      /* const extension = mime.getExtension(req.file.mimetype); */
      const extension = req.file.originalname.split(".").pop();
      const filename = `${Date.now()}-${
        Math.log(Math.random() * 8999) + 1000
      }.${extension}`;

      await sharp(req.file.buffer)
        .resize(2000, 2000, { fit: "contain" })
        .toFile(`/app/uploads/${filename}`);

      const newImage = new Image();
      newImage.mimetype = req.file.mimetype;
      newImage.originalName = req.file.originalname;
      newImage.path = `/app/uploads/${filename}`;
      await newImage.save();
      res.json({ success: true, image: newImage });
    } else {
      res.json({ success: false });
    }
  });

  app.get("/api/images/:imageId", async (req, res) => {
    const imageId = Number(req.params.imageId);
    const image = await Image.findOneBy({ id: imageId });
    if (image) {
      res.sendFile(image.path);
    } else {
      res.status(404).send();
    }
  });
}
