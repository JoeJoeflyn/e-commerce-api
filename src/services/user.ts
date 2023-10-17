import express from "express";
import { db } from "../utils/db.server";
import { sign, verify } from "jsonwebtoken";

export const createTokens = (email: string) => {
  const accessToken = sign({ email: email }, process.env.SECRET_KEY as string);

  return accessToken;
};

type User = {
  name: string;
  email: string;
  password: string;
};

export const listUser = async (
  req: express.Request
): Promise<{
  users: User[];
  total: number;
}> => {
  const { page, limit } = req.query as {
    page: string;
    limit: string;
  };

  const offset = (parseInt(page) - 1) * parseInt(limit);

  const users = await db.user.findMany({
    take: parseInt(limit),
    skip: offset,
    select: {
      name: true,
      email: true,
      password: true,
    },
  });

  return {
    total: users.length,
    users,
  };
};

export const getUser = async (
  id: number
): Promise<{ name: string; email: string } | null> => {
  return db.user.findUnique({
    where: {
      id,
    },
    select: {
      name: true,
      email: true,
    },
  });
};

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{ user: User; token: string }> => {
  const user = await db.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("User does not exist");
  }

  const isMatch = await Bun.password.verify(password, user.password);

  if (!isMatch) {
    throw new Error("Password does not correct");
  }

  const token = createTokens(user.email);

  return {
    user,
    token,
  };
};

export const createUser = async (
  user: Omit<User, "id">
): Promise<{ newUser: { name: string; email: string } }> => {
  // hash pass
  user.password = await Bun.password.hash(user.password);

  const { name, email, password } = user;

  const isEmailExist = await db.user.findFirst({
    where: {
      email,
    },
  });

  if (isEmailExist) {
    throw new Error(`User with email ${email} existed`);
  }

  const newUser = await db.user.create({
    data: {
      name,
      email,
      password,
    },
    select: {
      name: true,
      email: true,
    },
  });
  return {
    newUser,
  };
};

export const updateUser = async (
  user: Omit<User, "id">,
  id: number
): Promise<User> => {
  const { name, email, password } = user;

  const isEmailExist = await db.user.findFirst({
    where: {
      email,
    },
  });

  if (isEmailExist) {
    throw new Error("Email must be unique");
  }

  return db.user.update({
    where: {
      id,
    },
    data: {
      name,
      email,
      password,
    },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
    },
  });
};

export const deleteUser = async (id: number): Promise<void> => {
  await db.user.delete({
    where: {
      id,
    },
  });
};
