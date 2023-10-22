import express from "express";
import { db } from "../utils/db.server";

export const addCategory = async (
  category: Omit<{ name: string }, "id">
): Promise<{ newCategory: { name: string; created_at: Date } }> => {
  // Check if category could be duplicated
  const checkUniqueCategory = await db.category.findMany({
    where: {
      name: {
        equals: category.name,
        mode: "insensitive",
      },
    },
  });

  if (checkUniqueCategory) {
    throw new Error("Category could not be duplicated");
  }

  const newCategory = await db.category.create({
    data: {
      name: category.name,
    },
    select: {
      name: true,
      created_at: true,
    },
  });

  return {
    newCategory,
  };
};
