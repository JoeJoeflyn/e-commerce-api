import express from "express";
import type { Request, Response } from "express";
import Joi from "joi";

import * as UserService from "../services/user";

export const userRouter = express.Router();

// GET users list
userRouter.get("/", async (req: Request, res: Response) => {
  try {
    const users = await UserService.listUsers();
    return res.status(200).json(users);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

// GET a user by ID

userRouter.get("/:id", async (req: Request, res: Response) => {
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
userRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).json(error);
    }

    console.log(value);

    const data = await UserService.login({
      email: value.email,
      password: value.password,
    });

    // res.status(200).json("access-token", data.token);

    return res.status(200).json({
      ...data,
    });
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

// POST: Create User
userRouter.post("/register", async (req: Request, res: Response) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    remember_token: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json(error);
  }

  try {
    const user = req.body;
    // hash pass
    user.password = await Bun.password.hash(user.password);

    const newUser = await UserService.createUser(user);
    return res.status(201).json(newUser);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

// UPDATE a user
userRouter.put("/:id", async (req: Request, res: Response) => {
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
