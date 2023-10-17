import express from "express";
import { db } from "../utils/db.server";

type Product = {
  category_id: number;
  name: string;
  description: string;
  price: number;
  discount_price: number;
  quantity: number;
  contact: string;
  location: string;
};

export const addProduct = async (
  product: Omit<Product, "id">
): Promise<{ newProduct: Product }> => {
  const {
    category_id,
    name,
    description,
    price,
    discount_price,
    quantity,
    contact,
    location,
  } = product;

  const newProduct = await db.product.create({
    data: {
      category_id,
      name,
      description,
      price,
      discount_price,
      quantity,
      contact,
      location,
    },
    select: {
      category_id: true,
      name: true,
      description: true,
      price: true,
      discount_price: true,
      quantity: true,
      contact: true,
      location: true,
    },
  });
  return {
    newProduct,
  };
};

export const listProduct = async (
  req: express.Request
): Promise<{
  products: Product[];
  total: number;
}> => {
  const { page, limit } = req.query as {
    page: string;
    limit: string;
  };

  const offset = (parseInt(page) - 1) * parseInt(limit);

  const products = await db.product.findMany({
    take: parseInt(limit),
    skip: offset,
    select: {
      category_id: true,
      name: true,
      description: true,
      price: true,
      discount_price: true,
      quantity: true,
      contact: true,
      location: true,
    },
  });

  return {
    total: products.length,
    products,
  };
};

export const getProduct = async (
  id: number
): Promise<{ getProduct: Product | null }> => {
  const getProduct = await db.product.findUnique({
    where: {
      id,
    },
    select: {
      category_id: true,
      name: true,
      description: true,
      price: true,
      discount_price: true,
      quantity: true,
      contact: true,
      location: true,
    },
  });
  return {
    getProduct,
  };
};

export const updateProduct = async (
  product: Omit<Product, "id">,
  id: number
): Promise<Product> => {
  const {
    category_id,
    name,
    description,
    price,
    discount_price,
    quantity,
    contact,
    location,
  } = product;

  return db.product.update({
    where: {
      id,
    },
    data: {
      category_id,
      name,
      description,
      price,
      discount_price,
      quantity,
      contact,
      location,
    },
    select: {
      category_id: true,
      name: true,
      description: true,
      price: true,
      discount_price: true,
      quantity: true,
      contact: true,
      location: true,
    },
  });
};
