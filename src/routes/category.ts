import express from "express";
import Joi from "joi";

import * as CategoryService from "../services/category";

export const categoryRouter = express.Router();

categoryRouter.post(
  "/addcategory",
  async (req: express.Request, res: express.Response) => {
    const schema = Joi.object({
      name: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error });
    }

    try {
      const cate = req.body;
      const newCategory = await CategoryService.addCategory(cate);
      return res.status(201).json(newCategory);
    } catch (error: any) {
      return res.status(500).json({ error: error?.message || "Server error" });
    }
  }
);
