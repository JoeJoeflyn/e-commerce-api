import express, { NextFunction } from "express";
import Joi from "joi";

import * as AdminService from "../services/admin";

export const adminRouter = express.Router();

export const checkAdmin = async function (
  req: express.Request,
  res: express.Response,
  next: NextFunction
) {
  try {
    const adminExist = await AdminService.checkAdmin(req.body.email);

    if (!adminExist) {
      throw new Error("Usual user will not be allowed to log in");
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Server error" });
  }
};

adminRouter.post(
  "/login",
  async (req: express.Request, res: express.Response) => {
    try {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      });

      const { error, value } = schema.validate(req.body);

      if (error) {
        return res.status(400).json({ error });
      }

      const data = await AdminService.login({
        email: value.email,
        password: value.password,
      });

      return res.status(200).json({
        ...data,
      });
    } catch (error) {
      return res.status(500).json({ error: error?.message || "Server error" });
    }
  }
);

adminRouter.post(
  "/register",
  async (req: express.Request, res: express.Response) => {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error });
    }

    try {
      const newAdmin = await AdminService.createAdmin(req.body);
      return res.status(201).json(newAdmin);
    } catch (error) {
      return res.status(500).json({ error: error?.message || "Server error" });
    }
  }
);

// GET users list
adminRouter.get(
  "/users",
  async (req: express.Request, res: express.Response) => {
    try {
      const users = await AdminService.getUsers(req);
      return res.status(200).json(users);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  }
);
