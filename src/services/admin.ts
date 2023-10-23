import express from "express";
import { db } from "../utils/db.server";
import { sign, verify } from "jsonwebtoken";
import bcrypt from "bcrypt";

export const createTokens = (email: string) => {
  const accessToken = sign({ email: email }, process.env.SECRET_KEY as string);

  return accessToken;
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
