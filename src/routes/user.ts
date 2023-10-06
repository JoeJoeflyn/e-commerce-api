import express from "express";
import Joi from "joi";

import * as UserService from "../services/user";

export const userRouter = express.Router();

// GET users list
userRouter.get("/", async (req: express.Request, res: express.Response) => {
  try {
    const users = await UserService.listUsers(req);
    return res.status(200).json(users);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

// GET a user by ID
userRouter.get("/:id", async (req: express.Request, res: express.Response) => {
  const id: number = parseInt(req.params.id, 10);

  try {
    const user = await UserService.getUser(id);
    if (user) {
      return res.status(200).json(user);
    }
    return res.status(404).json("User could not be found");
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

// USER LOGIN
userRouter.post(
  "/login",
  async (req: express.Request, res: express.Response) => {
    try {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      });

      const { error, value } = schema.validate(req.body);

      if (error) {
        return res.status(400).json(error);
      }

      const data = await UserService.login({
        email: value.email,
        password: value.password,
      });

      return res.status(200).json({
        ...data,
      });
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  }
);

// POST: Create User
userRouter.post(
  "/register",
  async (req: express.Request, res: express.Response) => {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json(error);
    }

    try {
      const user = req.body;
      const newUser = await UserService.createUser(user);

      return res.status(201).json(newUser);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  }
);

// UPDATE a user
userRouter.put("/:id", async (req: express.Request, res: express.Response) => {
  const id: number = parseInt(req.params.id, 10);

  const schema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string(),
    remember_token: Joi.string(),
  }).options({ abortEarly: false });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json(error);
  }

  try {
    const user = req.body;
    const updateUser = await UserService.updateUser(user, id);
    return res.status(201).json(updateUser);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});
