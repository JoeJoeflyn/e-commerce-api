import express from "express";
import { db } from "../utils/db.server";
import { sign, verify } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

export const createTokens = (email: string) => {
  const accessToken = sign({ email: email }, process.env.SECRET_KEY as string);

  return accessToken;
};

type User = {
  name: string;
  email: string;
  password: string;
};

type Admin = {
  name: string;
  email: string;
  password: string;
};

export const checkAdmin = async (email: string): Promise<Admin> => {
  const admin = await db.admin.findFirst({
    where: {
      email,
    },
  });

  return admin;
};

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{ admin: Admin; token: string }> => {
  const admin = await db.admin.findFirst({
    where: {
      email,
    },
  });

  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    throw new Error("Password does not correct");
  }

  const token = createTokens(admin.email);

  return {
    admin,
    token,
  };
};

export const createAdmin = async (
  admin: Omit<Admin, "id">
): Promise<{ newAdmin: { name: string; email: string } }> => {
  // hash pass
  admin.password = await bcrypt.hash(admin.password, 10);

  const { name, email, password } = admin;

  const isEmailExist = await db.admin.findFirst({
    where: {
      email,
    },
  });

  if (isEmailExist) {
    throw new Error(`Admin with email ${email} existed`);
  }

  const newAdmin = await db.admin.create({
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
    newAdmin,
  };
};

export const getUsers = async (
  req: express.Request
): Promise<{
  total: number;
  users: User[];
}> => {
  const { page, limit, search } = req.query as {
    page: string;
    limit: string;
    search: string;
  };

  const offset = (+page - 1) * +limit;

  let objectQuery: {
    select?: Prisma.UserSelect<DefaultArgs>;
    where?: Prisma.UserWhereInput;
    take?: number;
    skip?: number;
  } = {
    take: +limit,
    skip: offset,
    select: {
      name: true,
      email: true,
      password: true,
    },
  };

  if (search) {
    objectQuery = {
      ...objectQuery,
      where: {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      },
    };
  }

  const users = await db.user.findMany(objectQuery);

  const total = await db.user.count({
    where: {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    },
  });

  return {
    total,
    users,
  };
};
