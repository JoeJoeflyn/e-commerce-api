import express from "express";
import { db } from "../utils/db.server";

export const addCategory = async (
  category: Omit<{ name: string }, "id">
): Promise<{ newCategory: { name: string; created_at: Date } }> => {
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
