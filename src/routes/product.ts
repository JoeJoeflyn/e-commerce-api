import express from "express";
import Joi from "joi";

import * as ProductService from "../services/product";
import * as ImageService from "../services/productImages";
import { upload, uploadMemoryStorage } from "../store";

export const productRouter = express.Router();

productRouter.post("/", async (req: express.Request, res: express.Response) => {
  const schema = Joi.object({
    categoryId: Joi.number().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    discountPrice: Joi.number().required(),
    quantity: Joi.number().required(),
    contact: Joi.string().required(),
    location: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  try {
    const newProduct = await ProductService.addProduct(req.body);
    return res.status(201).json(newProduct);
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Server error" });
  }
});
// add imgs.
productRouter.post(
  "/addimage",
  upload.any(),
  async (req: express.Request, res: express.Response) => {
    if (!req.files) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      const images = req.files as Express.Multer.File[];
      const productId = +req.body?.productId;
      const newImage = await ImageService.addImageProduct(images, productId);
      return res.status(201).json(newImage);
    } catch (error: any) {
      return res.status(500).json({ error: error?.message || "Server error" });
    }
  }
);

productRouter.get("/", async (req: express.Request, res: express.Response) => {
  try {
    const products = await ProductService.listProduct(req);
    return res.status(200).json(products);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

productRouter.get(
  "/:id",
  async (req: express.Request, res: express.Response) => {
    const id: number = +req.params.id;
    try {
      const product = await ProductService.getProduct(id);
      return res.status(200).json(product);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  }
);

productRouter.put(
  "/:id",
  async (req: express.Request, res: express.Response) => {
    const id: number = +req.params.id;

    const schema = Joi.object({
      categoryId: Joi.number(),
      name: Joi.string(),
      description: Joi.string(),
      price: Joi.number(),
      discountPrice: Joi.number(),
      quantity: Joi.number(),
      contact: Joi.string(),
      location: Joi.string(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error });
    }

    try {
      const updateProduct = await ProductService.updateProduct(req.body, id);
      return res.status(201).json(updateProduct);
    } catch (error: any) {
      return res.status(500).json({ error: error?.message || "Server error" });
    }
  }
);
